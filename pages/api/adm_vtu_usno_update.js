import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { adm_year,usno,old_usno,s_name,f_name,m_name,course} = req.body;            
    try {
        const pool = await connectToDatabase();
        // Insert data into the database
        const query = `
        UPDATE admission_master
        SET adm_year = @adm_year, 
            usno = @usno, 
            s_name = @s_name, 
            f_name = @f_name, 
            m_name = @m_name,           
            course = @course
        WHERE old_usno = @old_usno and adm_year = @adm_year; `;
  
        await pool.request()
        .input('adm_year', sql.Date, adm_year) 
        .input('usno', sql.VarChar, usno) 
        .input('old_usno', sql.VarChar, old_usno)  
        .input('s_name', sql.VarChar, s_name)   
        .input('f_name', sql.VarChar, f_name)  
        .input('m_name', sql.VarChar, m_name)  
        .input('course', sql.VarChar, course)   
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