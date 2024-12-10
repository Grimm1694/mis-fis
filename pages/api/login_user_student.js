import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';
import bcrypt from 'bcrypt';

export default async function getEmployee(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, password } = req.body;

  try {
    // Connect to the database
    const pool = await connectToDatabase();

    // Query the database for the employee with the provided userId
    const result = await pool
      .request()
      .input('userId', sql.VarChar, userId)
      .query(`
        USE aittest;
        SELECT usno,sname, role, pass, department
        FROM user_student 
        WHERE uid = @userId
      `);

    // Access the employee record directly from the recordset array
    const student = result.recordset[0];
    console.log('msg',student)
    // Check if employee exists
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
   /*  const passwordMatch = await bcrypt.compare(password, employee.pass);
    console.log('match',passwordMatch)*/

    if (password === student.pass) {
        res.status(200).json({ success: true, usno: student.usno, name: student.sname, role: student.role, department:student.department });
    } 
    else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
