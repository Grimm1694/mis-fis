import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pool = await connectToDatabase();

      const query = `
        USE aittest;
        SELECT [brcode], [brcode_title]
        FROM [dbo].[branch];
      `;

      const result = await pool.request().query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ message: 'Error fetching branches' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
