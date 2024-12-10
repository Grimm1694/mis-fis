import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { usno, c_semester, p_semester,eligibility} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = `
      UPDATE admission_master
      SET eligibility = @eligibility,
          c_semester = @c_semester,
          p_semester = @p_semester
      WHERE usno =  @usno;
    `;
      
      await pool.request()
        .input('usno', sql.VarChar, usno)            // Bind @fid as an Int
        .input('c_semester', sql.Int, c_semester)  
        .input('p_semester', sql.Int, p_semester)  
        .input('eligibility', sql.Int, eligibility)
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