
import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { empid, empname, emppass, emprole, department, designation} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = `
      UPDATE employee_table
      SET ename = @empname, 
          pass = @emppass, 
          role = @emprole, 
          department = @department, 
          designation = @designation
      WHERE eid = @empid;
    `;
      
      await pool.request()
        .input('empid', sql.VarChar, empid)            // Bind @fid as an Int
        .input('empname', sql.VarChar, empname)  // Bind @faname as VarChar (for string)
        .input('emppass', sql.VarChar, emppass)  // Bind @fapass as VarChar (for password)
        .input('emprole', sql.VarChar, emprole)  // Bind @faroll as VarChar (for role)
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