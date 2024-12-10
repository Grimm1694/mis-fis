import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { brcode, brcode_title} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = 'INSERT INTO dbo.branch (brcode,brcode_title)'+
       'VALUES (@brcode, @brcode_title)';
      
      await pool.request()
        .input('brcode', sql.VarChar, brcode)            
        .input('brcode_title', sql.VarChar, brcode_title)  
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