import {connectToDatabase} from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function POST(req, res) {
    try {
      const { 
        academicSchema, 
        previousTeachingExperienceSchema, 
        teachingExperienceIndustrySchema, 
        awardsSchema, 
        recognitionsSchema, 
        responsibilitiesSchema, 
        extracurricularsSchema, 
        outreachSchema, 
        facultyId 
      } = req.body;
  
      if (!facultyId || !academicSchema || 
          !Array.isArray(previousTeachingExperienceSchema) || 
          !Array.isArray(teachingExperienceIndustrySchema) || 
          !Array.isArray(awardsSchema) || 
          !Array.isArray(recognitionsSchema) || 
          !Array.isArray(responsibilitiesSchema) || 
          !Array.isArray(extracurricularsSchema) || 
          !Array.isArray(outreachSchema)) {
        return res.status(400).json({
          success: false,
          error: "Missing or invalid schema data",
        });
      }
  
      console.log("Validated Request Body:", {
        facultyId,
        academicSchema,
        previousTeachingExperienceSchema,
        teachingExperienceIndustrySchema,
        awardsSchema,
        recognitionsSchema,
        responsibilitiesSchema,
        extracurricularsSchema,
        outreachSchema,
      });
  
      const pool = await connectToDatabase();
  
    const insertAcademicDetailsQuery = `
      INSERT INTO [aittest].[dbo].[FacultyAcademicDetails] (
        employee_id, level
      )
      VALUES (@employee_id, @level);
    `;

    await pool.request()
      .input('employee_id', sql.NVarChar, facultyId)
      .input('level', sql.NVarChar, academicSchema.level || 'N/A')
      .query(insertAcademicDetailsQuery);

    // Insert into TeachingExperience
    const insertTeachingExperienceQuery = `
      INSERT INTO [aittest].[dbo].[TeachingExperience] (
        employee_id, instituteName, fromDate, toDate, Designation, departmentName
      )
      VALUES (@employee_id, @instituteName, @fromDate, @toDate, @Designation, @departmentName);
    `;

    const teachingExperiences = previousTeachingExperienceSchema || [];
    for (const experience of teachingExperiences) {
      await pool.request()
        .input('employee_id', sql.NVarChar, facultyId)
        .input('instituteName', sql.NVarChar, experience.instituteName || 'Unknown Institute')
        .input('fromDate', sql.Date, experience.fromDate ? new Date(experience.fromDate) : null)
        .input('toDate', sql.Date, experience.toDate ? new Date(experience.toDate) : null)
        .input('Designation', sql.NVarChar, experience.Designation || 'Unknown')
        .input('departmentName', sql.NVarChar, experience.departmentName || 'Unknown Department')
        .query(insertTeachingExperienceQuery);
    }

    // Insert into TeachingExperienceIndustry
    const insertTeachingExperienceIndustryQuery = `
      INSERT INTO [aittest].[dbo].[IndustryExperience] (
        employee_id, organization, fromDate, toDate, designation
      )
      VALUES (@employee_id, @organization, @fromDate, @toDate, @designation );
    `;
    const teachingExperiencesIndustry = teachingExperienceIndustrySchema || [];
    for (const experience of teachingExperiencesIndustry) {
      await pool.request()
        .input('employee_id', sql.NVarChar, facultyId)
        .input('organization', sql.NVarChar, experience.organization || 'Unknown Organization')
        .input('fromDate', sql.Date, experience.fromDate ? new Date(experience.fromDate) : null)
        .input('toDate', sql.Date, experience.toDate ? new Date(experience.toDate) : null)
        .input('designation', sql.NVarChar, experience.designation || 'Unknown')
        .query(insertTeachingExperienceIndustryQuery);
    }
    // Insert into Awards
    const insertAwardAndRecognitionQuery = `
    INSERT INTO [aittest].[dbo].[AwardAndRecognition] (
        employee_id, recognitionorawardReceived, recognitionorawardFrom, awardReceived, awardDate, awardFrom, recognitionorawardDate
    )
    VALUES (@employee_id, @recognitionorawardReceived, @recognitionorawardFrom, @awardReceived, @awardDate, @awardFrom, @recognitionorawardDate);
`;

  // Insert Awards
  for (const award of awardsSchema) {
    await pool.request()
      .input('employee_id', sql.NVarChar, facultyId)
      .input('recognitionorawardReceived', sql.NVarChar, award.awardRecieved || 'Unknown')
      .input('recognitionorawardFrom', sql.NVarChar, award.awardFrom || 'Unknown')
      .input('awardReceived', sql.NVarChar, award.awardReceived || 'Unknown')
      .input('awardDate', sql.Date, award.awardDate ? award.awardDate : null)
      .input('awardFrom', sql.NVarChar, award.awardFrom || 'Unknown')
      .input('recognitionorawardDate', sql.Date, award.awardDate ? award.awardDate : null)
      .query(insertAwardAndRecognitionQuery);
  }

  // Insert Recognitions
  for (const recognition of recognitionsSchema) {
    await pool.request()
      .input('employee_id', sql.NVarChar, facultyId)
      .input('recognitionorawardReceived', sql.NVarChar, recognition.recognitionRecieved || 'Unknown')
      .input('recognitionorawardFrom', sql.NVarChar, recognition.recognitionFrom || 'Unknown')
      .input('awardReceived', sql.NVarChar, recognition.recognitionRecieved || 'Unknown')
      .input('awardDate', sql.Date, recognition.recognitionDate ? recognition.recognitionDate : null)
      .input('awardFrom',sql.NVarChar, recognition.recognitionFrom || 'Unknown')
      .input('recognitionorawardDate', sql.Date, recognition.recognitionDate ? recognition.recognitionDate : null)
      .query(insertAwardAndRecognitionQuery);
  }

    // Insert into Responsibilities
    const insertAdditionalResponsibilityQuery = `
       INSERT INTO [aittest].[dbo].[addtionalResponsibility] (
    employee_id, level, fromDate, toDate, responsibility
    )
    VALUES (@employee_id, @level, @fromDate, @toDate, @responsibility);  `;
    for (const responsibility of responsibilitiesSchema) {
        await pool.request()
            .input('employee_id', sql.NVarChar, facultyId)
            .input('level', sql.NVarChar, responsibility.level || 'Unknown')
            .input('fromDate', sql.Date, responsibility.fromDate ? new Date(responsibility.fromDate) : new Date())
            .input('toDate', sql.Date, responsibility.toDate ? new Date(responsibility.toDate) : new Date())
            .input('responsibility', sql.NVarChar, responsibility.additionalResponsibilitiesHeld || 'Unknown')
            .query(insertAdditionalResponsibilityQuery);
        }
    // Insert into Extracurriculars
    const insertExtracurricularQuery = `
        INSERT INTO [aittest].[dbo].[Extracurricular] (
            employee_id, eventType, eventTitle, fromDate, toDate, organizer, level, achievement
        )
        VALUES (@employee_id, @eventType, @eventTitle, @fromDate, @toDate, @organizer, @level, @achievement);
        `;
    for (const extracurricular of extracurricularsSchema) {
        await pool.request()
            .input('employee_id', sql.NVarChar, facultyId)
            .input('eventType', sql.NVarChar, extracurricular.typeOfEvent || 'Unknown')
            .input('eventTitle', sql.NVarChar, extracurricular.titleOfEvent || 'Unknown')
            .input('fromDate', sql.Date, extracurricular.fromDate ? new Date(extracurricular.fromDate) : new Date())
            .input('toDate', sql.Date, extracurricular.toDate ? new Date(extracurricular.toDate) : new Date())
            .input('organizer', sql.NVarChar, extracurricular.organizer || 'Unknown')
            .input('level', sql.NVarChar, extracurricular.level || 'Unknown')
            .input('achievement', sql.NVarChar, extracurricular.achievement || 'Unknown')
            .query(insertExtracurricularQuery);
        }
    // Insert into Outreach
    const insertOutreachActivityQuery = `
    INSERT INTO [aittest].[dbo].[OutreachActivity] (
      employee_id, activity, role, fromDate, toDate, place
    )
    VALUES (@employee_id, @activity, @role, @fromDate, @toDate, @place);
    `;
    for (const outreach of outreachSchema) {
      await pool.request()
        .input('employee_id', sql.NVarChar, facultyId)
        .input('activity', sql.NVarChar, outreach.activity || 'Unknown')
        .input('role', sql.NVarChar, outreach.role || 'Unknown')
        .input('fromDate', sql.Date, outreach.fromDate ? new Date(outreach.fromDate) : new Date())
        .input('toDate', sql.Date, outreach.toDate ? new Date(outreach.toDate) : new Date())
        .input('place', sql.NVarChar, outreach.place || 'Unknown')
        .query(insertOutreachActivityQuery);
    }
     return res.status(200).json({
      success: true,
      message: "Successfully inserted faculty academic details"
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