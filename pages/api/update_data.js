
import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { faid, faname, fapass, farole, department, designation} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = `
      UPDATE faculty_table
      SET fname = @faname, 
          pass = @fapass, 
          role = @farole, 
          department = @department, 
          designation = @designation
      WHERE fid = @faid;
    `;
      
      await pool.request()
        .input('faid', sql.VarChar, faid)            // Bind @fid as an Int
        .input('faname', sql.VarChar, faname)  // Bind @faname as VarChar (for string)
        .input('fapass', sql.VarChar, fapass)  // Bind @fapass as VarChar (for password)
        .input('farole', sql.VarChar, farole)  // Bind @faroll as VarChar (for role)
        .input('department', sql.VarChar, department)  // Bind @fapass as VarChar (for password)
        .input('designation', sql.VarChar, designation)  // Bind @faroll as VarChar (for role)
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