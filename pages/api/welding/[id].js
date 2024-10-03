import { db } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { jobid, material, thickness, weldingtype, settings } = req.body;

    try {
      const result = await db.query(
        'UPDATE welding SET jobid = $1, material = $2, thickness = $3, weldingtype = $4, settings = $5 WHERE id = $6 RETURNING *',
        [jobid, material, thickness, weldingtype, settings, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error updating welding data' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.query('DELETE FROM welding WHERE id = $1', [id]);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting welding data' });
    }
  }
  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
