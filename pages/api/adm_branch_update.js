
import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { brcode,brcode_title} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = `
      UPDATE branch
      SET brcode = @brcode,
          brcode_title = @brcode_title 
      WHERE brcode = @brcode;
    `;
      
      await pool.request()
        .input('brcode', sql.VarChar, brcode)            // Bind @fid as an Int
        .input('brcode_title', sql.VarChar, brcode_title)  // Bind @faname as VarChar (for string)
        .query(query);

      res.status(200).json({ message: 'Data Updated successfully' });
    } catch (error) {
      console.error('Error inserting data', error);
      res.status(500).json({ message: 'Error inserting data', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }  
}