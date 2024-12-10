import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  try {
    // Connect to the MSSQL database
    let pool = await connectToDatabase();

    // Execute the SQL query
    let result = await pool.request().query(`
    USE aittest;
    SELECT 
        COUNT(*) AS total_employee,
        SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS boy_emp,
        SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS girl_emp,
        SUM(CASE WHEN department = 'CS' THEN 1 ELSE 0 END) AS CS,
        SUM(CASE WHEN department = 'AE' THEN 1 ELSE 0 END) AS AE,
        SUM(CASE WHEN department = 'CV' THEN 1 ELSE 0 END) AS CV,
        SUM(CASE WHEN department = 'EC' THEN 1 ELSE 0 END) AS EC,
        SUM(CASE WHEN department = 'CH' THEN 1 ELSE 0 END) AS CH,
        SUM(CASE WHEN department = 'CB' THEN 1 ELSE 0 END) AS CB,
        SUM(CASE WHEN department = 'EE' THEN 1 ELSE 0 END) AS EE,
        SUM(CASE WHEN department = 'HS' THEN 1 ELSE 0 END) AS HS,
        SUM(CASE WHEN department = 'IM' THEN 1 ELSE 0 END) AS IM,
        SUM(CASE WHEN department = 'IT' THEN 1 ELSE 0 END) AS IT,
        SUM(CASE WHEN department = 'MA' THEN 1 ELSE 0 END) AS MA,
        SUM(CASE WHEN department = 'MBA' THEN 1 ELSE 0 END) AS MBA,
        SUM(CASE WHEN department = 'MCA' THEN 1 ELSE 0 END) AS MCA,
        SUM(CASE WHEN department = 'ME' THEN 1 ELSE 0 END) AS ME,
        SUM(CASE WHEN department = 'ML' THEN 1 ELSE 0 END) AS ML,
        SUM(CASE WHEN department = 'PH' THEN 1 ELSE 0 END) AS PH,
        SUM(CASE WHEN department = 'TE' THEN 1 ELSE 0 END) AS TE
    FROM facultyPersonalDetails;
    `);
    // Respond with the result
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching faculty stats");
  }
}
