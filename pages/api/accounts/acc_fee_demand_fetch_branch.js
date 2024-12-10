import { connectToDatabase } from '../../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { academic_year, department } = req.query; // Get the academic_year from the query parameters
        if (!academic_year) {
        return res.status(400).json({ error: 'Academic year is required' });
        }
        try {
            const pool = await connectToDatabase();
            // Fetch the branch statistics and total count
            const result = await pool
            .request()
            .input('academicYear', sql.VarChar, academic_year) // Assuming admission_year is an integer
            .input('department', sql.VarChar, department)
            .query(`
                USE aittest;
                SELECT DISTINCT 
                    usno,
                    s_name,
                    brcode,semester,total_fee,
                    CASE 
                        WHEN paid_status = 1 THEN 'Paid' 
                        ELSE 'Not Paid' 
                    END AS paid_status              
                FROM dbo.accounts_fee_demand 
                WHERE academic_year = @academicYear  and brcode = @department
                ORDER BY  semester,usno;
            `);
            
            const feeDemand = result.recordsets[0]; // First result set is branch statistics
            //const totalCount = branchStatistics.length > 0 ? branchStatistics[0].TotalCount : 0; // TotalCount from the first record

            res.status(200).json({ feeDemand });
        } catch (error) {
            console.error('Error fetching fee demand:', error);
            res.status(500).json({ message: 'Error fetching fee demand', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
