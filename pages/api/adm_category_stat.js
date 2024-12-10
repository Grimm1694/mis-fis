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
            // Fetch the branch statistics and total count
            const result = await pool
            .request()
            .input('admissionYear', sql.Date, admission_year) // Assuming admission_year is an integer
            .query(`
                SELECT 
                course AS Branch, COUNT(*) AS Count,
                SUM(CASE WHEN category = '1G' THEN 1 ELSE 0 END) AS Cat_1G,
                SUM(CASE WHEN category = '2A' THEN 1 ELSE 0 END) AS Cat_2A,
                SUM(CASE WHEN category = '2B' THEN 1 ELSE 0 END) AS Cat_2B,
                SUM(CASE WHEN category = '3A' THEN 1 ELSE 0 END) AS Cat_3A,
                SUM(CASE WHEN category = '3B' THEN 1 ELSE 0 END) AS Cat_3B,
                SUM(CASE WHEN category = 'GM' THEN 1 ELSE 0 END) AS GM,
                SUM(CASE WHEN category = 'SC' THEN 1 ELSE 0 END) AS SC,
                SUM(CASE WHEN category = 'ST' THEN 1 ELSE 0 END) AS ST,
                SUM(CASE WHEN category = 'NRI' THEN 1 ELSE 0 END) AS Mgmt,
                SUM(CASE WHEN category = 'Others' THEN 1 ELSE 0 END) AS Others,
                           
                (SELECT COUNT(*) FROM dbo.admission_master) AS TotalCount
               
				FROM dbo.admission_master where adm_year = @admissionYear
                GROUP BY course
                ORDER BY course;
            `);

            const categoryStatistics = result.recordsets[0]; // First result set is branch statistics
            const totalCount = categoryStatistics.length > 0 ? categoryStatistics[0].TotalCount : 0; // TotalCount from the first record
            res.status(200).json({ categoryStatistics, totalCount });

        } catch (error) {
            console.error('Error fetching branch statistics:', error);
            res.status(500).json({ message: 'Error fetching branch statistics', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
