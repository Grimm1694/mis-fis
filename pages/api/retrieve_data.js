import { connectToDatabase } from '../../app/config/dbconfig';

 export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query("use aittest; select * from dbo.faculty_table"); // Replace with your table name

    res.status(200).json({ data: result.recordset });
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({ message: "Error fetching data" });
  }
} 