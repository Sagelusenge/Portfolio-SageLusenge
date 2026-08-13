import bcrypt from 'bcryptjs';
import pool from '../db.js';
import 'dotenv/config';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  console.error('Définissez ADMIN_EMAIL et ADMIN_PASSWORD (8 caractères minimum) dans .env.');
  process.exit(1);
}
const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await pool.execute(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES (?, ?, ?, 'admin')
   ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), is_active = 1`,
  [ADMIN_NAME || 'Sage Lusenge', ADMIN_EMAIL.toLowerCase(), hash],
);
await pool.end();
console.log('Compte administrateur créé ou mis à jour.');
