import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { adm_year,usno,old_usno,course,old_brcode} = req.body;            
    try {
        const pool = await connectToDatabase();
        // Insert data into the database
        const query = ` use aittest;
        UPDATE admission_master
        SET adm_year = @adm_year, 
            old_usno = usno,
            usno = @usno,          
            course = @course,
            old_brcode = @old_brcode
        WHERE usno = @usno and adm_year = @adm_year; `;
  
        await pool.request()
        .input('adm_year', sql.Date, adm_year) 
        .input('usno', sql.VarChar, usno) 
        .input('old_usno', sql.VarChar, old_usno)  
        .input('course', sql.VarChar, course)
        .input('old_brcode', sql.VarChar, old_brcode)   
        .query(query);

        res.status(200).json({ message: 'Data Updated successfully' });
    } catch (error) {
      console.error('Error updating data', error);
      res.status(500).json({ message: 'Error updating data', error });
    }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }  
}