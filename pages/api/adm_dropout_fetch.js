// pages/api/admissions.js
import {connectToDatabase} from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { admission_year } = req.query;
      if (!admission_year) {
        return res.status(400).json({ error: 'Admission year is required' });
      }  
      try {
        let pool = await connectToDatabase();
        const result = await pool
          .request()
          .input('admissionYear', sql.Date, admission_year)
          .query(`
            SELECT adm_year, usno, s_name, f_name, m_name, course, discontinued, discontinued_date
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
  