import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branch } = req.query;

   
    try {
      const pool = await connectToDatabase();

      // Fetching education details by joining tables, including faculty name
      const query = `
        USE aittest;
        SELECT edu.employee_id, fp.faculty_name, edu.Program, edu.regNo, edu.schoolCollege, 
               edu.specialization, edu.mediumOfInstruction, edu.passClass, edu.yearOfAward
        FROM dbo.facultyEducation AS edu
        INNER JOIN dbo.facultyPersonalDetails AS fp
        ON edu.employee_id = fp.employee_id;
        
      `;

      const result = await pool
        .request()
        .input('branch', branch)
        .query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching education data: ", error);
      res.status(500).json({ message: "Error fetching education data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
