import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

// Handle POST request to insert data into MSSQL
export default async function POST(req, res) {
  try {
    const { personalSchema, financialSchema, educationSchema, dependentsSchema, facultyId } = req.body;

    if (!personalSchema || !financialSchema || !educationSchema || !dependentsSchema || !facultyId) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required schema data",
        requiredSchemas: ["personalSchema", "financialSchema", "educationSchema", "dependentsSchema"]
      });
    }

    // Log the received data
    console.log("Received data:", { personalSchema, financialSchema, educationSchema, dependentsSchema });

    const pool = await connectToDatabase(); // Connect to MSSQL

    // 4. Insert personal details into the database
    const insertPersonalDetailsQuery = `
      INSERT INTO [aittest].[dbo].[facultyPersonalDetails] (
        employee_id, qualification, department, photo, title, faculty_name, emailId, 
        contactNo, alternateContactNo, emergencyContactNo, adharNo, panNo, dob, gender, 
        nationality, firstAddressLine, correspondenceAddressLine, religion, caste, category, 
        motherTongue, speciallyChallenged, remarks, languages, bankName, accountNo, accountName, 
        accountType, branch, ifsc, pfNumber, uanNumber, pensionNumber, motherName, fatherName, 
        spouseName, children, dateOfJoiningDrait, designation, aided
      )
      VALUES (
        @employee_id, @qualification, @department, @photo, @title, @faculty_name, @emailId, 
        @contactNo, @alternateContactNo, @emergencyContactNo, @adharNo, @panNo, @dob, @gender, 
        @nationality, @firstAddressLine, @correspondenceAddressLine, @religion, @caste, @category, 
        @motherTongue, @speciallyChallenged, @remarks, @languages, @bankName, @accountNo, @accountName, 
        @accountType, @branch, @ifsc, @pfNumber, @uanNumber, @pensionNumber, @motherName, @fatherName, 
        @spouseName, @children, @dateOfJoiningDrait, @designation, @aided
      );
    `;

    await pool.request()
      .input('employee_id', sql.NVarChar, facultyId ?? 'Unknown ID')
      .input('qualification', sql.NVarChar, personalSchema?.qualification ?? 'N/A')
      .input('department', sql.NVarChar, personalSchema?.department ?? 'Unknown')
      .input('photo', sql.NVarChar, personalSchema?.photo ?? "No photo") // Assuming photo is stored as binary
      .input('title', sql.NVarChar, personalSchema?.prefix ?? 'Mr')
      .input('faculty_name', sql.NVarChar, personalSchema?.firstName + ' ' + personalSchema?.lastName ?? 'Sharan Unknown')
      .input('emailId', sql.NVarChar, personalSchema?.emailId ?? 'noemail@example.com')
      .input('contactNo', sql.NVarChar, personalSchema?.contactNo ?? '0000000000')
      .input('alternateContactNo', sql.NVarChar, personalSchema?.alternateContactNo ?? '0000000000')
      .input('emergencyContactNo', sql.NVarChar, personalSchema?.emergencyContactNo ?? '0000000000')
      .input('adharNo', sql.NVarChar, personalSchema?.aadhar ?? '000000000004')
      .input('panNo', sql.NVarChar, personalSchema?.pan ?? 'XXXXXX1234')
      .input('dob', sql.Date, personalSchema?.dob ? new Date(personalSchema.dob) : new Date())
      .input('gender', sql.NVarChar, personalSchema?.gender ?? 'Male')
      .input('nationality', sql.NVarChar, personalSchema?.nationality ?? 'India')
      .input('firstAddressLine', sql.NVarChar, personalSchema?.firstAddressLine1 ?? 'N/A')

      .input('correspondenceAddressLine', sql.NVarChar, personalSchema?.correspondenceAddressLine1 ?? 'N/A')
      .input('religion', sql.NVarChar, personalSchema?.religion ?? 'Hindu')
      .input('caste', sql.NVarChar, personalSchema?.caste ?? 'General')
      .input('category', sql.NVarChar, personalSchema?.category ?? 'General')
      .input('motherTongue', sql.NVarChar, personalSchema?.motherTongue ?? 'Unknown')
      .input('speciallyChallenged', sql.Bit, personalSchema?.speciallyChallenged ?? false)
      .input('remarks', sql.NVarChar, personalSchema?.remarks ?? '')
      .input('languages', sql.NVarChar, JSON.stringify(personalSchema?.languagesToSpeak ?? ['English']))
      .input('bankName', sql.NVarChar, financialSchema?.bankName ?? 'N/A')
      .input('accountNo', sql.NVarChar, financialSchema?.accountNo ?? '321321321321')
      .input('accountName', sql.NVarChar, financialSchema?.accountName ?? 'Unknown')
      .input('accountType', sql.NVarChar, financialSchema?.accountType ?? 'Savings')
      .input('branch', sql.NVarChar, financialSchema?.branch ?? 'Unknown Branch')
      .input('ifsc', sql.NVarChar, financialSchema?.ifscCode ?? 'UNKNOWN000000')
      .input('pfNumber', sql.NVarChar, financialSchema?.pfNumber ?? 'N/A')
      .input('uanNumber', sql.NVarChar, financialSchema?.uanNumber ?? 'N/A')
      .input('pensionNumber', sql.NVarChar, financialSchema?.pensionNumber ?? 'N/A')
      .input('motherName', sql.NVarChar, dependentsSchema?.motherName ?? 'Unknown')
      .input('fatherName', sql.NVarChar, dependentsSchema?.fatherName ?? 'Unknown')
      .input('spouseName', sql.NVarChar, dependentsSchema?.spouseName ?? 'Unknown')
      .input('children', sql.NVarChar, dependentsSchema?.children ?? 'Unknown')
      .input('dateOfJoiningDrait', sql.Date, personalSchema?.dateOfJoiningDrait ? new Date(personalSchema.dateOfJoiningDrait) : new Date())
      .input('designation', sql.VarChar, personalSchema?.designation ?? 'Unknown')
      .input('aided', sql.VarChar, personalSchema?.aided ?? "yes")
      .query(insertPersonalDetailsQuery);

    // Optionally: Insert education details (if needed)
    const insertFacultyEducationQuery = `
      INSERT INTO [aittest].[dbo].[facultyEducation] (
        employee_id, Program, regNo, schoolCollege, specialization, 
        mediumOfInstruction, passClass, yearOfAward
      )
      VALUES (
        @employee_id, @Program, @regNo, @schoolCollege, @specialization, 
        @mediumOfInstruction, @passClass, @yearOfAward
      );
    `;

    const facultyEducationData = educationSchema || []; // Assuming facultyEducationSchema is an array of education data
    for (const education of facultyEducationData) {
      await pool.request()
        .input('employee_id', sql.NVarChar, facultyId ) // Assuming facultyId is the employee_id
        .input('Program', sql.NVarChar, education.class || 'Unknown')
        .input('regNo', sql.NVarChar, education.usn || 'Unknown')
        .input('schoolCollege', sql.NVarChar, education.institution || 'Unknown')
        .input('specialization', sql.NVarChar, education.specialization || 'Unknown')
        .input('mediumOfInstruction', sql.NVarChar, education.mediumOfInstruction || 'Unknown')
        .input('passClass', sql.NVarChar, education.passClass || 'Unknown')
        .input('yearOfAward', sql.Int, education.PassingYear || 0)
        .query(insertFacultyEducationQuery);
    }


    return res.status(200).json({
      success: true,
      message: "Faculty data inserted successfully",
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
}
// Handle GET request to fetch data from MSSQL
export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const facultyId = url.searchParams.get("facultyId");

    if (!facultyId) {
      return res.status(400).json({ success: false, error: "Faculty ID is required" });
    }

    const pool = await connectToDatabase();
    const query = `
      SELECT * FROM [aittest].[dbo].[facultyPersonalDetails]
      WHERE employee_id = @facultyId;
    `;
    
    const result = await pool.request()
      .input('facultyId', sql.NVarChar, facultyId)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Faculty not found" });
    }

    return res.status(200).json({ success: true, data: result.recordset[0] });
    
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch faculty" });
  }
}
