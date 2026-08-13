import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import webpush from "web-push";
import { z } from "zod";
import pool from "./db.js";
import "dotenv/config";

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../dist/client");

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "3mb" }));

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
if (vapidPublicKey && vapidPrivateKey)
  webpush.setVapidDetails(
    "mailto:sagelusenge@gmail.com",
    vapidPublicKey,
    vapidPrivateKey,
  );

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });
app.use("/api", publicLimiter);

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(190),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(3000),
});

const loginSchema = z.object({
  email: z.email().max(190),
  password: z.string().min(8).max(128),
});

const feedbackSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(120).optional().default(""),
  email: z.email().max(190),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(10).max(1200),
});

const projectSchema = z.object({
  title: z.string().trim().min(2).max(140),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  stack: z.array(z.string().trim().min(1).max(40)).min(1).max(10),
  href: z.url().max(500),
  image_url: z
    .union([z.url().max(500), z.literal("")])
    .optional()
    .default(""),
  image_data: z
    .string()
    .max(2500000)
    .refine(
      (value) =>
        !value || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value),
      "Image invalide",
    )
    .optional()
    .default(""),
  tone: z.enum(["cyan", "violet", "blue", "indigo"]).default("cyan"),
  published: z.boolean().default(true),
});

function mapProject(row) {
  const project = {
    ...row,
    image: row.image_data || row.image,
    stack: String(row.stack)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    published: Boolean(row.published),
    archived: Boolean(row.archived_at),
  };
  delete project.image_data;
  return project;
}

async function ensureRuntimeSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS push_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    endpoint_hash CHAR(64) NOT NULL UNIQUE,
    subscription_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  const [columns] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio_projects'",
  );
  const names = new Set(columns.map((column) => column.COLUMN_NAME));
  if (!names.has("image_data"))
    await pool.query(
      "ALTER TABLE portfolio_projects ADD COLUMN image_data LONGTEXT NULL AFTER image_url",
    );
  if (!names.has("archived_at"))
    await pool.query(
      "ALTER TABLE portfolio_projects ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL AFTER published",
    );
}

async function notifyAdmin(title, body, url = "/admin") {
  if (!vapidPublicKey || !vapidPrivateKey) return;
  const [rows] = await pool.query(
    "SELECT id, subscription_json FROM push_subscriptions",
  );
  await Promise.allSettled(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(
          JSON.parse(row.subscription_json),
          JSON.stringify({ title, body, url, icon: "/icon-192.png" }),
        );
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410)
          await pool.execute("DELETE FROM push_subscriptions WHERE id = ?", [
            row.id,
          ]);
      }
    }),
  );
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : "";
  const secret = process.env.JWT_SECRET;
  if (!token || !secret)
    return res.status(401).json({ message: "Session invalide ou expirée." });
  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== "admin")
      return res.status(403).json({ message: "Accès refusé." });
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Session invalide ou expirée." });
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "degraded", database: "unavailable" });
  }
});

app.post("/api/views", async (req, res) => {
  const page =
    typeof req.body?.page === "string" ? req.body.page.slice(0, 120) : "/";
  await pool.execute("INSERT INTO site_views (page) VALUES (?)", [page]);
  res.status(201).json({ counted: true });
});

app.get("/api/projects", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, title, category, description, stack, href, image_url AS image, image_data, tone, published, created_at FROM portfolio_projects WHERE published = 1 AND archived_at IS NULL ORDER BY created_at DESC",
  );
  res.json({ projects: rows.map(mapProject) });
});

app.post("/api/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Veuillez vérifier les informations saisies." });
  try {
    const { name, email, subject, message } = parsed.data;
    await pool.execute(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email.toLowerCase(), subject, message],
    );
    void notifyAdmin("Nouveau message", `${name} — ${subject}`, "/admin");
    return res
      .status(201)
      .json({ message: "Votre message a bien été envoyé." });
  } catch (error) {
    console.error("Contact error:", error.message);
    return res
      .status(500)
      .json({ message: "Le service est momentanément indisponible." });
  }
});

app.get("/api/feedbacks", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, role, rating, message, created_at FROM feedbacks WHERE status = 'approved' ORDER BY created_at DESC LIMIT 30",
  );
  res.json({ feedbacks: rows });
});

app.post("/api/feedbacks", async (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Veuillez vérifier les informations saisies." });
  const { name, role, email, rating, message } = parsed.data;
  await pool.execute(
    "INSERT INTO feedbacks (name, role, email, rating, message) VALUES (?, ?, ?, ?, ?)",
    [name, role || null, email.toLowerCase(), rating, message],
  );
  void notifyAdmin(
    "Nouvel avis à valider",
    `${name} a laissé un avis de ${rating}/5.`,
    "/admin",
  );
  res
    .status(201)
    .json({ message: "Merci ! Ton avis sera publié après validation." });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Identifiants invalides." });
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
      [parsed.data.email.toLowerCase()],
    );
    const user = rows[0];
    if (
      !user ||
      !(await bcrypt.compare(parsed.data.password, user.password_hash))
    ) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res
        .status(500)
        .json({ message: "Configuration serveur incomplète." });
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, {
      expiresIn: "2h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Le service est momentanément indisponible." });
  }
});

app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  const status = ["new", "read", "replied", "archived"].includes(
    req.query.status,
  )
    ? req.query.status
    : null;
  const [rows] = status
    ? await pool.execute(
        "SELECT id, name, email, subject, message, status, created_at FROM contact_messages WHERE status = ? ORDER BY created_at DESC",
        [status],
      )
    : await pool.query(
        "SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC",
      );
  res.json({ messages: rows });
});

app.patch("/api/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status;
  if (
    !Number.isInteger(id) ||
    !["new", "read", "replied", "archived"].includes(status)
  )
    return res.status(400).json({ message: "Données invalides." });
  const [result] = await pool.execute(
    "UPDATE contact_messages SET status = ? WHERE id = ?",
    [status, id],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Message introuvable." });
  res.json({ message: "Statut mis à jour." });
});

app.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ message: "Identifiant invalide." });
  const [result] = await pool.execute(
    "DELETE FROM contact_messages WHERE id = ?",
    [id],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Message introuvable." });
  res.status(204).end();
});

app.get("/api/admin/feedbacks", requireAdmin, async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, role, email, rating, message, status, created_at FROM feedbacks ORDER BY created_at DESC",
  );
  res.json({ feedbacks: rows });
});

app.patch("/api/admin/feedbacks/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status;
  if (
    !Number.isInteger(id) ||
    !["pending", "approved", "rejected"].includes(status)
  )
    return res.status(400).json({ message: "Données invalides." });
  const [result] = await pool.execute(
    "UPDATE feedbacks SET status = ? WHERE id = ?",
    [status, id],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Avis introuvable." });
  res.json({ message: "Avis mis à jour." });
});

app.delete("/api/admin/feedbacks/:id", requireAdmin, async (req, res) => {
  const [result] = await pool.execute("DELETE FROM feedbacks WHERE id = ?", [
    Number(req.params.id),
  ]);
  if (!result.affectedRows)
    return res.status(404).json({ message: "Avis introuvable." });
  res.status(204).end();
});

app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
  const [[totals], [daily]] = await Promise.all([
    pool.query(
      "SELECT COUNT(*) AS total, SUM(viewed_at >= CURDATE()) AS today, SUM(viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS week FROM site_views",
    ),
    pool.query(
      "SELECT DATE(viewed_at) AS date, COUNT(*) AS views FROM site_views WHERE viewed_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(viewed_at) ORDER BY date",
    ),
  ]);
  res.json({
    views: {
      total: Number(totals[0]?.total || 0),
      today: Number(totals[0]?.today || 0),
      week: Number(totals[0]?.week || 0),
      daily,
    },
  });
});

app.get("/api/admin/push/public-key", requireAdmin, (_req, res) => {
  if (!vapidPublicKey)
    return res.status(503).json({ message: "Notifications non configurées." });
  res.json({ publicKey: vapidPublicKey });
});

app.post("/api/admin/push/subscribe", requireAdmin, async (req, res) => {
  const subscription = req.body?.subscription;
  if (
    !subscription?.endpoint ||
    !subscription?.keys?.p256dh ||
    !subscription?.keys?.auth
  )
    return res
      .status(400)
      .json({ message: "Abonnement de notification invalide." });
  const hash = crypto
    .createHash("sha256")
    .update(subscription.endpoint)
    .digest("hex");
  await pool.execute(
    "INSERT INTO push_subscriptions (endpoint_hash, subscription_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE subscription_json = VALUES(subscription_json)",
    [hash, JSON.stringify(subscription)],
  );
  res.status(201).json({ message: "Notifications activées." });
});

app.get("/api/admin/projects", requireAdmin, async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, title, category, description, stack, href, image_url AS image, image_data, tone, published, archived_at, created_at FROM portfolio_projects ORDER BY created_at DESC",
  );
  res.json({ projects: rows.map(mapProject) });
});

app.post("/api/admin/projects", requireAdmin, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Veuillez vérifier les informations du projet." });
  const p = parsed.data;
  const [result] = await pool.execute(
    "INSERT INTO portfolio_projects (title, category, description, stack, href, image_url, image_data, tone, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      p.title,
      p.category,
      p.description,
      p.stack.join(","),
      p.href,
      p.image_url || null,
      p.image_data || null,
      p.tone,
      p.published,
    ],
  );
  res
    .status(201)
    .json({ id: result.insertId, message: "Réalisation ajoutée." });
});

app.patch("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Veuillez vérifier les informations du projet." });
  const p = parsed.data;
  const [result] = await pool.execute(
    "UPDATE portfolio_projects SET title=?, category=?, description=?, stack=?, href=?, image_url=?, image_data=?, tone=?, published=? WHERE id=?",
    [
      p.title,
      p.category,
      p.description,
      p.stack.join(","),
      p.href,
      p.image_url || null,
      p.image_data || null,
      p.tone,
      p.published,
      Number(req.params.id),
    ],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Réalisation introuvable." });
  res.json({ message: "Réalisation mise à jour." });
});

app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  const [result] = await pool.execute(
    "UPDATE portfolio_projects SET archived_at = NOW(), published = 0 WHERE id = ?",
    [Number(req.params.id)],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Réalisation introuvable." });
  res.status(204).end();
});

app.post("/api/admin/projects/:id/restore", requireAdmin, async (req, res) => {
  const [result] = await pool.execute(
    "UPDATE portfolio_projects SET archived_at = NULL WHERE id = ?",
    [Number(req.params.id)],
  );
  if (!result.affectedRows)
    return res.status(404).json({ message: "Réalisation introuvable." });
  res.json({ message: "Réalisation restaurée." });
});

app.use(express.static(clientDist));
app.get("/*splat", (_req, res) =>
  res.sendFile(path.join(clientDist, "index.html")),
);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Une erreur inattendue est survenue." });
});

await ensureRuntimeSchema();
app.listen(port, () =>
  console.log(`Portfolio API ready on http://localhost:${port}`),
);
