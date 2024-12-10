import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req , res) {
  if (req.method === 'POST') {
    const { faid,faname } = req.body; // Expecting faculty ID to delete

    if (!faid) {
      return res.status(400).json({ message: 'Faculty ID is required' });
    }

    try {
      const pool = await connectToDatabase();
      // Delete data from the database
      const query = `
        DELETE FROM dbo.faculty_table
        WHERE fid = @faid and faname = @faname
      `;

      await pool.request()
        .input('faid', sql.VarChar, faid) // Bind @faid as VarChar
        .input('faname', sql.VarChar, faname) // Bind @faid as VarChar
        .query(query);

      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Error deleting data', error);
      res.status(500).json({ message: 'Error deleting data', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
