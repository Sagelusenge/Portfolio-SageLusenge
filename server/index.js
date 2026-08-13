import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pool from './db.js';
import 'dotenv/config';

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../dist/client');

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });
app.use('/api', publicLimiter);

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

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return res.status(401).json({ message: 'Session invalide ou expirée.' });
  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Accès refusé.' });
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Session invalide ou expirée.' });
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'unavailable' });
  }
});

app.post('/api/contact', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Veuillez vérifier les informations saisies.' });
  try {
    const { name, email, subject, message } = parsed.data;
    await pool.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), subject, message],
    );
    return res.status(201).json({ message: 'Votre message a bien été envoyé.' });
  } catch (error) {
    console.error('Contact error:', error.message);
    return res.status(500).json({ message: 'Le service est momentanément indisponible.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Identifiants invalides.' });
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
      [parsed.data.email.toLowerCase()],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'Configuration serveur incomplète.' });
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '2h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Le service est momentanément indisponible.' });
  }
});

app.get('/api/admin/messages', requireAdmin, async (req, res) => {
  const status = ['new', 'read', 'replied', 'archived'].includes(req.query.status) ? req.query.status : null;
  const [rows] = status
    ? await pool.execute('SELECT id, name, email, subject, message, status, created_at FROM contact_messages WHERE status = ? ORDER BY created_at DESC', [status])
    : await pool.query('SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC');
  res.json({ messages: rows });
});

app.patch('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status;
  if (!Number.isInteger(id) || !['new', 'read', 'replied', 'archived'].includes(status)) return res.status(400).json({ message: 'Données invalides.' });
  const [result] = await pool.execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Message introuvable.' });
  res.json({ message: 'Statut mis à jour.' });
});

app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Identifiant invalide.' });
  const [result] = await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Message introuvable.' });
  res.status(204).end();
});

app.use(express.static(clientDist));
app.get('/*splat', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
});

app.listen(port, () => console.log(`Portfolio API ready on http://localhost:${port}`));
