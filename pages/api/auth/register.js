import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

    try {
      const result = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
