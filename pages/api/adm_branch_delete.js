import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req , res) {
    if (req.method === 'POST') {
        const { brcode, brcode_title } = req.body; // Expecting student detail to delete

        if (!brcode || !brcode_title) {
        return res.status(400).json({ message: 'Branch is required' });
        }
        try {
            const pool = await connectToDatabase();
            // Delete data from the database
            const query = 'DELETE FROM dbo.branch WHERE brcode = @brcode and brcode_title = @brcode_title';
            await pool.request()
            .input('brcode', sql.VarChar, brcode) // Bind @usno as VarChar
            .input('brcode_title', sql.VarChar, brcode_title) // Bind @s_name as VarChar
            .query(query);

            res.status(200).json({ message: 'Data deleted successfully' });
        } catch (error) {
            console.error('Error deleting data', error);
            res.status(500).json({ message: 'Error deleting data', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
