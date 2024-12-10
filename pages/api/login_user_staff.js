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
        SELECT ename, role, pass,department, eid as emp_id 
        FROM employee_table 
        WHERE eid = @userId
      `);

    // Access the employee record directly from the recordset array
    const employee = result.recordset[0];
    console.log('msg',employee)
    // Check if employee exists
    if (!employee) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
   /*  const passwordMatch = await bcrypt.compare(password, employee.pass);
    console.log('match',passwordMatch)*/

    if (password === employee.pass) {
        res.status(200).json({ success: true, name: employee.ename, role: employee.role, department:employee.department, emp_id: employee.eid });
    } 
    else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
