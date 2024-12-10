import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';


export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const pool = await connectToDatabase();

    const results = await pool.request()
      .input('query', sql.VarChar, `%${query}%`)
      .query(`use aittest;
        SELECT s_name, usno, st_email, st_mobile, parent_mobile 
        FROM admission_master 
        WHERE s_name LIKE @query OR usno LIKE @query OR st_email LIKE @query
      `);

    res.status(200).json({ results: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
