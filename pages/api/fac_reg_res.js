import {connectToDatabase} from '../../app/config/dbconfig';
import sql from 'mssql';
export default async function POST(req, res) 
{
    try
    {
        const { 
            facultyResearchSchema,
                        nationalJournalDetailsSchema,
                        internationalJournalDetailsSchema,
                        nationalConferenceDetailsSchema,
                        internationalConferenceDetailsSchema,
                        researchGrantsSchema,
                        patentsSchema,
                        consultancySchema,
                        professionalMembershipSchema,
                        eventsAttendedSchema,
                        eventsOrganizedSchema,
                        publicationsSchema,
                        facultyId
          } = req.body;
      
        if (!facultyResearchSchema || !nationalJournalDetailsSchema || !eventsAttendedSchema || !eventsOrganizedSchema ||  !internationalJournalDetailsSchema || !nationalConferenceDetailsSchema || !internationalConferenceDetailsSchema || !researchGrantsSchema || !consultancySchema || !patentsSchema ||  !publicationsSchema || !professionalMembershipSchema || !facultyId)
        {
            return res.status(400).json({
                success: false,
                error: "Missing or invalid schema data",
            });
        }

        console.log("Validated Request Body:", {
            facultyResearchSchema,
            nationalJournalDetailsSchema,
            eventsAttendedSchema,
            eventsOrganizedSchema,
            internationalJournalDetailsSchema,
            nationalConferenceDetailsSchema,
            internationalConferenceDetailsSchema,
            researchGrantsSchema,
            consultancySchema,
            patentsSchema,
            publicationsSchema,
            professionalMembershipSchema,
            facultyId
        });
        const pool = await connectToDatabase(); 
        const insertFacultyResearchDetailsQuery = `
        INSERT INTO [aittest].[dbo].[FacultyResearchDetails] (
          employee_id, orcidId, googleScholarId, scopusId, publonsId, researchId
        )
        VALUES (@employee_id, @orcidId, @googleScholarId, @scopusId, @publonsId, @researchId);
      `;
      await pool.request()
        .input('employee_id', sql.NVarChar, facultyId)
        .input('orcidId', sql.NVarChar, facultyResearchSchema.orcId)
        .input('googleScholarId', sql.NVarChar, facultyResearchSchema.googleScholarId)
        .input('scopusId', sql.NVarChar, facultyResearchSchema.scopusId)
        .input('publonsId', sql.NVarChar, facultyResearchSchema.publonsAndWebOfScienceId)
        .input('researchId', sql.NVarChar, facultyResearchSchema.researchId)
        .query(insertFacultyResearchDetailsQuery);
        const insertConferenceAndJournalQuery = `
            INSERT INTO [aittest].[dbo].[ConferenceAndJournal] (
                employee_id, typeOfPublication, title, doi, issn, joConName, 
                yearOfPublication, pageNo, authors, publishedUnder, impactFactor, 
                quartile, sponsor, venue, volume, issueNo
            )
            VALUES (
                @employee_id, @typeOfPublication, @title, @doi, @issn, @joConName, 
                @yearOfPublication, @pageNo, @authors, @publishedUnder, 
                @impactFactor, @quartile, @sponsor, @venue, @volume, @issueNo
            );
            `;
            const nationaljournal = nationalJournalDetailsSchema || [];
            for (const journalDetails of nationaljournal) {
            await pool.request()
                .input('employee_id', sql.VarChar, facultyId)
                .input('typeOfPublication', sql.VarChar, "National Journal")
                .input('title', sql.VarChar, journalDetails.titleOfResearchPaper || 'Unknown')
                .input('doi', sql.VarChar, journalDetails.doi || 'Unknown')
                .input('issn', sql.VarChar, journalDetails.issn || 'Unknown')
                .input('joConName', sql.VarChar, journalDetails.joConName || 'Unknown')
                .input('yearOfPublication', sql.Int, journalDetails.yearOfPublication || 0)
                .input('pageNo', sql.VarChar, journalDetails.pageNo || 'Unknown')
                .input('authors', sql.VarChar, Array.isArray(journalDetails.authors) ? JSON.stringify(journalDetails.authors) : '')
            .input('publishedUnder', sql.VarChar, journalDetails.publishedUnder || 'Unknown')
                .input('impactFactor', sql.Float, journalDetails.impactFactor || 0)
                .input('quartile', sql.VarChar, journalDetails.quartile || 'Unknown')
                .input('sponsor', sql.VarChar, journalDetails.sponsor || 'Unknown')
                .input('venue', sql.VarChar, journalDetails.venue || 'Unknown')
                .input('volume', sql.VarChar, journalDetails.volume || 'Unknown')
                .input('issueNo', sql.NVarChar, journalDetails.issueNo || 'Unknown')
                .query(insertConferenceAndJournalQuery);
            }
            const internationaljournal= internationalJournalDetailsSchema || [];
            for(const internationalJournalDetailsSchema1 of internationaljournal)
            {
            await pool.request()
            .input('employee_id', sql.NVarChar, facultyId)
            .input('typeOfPublication', sql.VarChar, "International Journal")
            .input('title', sql.VarChar,  internationalJournalDetailsSchema1.titleOfResearchPaper  || 'Unknown')
            .input('doi', sql.VarChar,  internationalJournalDetailsSchema1.doi || 'Unknown')
            .input('issn', sql.VarChar,  internationalJournalDetailsSchema1.issn || 'Unknown')
            .input('joConName', sql.VarChar,  internationalJournalDetailsSchema1.joConName || 'Unknown')
            .input('yearOfPublication', sql.Int,  internationalJournalDetailsSchema1.yearOfPublication || 0)
            .input('pageNo', sql.VarChar,  internationalJournalDetailsSchema1.pageNo     || 'Unknown')
            .input('authors', sql.VarChar, Array.isArray(internationalJournalDetailsSchema1.authors) ? JSON.stringify(internationalJournalDetailsSchema1.authors) : '')
            .input('publishedUnder', sql.VarChar,  internationalJournalDetailsSchema1.publishedUnder|| 'Unknown')
            .input('impactFactor', sql.Float,  internationalJournalDetailsSchema1.impactFactor || 0)
            .input('quartile', sql.VarChar,  internationalJournalDetailsSchema1.quartile || 'Unknown')
            .input('sponsor', sql.VarChar,  internationalJournalDetailsSchema1.sponsor || 'Unknown')
            .input('venue', sql.VarChar,  internationalJournalDetailsSchema1.venue || 'Unknown')
            .input('volume', sql.VarChar,  internationalJournalDetailsSchema1.volume || 'Unknown')
            .input('issueNo', sql.NVarChar,  internationalJournalDetailsSchema1.issueNo || 'Unknown')
            .query(insertConferenceAndJournalQuery);
            }
            const nationalConference = nationalConferenceDetailsSchema || [];
            for(const nationalConferenceDetailsSchema1 of nationalConference)
            {
            await pool.request()
            .input('employee_id', sql.NVarChar, facultyId)
            .input('typeOfPublication', sql.VarChar, "National Conference")
            .input('title', sql.VarChar, nationalConferenceDetailsSchema1.titleOfResearchPaper  || 'Unknown')
            .input('doi', sql.VarChar, nationalConferenceDetailsSchema1.doi || 'Unknown')
            .input('issn', sql.VarChar, nationalConferenceDetailsSchema1.issn || 'Unknown')
            .input('joConName', sql.VarChar, nationalConferenceDetailsSchema1.joConName || 'Unknown')
            .input('yearOfPublication', sql.Int, nationalConferenceDetailsSchema1.yearOfPublication || 0)
            .input('pageNo', sql.VarChar, nationalConferenceDetailsSchema1.pageNo     || 'Unknown')
            .input('authors', sql.VarChar, Array.isArray(nationalConferenceDetailsSchema1.authors) ? JSON.stringify(nationalConferenceDetailsSchema1.authors) : '')
           .input('publishedUnder', sql.VarChar, nationalConferenceDetailsSchema1.publishedUnder|| 'Unknown')
            .input('impactFactor', sql.Float, nationalConferenceDetailsSchema1.impactFactor || 0)
            .input('quartile', sql.VarChar, nationalConferenceDetailsSchema1.quartile || 'Unknown')
            .input('sponsor', sql.VarChar, nationalConferenceDetailsSchema1.sponsor || 'Unknown')
            .input('venue', sql.VarChar, nationalConferenceDetailsSchema1.venue || 'Unknown')
            .input('volume', sql.VarChar, nationalConferenceDetailsSchema1.volume || 'Unknown')
            .input('issueNo', sql.NVarChar, nationalConferenceDetailsSchema1.issueNo || 'Unknown')
            .query(insertConferenceAndJournalQuery);
            }
            const internationalConference = internationalConferenceDetailsSchema || [];
            for(const internationalConferenceDetailsSchema1 of internationalConference)
            {
            await pool.request()
            .input('employee_id', sql.NVarChar, facultyId)
            .input('typeOfPublication', sql.VarChar, "International Conference")
            .input('title', sql.VarChar, internationalConferenceDetailsSchema1.titleOfResearchPaper  || 'Unknown')
            .input('doi', sql.VarChar, internationalConferenceDetailsSchema1.doi || 'Unknown')
            .input('issn', sql.VarChar, internationalConferenceDetailsSchema1.issn || 'Unknown')
            .input('joConName', sql.VarChar, internationalConferenceDetailsSchema1.joConName || 'Unknown')
            .input('yearOfPublication', sql.Int, internationalConferenceDetailsSchema1.yearOfPublication || 0)
            .input('pageNo', sql.VarChar, internationalConferenceDetailsSchema1.pageNo     || 'Unknown')
            .input('authors', sql.VarChar, Array.isArray(internationalConferenceDetailsSchema1.authors) ? JSON.stringify(internationalConferenceDetailsSchema1.authors) : '')
          .input('publishedUnder', sql.VarChar, internationalConferenceDetailsSchema1.publishedUnder|| 'Unknown')
            .input('impactFactor', sql.Float, internationalConferenceDetailsSchema1.impactFactor || 0)
            .input('quartile', sql.VarChar, internationalConferenceDetailsSchema1.quartile || 'Unknown')
            .input('sponsor', sql.VarChar, internationalConferenceDetailsSchema1.sponsor || 'Unknown')
            .input('venue', sql.VarChar, internationalConferenceDetailsSchema1.venue || 'Unknown')
            .input('volume', sql.VarChar, internationalConferenceDetailsSchema1.volume || 'Unknown')
            .input('issueNo', sql.NVarChar, internationalConferenceDetailsSchema1.issueNo || 'Unknown')
            .query(insertConferenceAndJournalQuery);
            }
            const insertResearchProjectsQuery = `
            INSERT INTO [aittest].[dbo].[ResearchProjects] (
                employee_id, projectTitle, pi, coPi, dOfSanction, 
                duration, fundingAgency, amount, status
            )
            VALUES (
                @employee_id, @projectTitle, @pi, @coPi, @dOfSanction, 
                @duration, @fundingAgency, @amount, @status
            );
            `;
            const researchGrants = researchGrantsSchema || [];
            for(const researchGrantsSchemas of researchGrants)
            {
            await pool.request()
                .input('employee_id', sql.NVarChar, facultyId)
                .input('projectTitle', sql.NVarChar, researchGrantsSchemas.projectTitle)
                .input('pi', sql.NVarChar, researchGrantsSchemas.pi)
                .input('coPi', sql.NVarChar, researchGrantsSchemas.coPi)
                .input('dOfSanction', sql.Date, researchGrantsSchemas.dOfSanction)
                .input('duration', sql.NVarChar, researchGrantsSchemas.duration)
                .input('fundingAgency', sql.NVarChar, researchGrantsSchemas.fundingAgency)
                .input('amount', sql.Decimal, parseFloat(researchGrantsSchemas.amount))
                .input('status', sql.NVarChar, researchGrantsSchemas.status)
                .query(insertResearchProjectsQuery); // Correct usage
 
            }
            const insertConsultancyQuery = `
                INSERT INTO [aittest].[dbo].[Consultancy] (
                    employee_id, faculty_name, sanctionedDate, projectPeriod, amount, 
                    principalInvestigator, coPrincipalInvestigator, status
                )
                VALUES (
                    @employee_id, @faculty_name, @sanctionedDate, @projectPeriod, @amount, 
                    @principalInvestigator, @coPrincipalInvestigator, @status
                );
                `;
                const consultancy = consultancySchema || [];
                for(const consultancySchemas of consultancy)
                {
                await pool.request()
                .input('employee_id', sql.NVarChar, facultyId || 'Unknown ID')
                .input('faculty_name', sql.NVarChar, consultancySchemas.faculty_name || 'Unknown')
                .input('sanctionedDate', sql.Date, consultancySchemas.sanctionedDate || new Date())
                .input('projectPeriod', sql.NVarChar, consultancySchemas.projectPeriod || 'Unknown')
                .input('amount', sql.Decimal, parseFloat(consultancySchemas.amount) || 0)
                .input('principalInvestigator', sql.NVarChar, consultancySchemas.principalInvestigator || 'Unknown')
                .input('coPrincipalInvestigator', sql.NVarChar, consultancySchemas.coPrincipalInvestigator || 'Unknown')
                .input('status', sql.NVarChar, consultancySchemas.status || 'Unknown')
                .query(insertConsultancyQuery);
                }
                const insertPatentQuery = `
                INSERT INTO [aittest].[dbo].[Patent] (
                    employee_id, areaOfResearch, grantedYear, patentNo, patentStatus, author
                )
                VALUES (
                    @employee_id, @areaOfResearch, @grantedYear, @patentNo, @patentStatus, @author
                );
                `;
                const patents = patentsSchema || [];
                for(const patentsSchema1 of patents)
                {
                await pool.request()
                .input('employee_id', sql.NVarChar, facultyId)
                .input('areaOfResearch', sql.NVarChar, patentsSchema1.areaOfResearch || 'Unknown')
                .input('grantedYear', sql.Int,patentsSchema1.grantedYear || 0)
                .input('patentNo', sql.NVarChar, patentsSchema1.patentNo || 'Unknown')
                .input('patentStatus', sql.NVarChar, patentsSchema1.patentStatus || 'Unknown')
                .input('author', sql.NVarChar, patentsSchema1.author || 'Unknown')
                .query(insertPatentQuery);
                }
                const insertBookPublicationQuery = `
                INSERT INTO [aittest].[dbo].[bookPublication] (
                    publicationType, name, volume, pageNumber, issn, publisher, 
                    title, area, impactFactor, employee_id, yearOfPublish , authors
                )
                VALUES (
                    @publicationType, @name, @volume, @pageNumber, @issn, @publisher, 
                    @title, @area, @impactFactor, @employee_id, @yearOfPublish , @authors
                );
                `;
                const publications = publicationsSchema || [];
                for(const publicationsSchema1 of publications)
                {
                await pool.request()
                .input('publicationType', sql.NVarChar, publicationsSchema1.publicationType || 'Unknown')
                .input('name', sql.NVarChar, publicationsSchema1.name || 'Unknown')
                .input('volume', sql.NVarChar, publicationsSchema1.volume || 'Unknown')
                .input('pageNumber', sql.NVarChar, publicationsSchema1.pageNumber || 'Unknown')
                .input('issn', sql.NVarChar, publicationsSchema1.issn || 'Unknown')
                .input('authors', sql.NVarChar, Array.isArray(publicationsSchema1.authors) ? JSON.stringify(publicationsSchema1.authors) : '')
                .input('publisher', sql.NVarChar, publicationsSchema1.publisher || 'Unknown')
                .input('title', sql.NVarChar, publicationsSchema1.title || 'Unknown')
                .input('area', sql.NVarChar, publicationsSchema1.area || 'Unknown')
                .input('impactFactor', sql.Float, parseFloat(publicationsSchema1.impactFactor) || 0)
                .input('employee_id', sql.NVarChar, facultyId || 'Unknown ID')
                .input('yearOfPublish', sql.Int, publicationsSchema1.yearOfPublish || 0)
                .query(insertBookPublicationQuery);
                }
                const insertEventAttendedQuery = `
                INSERT INTO [aittest].[dbo].[EventAttended] (
                    fromDate, toDate, organizer, venue, sponsor, targetAudience, 
                    employee_id, nameofevent, typeofevent
                )
                VALUES (
                    @fromDate, @toDate, @organizer, @venue, @sponsor, @targetAudience, 
                    @employee_id, @nameofevent, @typeofevent
                );
                `;
                const eventsAttended = eventsAttendedSchema || [];
                for(const eventsAttendedSchema1 of eventsAttended)
                {
                await pool.request()
                .input('fromDate', sql.Date, eventsAttendedSchema1.fromDate || new Date())
                .input('toDate', sql.Date, eventsAttendedSchema1.toDate || new Date())
                .input('organizer', sql.NVarChar, eventsAttendedSchema1.organizer || 'Unknown')
                .input('venue', sql.NVarChar, eventsAttendedSchema1.venue    || 'Unknown')
                .input('sponsor', sql.NVarChar, eventsAttendedSchema1.sponsor || 'Unknown')
                .input('targetAudience', sql.NVarChar, eventsAttendedSchema1.targetAudience  || 'Unknown')
                .input('employee_id', sql.NVarChar, facultyId || 'Unknown ID')
                .input('nameofevent', sql.NVarChar, eventsAttendedSchema1.nameofevent || 'Unknown')
                .input('typeofevent', sql.NVarChar, eventsAttendedSchema1.typeOfEvent || 'Unknown')
                .query(insertEventAttendedQuery);
                }
                const insertEventOrganizedQuery = `
                INSERT INTO [aittest].[dbo].[EventOrganized] (
                    typeofevent, nameofevent, fromDate, toDate, organizer, venue, 
                    sponsor, targetAudience, employee_id
                )
                VALUES (
                    @typeofevent, @nameofevent, @fromDate, @toDate, @organizer, @venue, 
                    @sponsor, @targetAudience, @employee_id
                );
                `;
                const eventsOrganized = eventsOrganizedSchema || [];
                for(const eventsOrganizedSchema1 of eventsOrganized)
                {
                await pool.request()
                .input('typeofevent', sql.NVarChar, eventsOrganizedSchema1.typeOfEvent || 'Unknown')
                .input('nameofevent', sql.NVarChar, eventsOrganizedSchema1.nameofevent || 'Unknown')
                .input('fromDate', sql.Date, eventsOrganizedSchema1.fromDate || new Date())
                .input('toDate', sql.Date, eventsOrganizedSchema1.toDate || new Date())
                .input('organizer', sql.NVarChar, eventsOrganizedSchema1.organizer || 'Unknown')
                .input('venue', sql.NVarChar, eventsOrganizedSchema1.venue || 'Unknown')
                .input('sponsor', sql.NVarChar, eventsOrganizedSchema1.sponsor || 'Unknown')
                .input('targetAudience', sql.NVarChar, eventsOrganizedSchema1.targetAudience || 'Unknown')
                .input('employee_id', sql.NVarChar, facultyId)
                .query(insertEventOrganizedQuery);
                }
                const insertProfessionalMembersQuery = `
                INSERT INTO [aittest].[dbo].[ProfessionalMembers] (
                    employee_id, professionalBody, membershipId, membershipSince, membershipType
                )
                VALUES (
                    @employee_id, @professionalBody, @membershipId, @membershipSince, @membershipType
                );
                `;
                const professionalMemberships = professionalMembershipSchema || [];
                for(const professionalMembershipsSchema of professionalMemberships)
                {
                await pool.request()
                .input('employee_id', sql.NVarChar, facultyId)
                .input('professionalBody', sql.NVarChar, professionalMembershipsSchema.professionalBody || 'Unknown')
                .input('membershipId', sql.NVarChar, professionalMembershipsSchema.membershipId || 'Unknown')
                .input('membershipSince', sql.Date, professionalMembershipsSchema.membershipSince || new Date())
                .input('membershipType', sql.NVarChar, professionalMembershipsSchema.membershipType || 'Unknown')
                .query(insertProfessionalMembersQuery);
                }



    return res.status(200).json({ success: true, message: "Data inserted successfully" });
    
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch faculty" });
  }
}
