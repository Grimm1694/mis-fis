import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { adm_year } = req.body;  // Only adm_year needed for this update
        try {
            // Establish database connection
            const pool = await connectToDatabase();
            console.log('Database connected successfully');

            console.log(`Updating old_usno based on admission year: ${adm_year}`);

            // SQL query to update `old_usno` based on the `adm_year`
            const updateQuery = `
                UPDATE admission_master
                SET old_usno = usno
                WHERE adm_year = @adm_year
            `;

            // Execute the query
            const result = await pool.request()
                .input('adm_year', sql.VarChar, adm_year)  // Ensure type matches your DB column type
                .query(updateQuery);

            // Check rows affected
            if (result.rowsAffected[0] === 0) {
                console.warn('No rows updated. Check if adm_year matches any records.');
                return res.status(404).json({ message: 'No records found to update' });
            }

            console.log(`Rows affected: ${result.rowsAffected[0]}`);
            res.status(200).json({ message: 'USNO updated to OLD USNO successfully' });
        } catch (error) {
            console.error('Error updating USNO:', error);
            res.status(500).json({ message: 'Error updating USNO', error });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
