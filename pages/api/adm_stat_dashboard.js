import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

 
export default async function handler(req, res) {
    try {
      // Connect to the MSSQL database
      let pool = await connectToDatabase();
  
      // Execute the SQL query
      let result = await pool.request().query(`use aittest;
        SELECT 
        COUNT(*) AS total_students,
        SUM(CASE WHEN gender = 'Male      ' THEN 1 ELSE 0 END) AS boy_students,
        SUM(CASE WHEN gender = 'Female    ' THEN 1 ELSE 0 END) AS girl_students,
	      SUM(CASE WHEN category = 'SC' THEN 1 ELSE 0 END) AS SC,
	      SUM(CASE WHEN category = 'ST' THEN 1 ELSE 0 END) AS ST,
	      SUM(CASE WHEN quota = 'MANAGEMENT' THEN 1 ELSE 0 END) AS Mgmt,
        SUM(CASE WHEN phy_challenged = 1 THEN 1 ELSE 0 END) AS phyChlg
        FROM admission_master
      `);
  
      // Respond with the result
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching student stats');
    }
  };