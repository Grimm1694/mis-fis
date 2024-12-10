import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req , res) {
    if (req.method === 'POST') {
        const { usno,s_name } = req.body; // Expecting student detail to delete

        if (!usno || !s_name) {
        return res.status(400).json({ message: 'USNO or Student Name is required' });
        }
        console.log('message',usno)
        try {
            const pool = await connectToDatabase();
            // Delete data from the database
            const query = 'DELETE FROM dbo.admission_master WHERE usno = @usno and s_name = @s_name';
            await pool.request()
            .input('usno', sql.VarChar, usno) // Bind @usno as VarChar
            .input('s_name', sql.VarChar, s_name) // Bind @s_name as VarChar
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
