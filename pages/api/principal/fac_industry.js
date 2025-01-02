import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branch } = req.query;

   

    try {
      const pool = await connectToDatabase();

      const query = `
        USE aittest;
        SELECT 
          ie.id, 
          ie.employee_id, 
          fp.faculty_name, 
          ie.organization, 
          ie.designation, 
          ie.fromDate, 
          ie.toDate
        FROM dbo.IndustryExperience AS ie
        INNER JOIN dbo.facultyPersonalDetails AS fp
        ON ie.employee_id = fp.employee_id;
        
      `;

      const result = await pool
        .request()
        .input('branch', branch)
        .query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching IndustryExperience data: ", error);
      res.status(500).json({ message: "Error fetching IndustryExperience data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
