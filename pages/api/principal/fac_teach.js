import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branch } = req.query;

    

    try {
      const pool = await connectToDatabase();

      const query = `
        USE aittest;
        SELECT te.id, te.employee_id, fp.faculty_name, te.instituteName, te.fromDate, te.toDate, 
               te.Designation, te.departmentName
        FROM dbo.TeachingExperience AS te
        INNER JOIN dbo.facultyPersonalDetails AS fp
        ON te.employee_id = fp.employee_id;
       
      `;

      const result = await pool
        .request()
        .input('branch', branch)
        .query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching TeachingExperience data: ", error);
      res.status(500).json({ message: "Error fetching TeachingExperience data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
