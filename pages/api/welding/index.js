import { db } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const weldingData = await db.query('SELECT * FROM welding');
    res.status(200).json(weldingData.rows);
  } else if (req.method === 'POST') {
    const { jobid, material, thickness, weldingtype, settings } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO welding (jobid, material, thickness, weldingtype, settings) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [jobid, material, thickness, weldingtype, settings]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error adding welding data' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
