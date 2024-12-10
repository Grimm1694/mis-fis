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
                course AS brcode,
                SUM(CASE WHEN quota = 'GQ(E004)' THEN 1 ELSE 0 END) AS aidedAdmitted,
                SUM(CASE WHEN quota = 'GQ(E060)' THEN 1 ELSE 0 END) AS unaidedAdmitted, 
                SUM(CASE WHEN quota = 'COMED-K' THEN 1 ELSE 0 END) AS comedkAdmitted,
                SUM(CASE WHEN quota = 'MANAGEMENT' THEN 1 ELSE 0 END) AS mqAdmitted,
                SUM(CASE WHEN quota = 'SNQ' THEN 1 ELSE 0 END) AS snqAdmitted,
                SUM(CASE WHEN quota = 'PMSS' THEN 1 ELSE 0 END) AS pmssAdmitted,
                SUM(CASE WHEN quota = 'JK' THEN 1 ELSE 0 END) AS jkAdmitted,
                SUM(CASE WHEN quota = 'NRI' THEN 1 ELSE 0 END) AS nriAdmitted,  
                SUM(CASE WHEN quota = 'GOI' THEN 1 ELSE 0 END) AS goiAdmitted        
				FROM dbo.admission_master where adm_year = @admissionYear
                GROUP BY course
            `);

            const admStatistics = result.recordsets[0]; // First result set is branch statistics
            res.status(200).json({ admStatistics});

        } catch (error) {
            console.error('Error fetching branch statistics:', error);
            res.status(500).json({ message: 'Error fetching branch statistics', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
