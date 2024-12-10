import { connectToDatabase } from '../../app/config/dbconfig';
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const pool = await connectToDatabase();

    const query = `
      SELECT 
        [id], [employee_id], [qualification], [department], [photo], [title], [faculty_name],
        [emailId], [contactNo], [alternateContactNo], [emergencyContactNo], [adharNo], [panNo],
        [dob], [gender], [nationality], [firstAddressLine], [correspondenceAddressLine], [religion],
        [caste], [category], [motherTongue], [speciallyChallenged], [remarks], [languages],
        [bankName], [accountNo], [accountName], [accountType], [branch], [ifsc], [pfNumber],
        [uanNumber], [pensionNumber], [motherName], [fatherName], [spouseName], [children],
        [dateOfJoiningDrait], [designation], [aided]
      FROM [aittest].[dbo].[facultyPersonalDetails]
      WHERE [employee_id] = @employee_id
    `;

    const result = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    return res.status(500).json({ error: "Failed to fetch faculty details" });
  }
}
