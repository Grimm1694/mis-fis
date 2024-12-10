import multer from 'multer';
import xlsx from 'xlsx';
import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

const upload = multer({ storage: multer.memoryStorage() });

// Helper function to convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
  const date = new Date((serial - 25569) * 86400 * 1000); // Excel date to JS date
  return new Date(date.toISOString().split('T')[0]); // Convert to Date object without time
};


export default function handler(req, res) {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Error in multer middleware:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Read the Excel file from the buffer
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        return res.status(400).json({ error: 'The uploaded Excel file is empty' });
      }

      // Connect to the MSSQL database
      const pool = await connectToDatabase();

      let rowsImported = 0;  // Track the number of rows imported

      for (const row of jsonData) {
        // Convert the date column (e.g., AdmissionYear) from Excel serial to JS Date
        let admissionYearValue,dobValue,seatAllotDateValue,admDateValue,clgRctDateValue;
        if (typeof row.AdmissionYear === 'number') {
          admissionYearValue = excelDateToJSDate(row.AdmissionYear);
          //console.log('Debugging Data:', admissionYearValue);
        } else {
          // Handle if the date is already a string or JS Date
          admissionYearValue = new Date(row.AdmissionYear);
        }
        // Validate the converted date
        if (isNaN(admissionYearValue.getTime())) {
          console.error('Invalid admission year:', row.AdmissionYear);
          continue; 
        }

        if (typeof row.DOB === 'number') {
          dobValue = excelDateToJSDate(row.DOB);
        } else {       
          dobValue = new Date(row.DOB);
        }        
        if (isNaN(dobValue.getTime())) {
          console.error('Invalid DOB:', row.DOB);
          continue; 
        }

        if (typeof row.SeatAllotDate === 'string') {
          seatAllotDateValue = excelDateToJSDate(row.SeatAllotDate);
        } else {       
          seatAllotDateValue = new Date(row.SeatAllotDate);
        }        
        if (isNaN(seatAllotDateValue.getTime())) {
          console.error('Invalid seat allotment date:', row.SeatAllotDate);
          continue; 
        }

        if (typeof row.AdmDate === 'number') {
          admDateValue = excelDateToJSDate(row.AdmDate);
        } else {       
          admDateValue = new Date(row.AdmDate);
        }        
        if (isNaN(admDateValue.getTime())) {
          console.error('Invalid Admission date:', row.AdmDate);
          continue; 
        }

        if (typeof row.ClgRectDate === 'number') {
          clgRctDateValue = excelDateToJSDate(row.ClgRectDate);
        } else {       
          aclgRctDateValue = new Date(row.ClgRectDate);
        }        
        if (isNaN(clgRctDateValue.getTime())) {
          console.error('Invalid Fee Rct date:', row.ClgRectDate);
          continue; 
        }

        let pcmPercentValue = parseFloat(row.PCMPer);
        let cetRankValue = String(row.CETRank).trim();

      // Insert data into the database
      //for (const row of jsonData) {
       /*  if (!row.FacultyID || !row.FacultyName || !row.Password || !row.Role || !row.Department || !row.Designation) {
          console.error('Missing required data in row:', row);
          continue;  // Skip this row and continue with the next
        } */
        const query ='INSERT INTO dbo.admission_master(adm_year,usno,s_name,f_name,m_name,dob,gender,phy_challenged,st_email,st_mobile,'+
            'parent_mobile,gardian_mobile,blood_group,adhar_no,f_occupation,annual_income,nationality,religion,caste,category,state_student,'+
            'district,permanent_adrs,local_adrs,sslc_percent,puc_percent,phy_marks,c_b_ec_cs,maths,total_pcm,pcm_percent,qual_exam,board,state_puc,'+
            'puc_usno,year_pass,rank_from,cet_reg,cet_rank,seat_allot_date,category_claimed,category_allot_under,course,adm_date,'+
            'amt_col,col_fee_receipt,col_fee_rec_date,amt_cet,semester,quota,col_code,cet_no,doc_submitted,doc_to_be_submitted)'+
            'VALUES (@adm_year, @usno, @s_name,@f_name,@m_name,@dob,@gender,@phy_challenged,@st_email,@st_mobile,@parent_mobile,@gardian_mobile,'+
            '@blood_group,@adhar_no,@f_occupation,@annual_income,@nationality,@religion,@caste,@category,@state_student,@district,@permanent_adrs,'+
            '@local_adrs,@sslc_percent,@puc_percent,@phy_marks,@c_b_ec_cs,@maths,@total_pcm,@pcm_percent,@qual_exam,@board,@state_puc,'+
            '@puc_usno,@year_pass,@rank_from,@cet_reg,@cet_rank,@seat_allot_date,@category_claimed,@category_allot_under,@course,@adm_date,'+
            '@amt_col,@col_fee_receipt,@col_fee_rec_date,@amt_cet,@semester,@quota,@col_code,@cet_no,@doc_submitted,@doc_to_be_submitted)';

        await pool.request()
        .input('adm_year', sql.Date, String(admissionYearValue))   
        .input('usno', sql.VarChar, row.USNO)  
        .input('s_name', sql.VarChar, row.SName)  
        .input('f_name', sql.VarChar, row.FName)        
        .input('m_name', sql.VarChar, row.MName)  
        .input('dob', sql.Date, dobValue)
        .input('gender', sql.VarChar, row.Gender)  
        .input('phy_challenged', sql.Bit, row.PhysicallyChallenged)  
        .input('st_email', sql.VarChar, row.EmailStudent)
        .input('st_mobile', sql.VarChar, String(row.PhoneStudent))        
        .input('parent_mobile', sql.VarChar, String(row.PhoneParent))   
        .input('gardian_mobile', sql.VarChar, String(row.PhoneGardian))  
        .input('blood_group', sql.VarChar, row.BloodGroup)  
        .input('adhar_no', sql.VarChar, row.AdhaarNum)  
        .input('f_occupation', sql.VarChar, row.FOccupation)        
        .input('annual_income', sql.Int, row.AnnualIncome) 
        .input('nationality', sql.VarChar, row.Nationality )   
        .input('religion', sql.VarChar, row.Relegion)  
        .input('caste', sql.VarChar, row.Caste)
        .input('category', sql.VarChar, row.Category)   
        .input('state_student', sql.VarChar, row.State)  
        .input('district', sql.VarChar, row.District)  
        .input('permanent_adrs', sql.VarChar, row.PermanentAddr)  
        .input('local_adrs', sql.VarChar, row.LocalAddr)       
        .input('sslc_percent', sql.Float, row.SSLCPer) 
        .input('puc_percent', sql.Float, row.PUCPer)
        .input('phy_marks', sql.Int, row.PhyMarks)  
        .input('c_b_ec_cs', sql.Int, row.CheMarks)  
        .input('maths', sql.Int, row.MathsMarks)   
        .input('total_pcm', sql.Int, row.PCMTotal)  
        .input('pcm_percent', sql.Float, pcmPercentValue) 
        .input('qual_exam', sql.VarChar, row.QualExam)  
        .input('board', sql.VarChar, row.Board)  
        .input('state_puc', sql.VarChar,row.StatePUC)   
        .input('puc_usno', sql.VarChar, String(row.PUCUsn)) 
        .input('year_pass', sql.Int, row.YearPass)  
        .input('rank_from', sql.VarChar, row.RankFrom)  
        .input('cet_reg', sql.VarChar, row.CETReg)   
        .input('cet_rank', sql.VarChar, cetRankValue)  
        .input('seat_allot_date', sql.Date, seatAllotDateValue) 
        .input('category_claimed', sql.VarChar, row.CategoryClaimed) 
        .input('category_allot_under', sql.VarChar, row.CategoryAlloted)  
        .input('course', sql.VarChar, row.Course)  
        .input('adm_date', sql.Date, admDateValue)   
        .input('amt_col', sql.Int, row.AmtClg)  
        .input('col_fee_receipt', sql.VarChar, String(row.ClgRectNo))
        .input('col_fee_rec_date', sql.Date, clgRctDateValue) 
        .input('amt_cet', sql.Int, row.AmtCET)  
        .input('semester', sql.Int, row.Semester)  
        .input('quota', sql.VarChar, row.Quota)  
        .input('col_code', sql.VarChar, row.ClgCode) 
        .input('cet_no', sql.VarChar, row.CETNo)  
        .input('doc_submitted', sql.VarChar, row.DocumentSubmitted)  
        .input('doc_to_be_submitted', sql.VarChar, row.Document2Submit)
        .query(query);
          
        rowsImported++;  // Increment the count after each successful row insert
      }
      res.json({
      message: 'Data imported successfully',
      rowsImported: jsonData.length,
      importedData: jsonData,
    });
      //return res.status(200).json({ message: 'Data imported successfully', rowsImported, importedData: jsonData });
    } catch (error) {
      console.error('Error processing the Excel file:', error);
      return res.status(500).json({ error: 'Failed to import data from Excel' });
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Multer handles body parsing
  },
};
