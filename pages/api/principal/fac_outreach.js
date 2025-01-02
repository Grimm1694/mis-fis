import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branch } = req.query;

   
    try {
      const pool = await connectToDatabase();

      const query = `
        USE aittest;
        SELECT oa.id, oa.employee_id, fp.faculty_name, oa.activity, oa.role, oa.fromDate, oa.toDate, oa.place
        FROM dbo.OutreachActivity AS oa
        INNER JOIN dbo.facultyPersonalDetails AS fp
        ON oa.employee_id = fp.employee_id;
        
      `;

      const result = await pool
        .request()
        .input('branch', branch)
        .query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching OutreachActivity data: ", error);
      res.status(500).json({ message: "Error fetching OutreachActivity data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
