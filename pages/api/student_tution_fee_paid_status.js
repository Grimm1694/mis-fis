import sql from 'mssql';
import dbConfig from '../../app/config/dbconfig'; // Import your database configuration

export default async function handler(req, res) {
  try {
    const { usno, academic_year } = req.query;

    if (!usno || !academic_year) {
      return res.status(400).json({ error: 'Missing required parameters: usno or academic_year' });
    }

    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Query to check tuition fee payment status
    const result = await pool
      .request()
      .input('usno', sql.VarChar, usno)
      .input('academic_year', sql.VarChar, academic_year)
      .query(`
        SELECT * 
        FROM accounts_fee_demand 
        WHERE usno = @usno AND academic_year = @academic_year
      `);

    const fee_demand = result.recordset[0]; // Retrieve the first record

    if (fee_demand) {
      // Check if the `paid_status` column equals 1
      const status = fee_demand.paid_status === 1 ? 'Paid' : 'Not Paid';
      const total_fee = fee_demand.total_fee;

      // Respond with the fee payment status
      res.status(200).json({ status, total_fee });
    } else {
      // No record found for the given usno and academic year
      res.status(404).json({ status: 'Not Paid' });
    }
  } catch (error) {
    console.error('Error fetching fee status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
