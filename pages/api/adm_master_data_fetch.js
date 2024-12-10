// pages/api/admissions.js
import {connectToDatabase} from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { admission_year } = req.query; // Get the admission_year from the query parameters
    if (!admission_year) {
      return res.status(400).json({ error: 'Admission year is required' });
    }

    try {
      let pool = await connectToDatabase();
      const result = await pool
        .request()
        .input('admissionYear', sql.Date, admission_year) // Assuming admission_year is an integer
        .query(`
          SELECT adm_year, usno, s_name, f_name, m_name, dob, gender, phy_challenged, st_email, st_mobile,
          parent_mobile, gardian_mobile, blood_group, adhar_no, f_occupation, annual_income, nationality, religion, caste, 
          category, state_student, district, permanent_adrs, local_adrs, sslc_percent, puc_percent, phy_marks, 
          c_b_ec_cs, maths, total_pcm, pcm_percent, qual_exam, board, state_puc, puc_usno, year_pass, 
          rank_from, cet_reg, cet_rank, seat_allot_date, category_claimed, category_allot_under, course, 
          adm_date, amt_col, col_fee_receipt, col_fee_rec_date, amt_cet, semester, quota, col_code, 
          cet_no, doc_submitted, doc_to_be_submitted
          FROM dbo.admission_master
          WHERE adm_year = @admissionYear
        `);

      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}