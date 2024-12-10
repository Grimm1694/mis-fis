import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

 export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {admission_year} = req.query; // Get the admission_year from the query parameters
    if (!admission_year) {
      return res.status(400).json({ error: 'Admission year is required' });
    }
    try {
      const pool = await connectToDatabase();
      const result = await pool
      .request()
      .input('admissionYear', sql.Date, admission_year) // Assuming admission_year is an integer
      .query("use aittest; select * from dbo.admission_intake where adm_year = @admissionYear"); // Replace with your table name

    const admIntake = result.recordsets[0]; // First result set is branch statistics
    res.status(200).json({ admIntake});
    //res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching data: ", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
} 