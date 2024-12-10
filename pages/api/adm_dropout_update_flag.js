import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { usno, discontinued, discontinued_date} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = `
      UPDATE admission_master
      SET discontinued = @discontinued,
          discontinued_date = @discontinued_date
      WHERE usno =  @usno;
    `;
      
      await pool.request()
        .input('usno', sql.VarChar, usno)            // Bind @fid as an Int
        .input('discontinued', sql.Int, discontinued)  // Bind @faname as VarChar (for string)
        .input('discontinued_date', sql.Date, discontinued_date)  // Bind @faname as VarChar (for string)
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