import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { Sname, Fname, Mname, DOB,selectedGender,PhysicallyChallenged,Mailid,stPhone,parentPhone,gardianPhone,selectedBlood,
      Adhaar,Occupation,AIncome,selectedNationality,selectedRelegion,Caste,selectedCategory,fullAddress,
      fullAddressLocal,SSLCPercent,PUCPercent,PHYMarks,CHEMarks,MathsMarks,PCMMarks,PCMPercent,selectedQualifyExam,
      selectedBoard,selectedState1,PUCReg,selectedYear,selectedState2,District,selectedRankFrom,CETReg,CETRank,
      seat_allotment_date,selectedCategoryClaim1,selectedCategoryClaim2,selectedBranch,adm_date,AMTClg,CLGRct,
      clg_fee_date,AMTKea,Semester,Quota,CLGCode,CETNo,Admyear} = req.body;

    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = 'use aittest; INSERT INTO dbo.admission_master (s_name, f_name, m_name, dob, gender, phy_challenged,st_email,' +
            'st_mobile,parent_mobile, gardian_mobile,blood_group,adhar_no,f_occupation,annual_income,nationality,religion,caste,category,permanent_adrs,'+
            'local_adrs,sslc_percent,puc_percent,phy_marks,c_b_ec_cs,maths,total_pcm,pcm_percent,qual_exam,board,state_puc,puc_usno,year_pass,state_student,'+
            'district,rank_from,cet_reg,cet_rank,seat_allot_date,category_claimed,category_allot_under,course,adm_date,amt_col,col_fee_receipt,col_fee_rec_date,'+
            'amt_cet,semester,quota,col_code,cet_no,adm_year)'+
            'VALUES (@Sname, @Fname, @Mname, @DOB, @selectedGender, @PhysicallyChallenged, @Mailid, @stPhone, @parentPhone, @gardianPhone, @selectedBlood, @Adhaar, @Occupation,@AIncome,'+
              '@selectedNationality, @selectedRelegion, @Caste, @selectedCategory, @fullAddress, @fullAddressLocal, @SSLCPercent, @PUCPercent, @PHYMarks,'+
              '@CHEMarks, @MathsMarks, @PCMMarks, @PCMPercent, @selectedQualifyExam, @selectedBoard, @selectedState1, @PUCReg,@selectedYear,@selectedState2,'+
              '@District,@selectedRankFrom,@CETReg,@CETRank,@seat_allotment_date,@selectedCategoryClaim1,@selectedCategoryClaim2,@selectedBranch,@adm_date,'+
              '@AMTClg,@CLGRct,@clg_fee_date,@AMTKea,@Semester,@Quota,@CLGCode,@CETNo,@Admyear)';
      //await pool.query(query, [fid, faname, fapass, faroll]);
      await pool.request()
        .input('Sname', sql.VarChar, Sname)   // Bind @fid as an Int
        .input('Fname', sql.VarChar, Fname)  // Bind @faname as VarChar (for string)
        .input('Mname', sql.VarChar, Mname)  // Bind @fapass as VarChar (for password)
        .input('DOB', sql.Date, DOB)        // Bind @faroll as VarChar (for role)
        .input('selectedGender', sql.VarChar, selectedGender)  
        .input('physicallyChallenged', sql.Bit, PhysicallyChallenged ? 1 : 0)
        .input('Mailid', sql.VarChar, Mailid)  
        .input('stPhone', sql.VarChar, stPhone)  
        .input('parentPhone', sql.VarChar, parentPhone)      
        .input('gardianPhone', sql.VarChar, gardianPhone)        
        .input('selectedBlood', sql.VarChar, selectedBlood)   
        .input('Adhaar', sql.VarChar, Adhaar)  
        .input('Occupation', sql.VarChar, Occupation)  
        .input('AIncome', sql.Numeric, AIncome)  
        .input('selectedNationality', sql.VarChar, selectedNationality)        
        .input('selectedRelegion', sql.VarChar, selectedRelegion) 
        .input('Caste', sql.VarChar, Caste )   
        .input('selectedCategory', sql.VarChar, selectedCategory)  
        .input('fullAddress', sql.VarChar, fullAddress)
        .input('fullAddressLocal', sql.VarChar, fullAddressLocal)   
        .input('SSLCPercent', sql.Float, SSLCPercent)  
        .input('PUCPercent', sql.Float, PUCPercent)  
        .input('PHYMarks', sql.Int, PHYMarks)  
        .input('CHEmarks', sql.Int, CHEMarks)       
        .input('MathsMarks', sql.Int, MathsMarks) 
        .input('PCMMarks', sql.Int, PCMMarks )   
        .input('PCMPercent', sql.Float, PCMPercent)  
        .input('selectedQualifyExam', sql.VarChar, selectedQualifyExam)  
        .input('selectedBoard', sql.VarChar,selectedBoard )   
        .input('selectedState1', sql.VarChar, selectedState1)  
        .input('PUCReg', sql.VarChar, PUCReg) 
        .input('selectedYear', sql.VarChar, selectedYear)  
        .input('selectedState2', sql.VarChar, selectedState2)  
        .input('District', sql.VarChar,District )   
        .input('selectedRankFrom', sql.VarChar, selectedRankFrom) 
        .input('CETReg', sql.VarChar, CETReg)  
        .input('CETRank', sql.VarChar, CETRank)  
        .input('seat_allotment_date', sql.Date,seat_allotment_date )   
        .input('selectedCategoryClaim1', sql.VarChar, selectedCategoryClaim1)  
        .input('selectedCategoryClaim2', sql.VarChar, selectedCategoryClaim2) 
        .input('selectedBranch', sql.VarChar, selectedBranch) 
        .input('adm_date', sql.Date, adm_date)  
        .input('AMTClg', sql.Numeric, AMTClg)  
        .input('CLGRct', sql.VarChar,CLGRct )   
        .input('clg_fee_date', sql.Date, clg_fee_date)  
        .input('AMTKea', sql.Numeric, AMTKea)
        .input('Semester', sql.Int, Semester) 
        .input('Quota', sql.VarChar, Quota)  
        .input('CLGCode', sql.VarChar, CLGCode)  
        .input('CETNo', sql.VarChar, CETNo)  
        .input('Admyear', sql.Date, Admyear) 
        .query(query);

      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data', error);
      res.status(500).json({ message: 'Error inserting data', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }  
}