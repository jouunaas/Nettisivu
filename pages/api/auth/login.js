import { db } from '../../../lib/db'; // Adjust this path according to your db connection file
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

const SECRET_KEY = process.env.JWT_SECRET; // Ensure you have a JWT secret in your environment variables

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Fetch the user from the database
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      // Generate a token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
