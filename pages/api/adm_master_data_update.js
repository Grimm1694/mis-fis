import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { adm_year,usno,s_name,f_name,m_name,dob,gender,phy_challenged,st_email,st_mobile,parent_mobile,
            gardian_mobile,blood_group,adhar_no,f_occupation,annual_income,nationality,religion,caste,category,state_student,  
            district,permanent_adrs,local_adrs,sslc_percent,puc_percent,phy_marks,c_b_ec_cs,maths,total_pcm,pcm_percent,
            qual_exam,board,state_puc,puc_usno,year_pass,rank_from,cet_reg,cet_rank,seat_allot_date,category_claimed,     
            category_allot_under,course,adm_date,amt_col,col_fee_receipt,col_fee_rec_date,amt_cet,semester,quota,
            col_code,cet_no,doc_submitted,doc_to_be_submitted } = req.body;            

    try {
        const pool = await connectToDatabase();
        // Insert data into the database
        const query = `use aittest; 
        UPDATE admission_master
        SET adm_year = @adm_year, 
            usno = @usno, 
            s_name = @s_name, 
            f_name = @f_name, 
            m_name = @m_name,
            dob = @dob,
            gender = @gender, 
            phy_challenged = @phy_challenged, 
            st_email = @st_email,
            st_mobile = @st_mobile, 
            parent_mobile = @parent_mobile, 
            gardian_mobile = @gardian_mobile, 
            blood_group = @blood_group,
            adhar_no = @adhar_no, 
            f_occupation = @f_occupation,
            annual_income = @annual_income, 
            nationality = @nationality, 
            religion = @religion, 
            caste = @caste,
            category = @category,
            state_student = @state_student, 
            district = @district, 
            permanent_adrs = @permanent_adrs, 
            local_adrs = @local_adrs,
            sslc_percent= @sslc_percent,
            puc_percent= @puc_percent,
            phy_marks= @phy_marks,
            c_b_ec_cs= @c_b_ec_cs,
            maths= @maths,
            total_pcm= @total_pcm,
            pcm_percent= @pcm_percent,
            qual_exam= @qual_exam,
            board= @board,
            state_puc= @state_puc,
            puc_usno= @puc_usno,
            year_pass= @year_pass,
            rank_from= @rank_from,
            cet_reg= @cet_reg,
            cet_rank= @cet_rank,
            seat_allot_date= @seat_allot_date,
            category_claimed= @category_claimed,
            category_allot_under= @category_allot_under,
            course= @course,
            adm_date= @adm_date,
            amt_col= @amt_col,
            col_fee_receipt= @col_fee_receipt,
            col_fee_rec_date= @col_fee_rec_date,
            amt_cet= @amt_cet,
            semester= @semester,
            quota= @quota,
            col_code= @col_code,
            cet_no=@cet_no,
            doc_submitted= @doc_submitted,
            doc_to_be_submitted= @doc_to_be_submitted
        WHERE usno = @usno and s_name = @s_name; `;
  
        await pool.request()
        .input('adm_year', sql.Date, adm_year) 
        .input('usno', sql.VarChar, usno)   
        .input('s_name', sql.VarChar, s_name)   
        .input('f_name', sql.VarChar, f_name)  
        .input('m_name', sql.VarChar, m_name)  
        .input('dob', sql.Date, dob)        
        .input('gender', sql.VarChar, gender)  
        .input('phy_challenged', sql.Bit, phy_challenged ? 1 : 0)
        .input('st_email', sql.VarChar, st_email)  
        .input('st_mobile', sql.VarChar, st_mobile)  
        .input('parent_mobile', sql.VarChar, parent_mobile)      
        .input('gardian_mobile', sql.VarChar, gardian_mobile)        
        .input('blood_group', sql.VarChar, blood_group)   
        .input('adhar_no', sql.VarChar, adhar_no)  
        .input('f_occupation', sql.VarChar, f_occupation)  
        .input('annual_income', sql.Numeric, annual_income)  
        .input('nationality', sql.VarChar, nationality)        
        .input('religion', sql.VarChar, religion) 
        .input('caste', sql.VarChar, caste )   
        .input('category', sql.VarChar, category)
        .input('state_student', sql.VarChar, state_student)
        .input('district', sql.VarChar,district )     
        .input('permanent_adrs', sql.VarChar, permanent_adrs)
        .input('local_adrs', sql.VarChar, local_adrs)   
        .input('sslc_percent', sql.Float, sslc_percent)  
        .input('puc_percent', sql.Float, puc_percent)  
        .input('phy_marks', sql.Int, phy_marks)  
        .input('c_b_ec_cs', sql.Int, c_b_ec_cs)       
        .input('maths', sql.Int, maths) 
        .input('total_pcm', sql.Int, total_pcm)   
        .input('pcm_percent', sql.Float, pcm_percent)  
        .input('qual_exam', sql.VarChar, qual_exam)  
        .input('board', sql.VarChar,board )   
        .input('state_puc', sql.VarChar, state_puc)  
        .input('puc_usno', sql.VarChar, puc_usno) 
        .input('year_pass', sql.Int, year_pass)
        .input('rank_from', sql.VarChar,  rank_from) 
        .input('cet_reg', sql.VarChar, cet_reg)  
        .input('cet_rank', sql.VarChar,  cet_rank)  
        .input('seat_allot_date', sql.Date,seat_allot_date )   
        .input('category_claimed', sql.VarChar, category_claimed)  
        .input('category_allot_under', sql.VarChar, category_allot_under) 
        .input('course', sql.VarChar, course) 
        .input('adm_date', sql.Date, adm_date)  
        .input('amt_col', sql.Numeric, amt_col)  
        .input('col_fee_receipt', sql.VarChar,col_fee_receipt)   
        .input('col_fee_rec_date', sql.Date, col_fee_rec_date)  
        .input('amt_cet', sql.Numeric, amt_cet)
        .input('semester', sql.Int, semester) 
        .input('quota', sql.VarChar, quota)  
        .input('col_code', sql.VarChar, col_code)  
        .input('cet_no', sql.VarChar, cet_no)  
        .input('doc_submitted', sql.VarChar,doc_submitted) 
        .input('doc_to_be_submitted', sql.VarChar,doc_to_be_submitted)  
        .query(query);

        res.status(200).json({ message: 'Data Updated successfully' });
    } catch (error) {
      console.error('Error inserting data', error);
      res.status(500).json({ message: 'Error inserting data', error });
    }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }  
}