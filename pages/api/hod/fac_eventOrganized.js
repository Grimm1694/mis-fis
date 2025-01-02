import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branches } = req.query;

    if (!branches) {
      return res.status(400).json({ message: "Branches parameter is required" });
    }

    try {
      const pool = await connectToDatabase();
      const branchList = branches.split(',').map((branch) => `'${branch.trim()}'`).join(',');

      const query = `
      USE aittest;
      SELECT t.id, t.fromDate,fp.faculty_name, t.toDate, t.organizer, t.venue, t.sponsor, t.targetAudience,
             t.employee_id, t.nameofevent, t.typeofevent
      FROM dbo.EventOrganized AS t
      INNER JOIN dbo.facultyPersonalDetails AS fp
      ON t.employee_id = fp.employee_id
        WHERE fp.department IN (${branchList});
      `;

      const result = await pool.request().query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching data: ", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
