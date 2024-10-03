import { db } from '../../../lib/db'; // Adjust this path according to your db connection file
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

const SECRET_KEY = process.env.JWT_SECRET; // Ensure you have a JWT secret in your environment variables

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      // Insert the user into the database
      const result = await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );
      const newUser = result.rows[0];

      // Generate a token
      const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
