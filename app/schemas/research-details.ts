import { xor } from "lodash";
import { z } from "zod";
export const facultyResearchSchema = z.object({
  vtuFacultyId: z.string().min(1, { message: "VTU Faculty ID is required" }),
  googleScholarId: z
    .string()
    .min(1, { message: "AICTE Faculty ID is required" }),
  orcId: z.string().min(1, { message: "ORCID is required" }).optional().or(z.literal("")),
  scopusId: z.string().min(1, { message: "Scopus ID is required" }).optional().or(z.literal("")),
  publonsAndWebOfScienceId: z
    .string()
    .min(1, { message: "Publons and Web of Science ID is required" }).optional().or(z.literal("")),
   researchId: z.string().min(1, { message: "Scopus ID is required" }).optional().or(z.literal("")),
 
  });

export const nationalJournalDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().min(1, { message: "Title is required" }),
    doi: z.string().min(1, { message: "DOI is required" }).optional().or(z.literal("")),
    volume: z.string().min(1, { message: "Volume is required" }).optional().or(z.literal("")),
    joConName: z.string().min(1, { message: "Journal/Conference name is required" }).optional().or(z.literal("")),
    issueNo: z.string().min(1, { message: "Issue number is required" }).optional().or(z.literal("")),
    yearOfPublication: z
      .string()
      .min(1, { message: "Year of publication is required" }).optional().or(z.literal("")).optional().or(z.literal("")),
    pageNo: z.string().min(1, { message: "Page number from is required" }).optional().or(z.literal("")),
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
    .min(1, { message: "At least one author is required" }).optional().or(z.literal("")),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"], {
      message: "Please select a publication",
    }).optional().or(z.literal("")),
    issn: z.string().min(1, { message: "ISSN is required" }).optional().or(z.literal("")),  
    impactFactor: z.string().min(1, { message: "Impact factor is required" }).optional().or(z.literal("")),
    quartile:z.string().min(1, { message: "Quartile is required" }).optional().or(z.literal("")),
    sponsor: z.string().min(1, { message: "Sponsor is required" }).optional().or(z.literal("")),
    venue : z.string().min(1, { message: "Venue is required" }).optional().or(z.literal("")),
  })
);

export const internationalJournalDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().min(1, { message: "Title is required" }),
    doi: z.string().min(1, { message: "DOI is required" }).optional().or(z.literal("")),
    volume: z.string().min(1, { message: "Volume is required" }).optional().or(z.literal("")),
    joConName: z.string().min(1, { message: "Journal/Conference name is required" }).optional().or(z.literal("")),
    issueNo: z.string().min(1, { message: "Issue number is required" }).optional().or(z.literal("")),
    yearOfPublication: z
      .string()
      .min(1, { message: "Year of publication is required" }).optional().or(z.literal("")).optional().or(z.literal("")),
    pageNo: z.string().min(1, { message: "Page number from is required" }).optional().or(z.literal("")),
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
    .min(1, { message: "At least one author is required" }).optional().or(z.literal("")),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"], {
      message: "Please select a publication",
    }).optional().or(z.literal("")),
    issn: z.string().min(1, { message: "ISSN is required" }).optional().or(z.literal("")),  
    impactFactor: z.string().min(1, { message: "Impact factor is required" }).optional().or(z.literal("")),
    quartile:z.string().min(1, { message: "Quartile is required" }).optional().or(z.literal("")),
    sponsor: z.string().min(1, { message: "Sponsor is required" }).optional().or(z.literal("")),
    venue : z.string().min(1, { message: "Venue is required" }).optional().or(z.literal("")),
  })
);

export const nationalConferenceDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().min(1, { message: "Title is required" }),
    doi: z.string().min(1, { message: "DOI is required" }).optional().or(z.literal("")),
    volume: z.string().min(1, { message: "Volume is required" }).optional().or(z.literal("")),
    joConName: z.string().min(1, { message: "Journal/Conference name is required" }).optional().or(z.literal("")),
    issueNo: z.string().min(1, { message: "Issue number is required" }).optional().or(z.literal("")),
    yearOfPublication: z
      .string()
      .min(1, { message: "Year of publication is required" }).optional().or(z.literal("")).optional().or(z.literal("")),
    pageNo: z.string().min(1, { message: "Page number from is required" }).optional().or(z.literal("")),
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
    .min(1, { message: "At least one author is required" }).optional().or(z.literal("")),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"], {
      message: "Please select a publication",
    }).optional().or(z.literal("")),
    issn: z.string().min(1, { message: "ISSN is required" }).optional().or(z.literal("")),  
    impactFactor: z.string().min(1, { message: "Impact factor is required" }).optional().or(z.literal("")),
    quartile:z.string().min(1, { message: "Quartile is required" }).optional().or(z.literal("")),
    sponsor: z.string().min(1, { message: "Sponsor is required" }).optional().or(z.literal("")),
    venue : z.string().min(1, { message: "Venue is required" }).optional().or(z.literal("")),
  })
);

export const eventsAttendedSchema = z.array(
  z.object({
    typeOfEvent: z
      .string()
      .min(1, { message: "Type of event is required" }), // Required field
    nameofevent: z
      .string()
      .min(1, { message: "Name of the event is required" }), // Required field for event name
    fromDate: z
      .coerce.date({ message: "From date is required" }), // Required date field
    toDate: z
      .coerce.date({ message: "To date is required" }), // Required date field
    organizer: z
      .string()
      .min(1, { message: "Organizer is required" }), // Required field
    venue: z
      .string()
      .min(1, { message: "Venue of event is required" }), // Required field
    sponsor: z.string().optional(), // Optional field for sponsor
    targetAudience: z.string().optional(), // Optional field for target audience
  })
);


export const eventsOrganizedSchema = z.array(
  z.object({
    id: z.number().optional(), // Optional, typically auto-generated
    typeOfEvent: z
      .string()
      .min(1, { message: "Type of event is required" }), // Required
    nameofevent: z
      .string()
      .min(1, { message: "Name of the event is required" }), // Required
    fromDate: z
      .coerce.date({ message: "From date is required" }), // Required, coerced to a date
    toDate: z
      .coerce.date({ message: "To date is required" }), // Required, coerced to a date
    organizer: z
      .string()
      .min(1, { message: "Organizer is required" }), // Required
    venue: z
      .string()
      .min(1, { message: "Venue is required" }), // Required
    sponsor: z.string().optional(), // Optional, nullable in the database
    targetAudience: z.string().optional(), // Optional, nullable in the database

  })
);
// export const invitedTalksSchema = z.array(
//   z.object({
   
//     typeOfEvent: z.string().min(1, { message: "Type of event is required" }),
//     title: z.string().min(1, { message: "Title is required" }),
//     fromDate: z.coerce.date({ message: "From date is required" }),
//     toDate: z.coerce.date({ message: "To date is required" }),
//     organizer: z.string().min(1, { message: "Organizer is required" }),
//     venueOfEvent: z.string().min(1, { message: "Venue is required" }),
//     targetAudience: z
//       .string()
//       .min(1, { message: "Target audience is required" }),
//   })
// );
export const internationalConferenceDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().min(1, { message: "Title is required" }),
    doi: z.string().min(1, { message: "DOI is required" }).optional().or(z.literal("")),
    volume: z.string().min(1, { message: "Volume is required" }).optional().or(z.literal("")),
    joConName: z.string().min(1, { message: "Journal/Conference name is required" }).optional().or(z.literal("")),
    issueNo: z.string().min(1, { message: "Issue number is required" }).optional().or(z.literal("")),
    yearOfPublication: z
      .string()
      .min(1, { message: "Year of publication is required" }).optional().or(z.literal("")).optional().or(z.literal("")),
    pageNo: z.string().min(1, { message: "Page number from is required" }).optional().or(z.literal("")),
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
    .min(1, { message: "At least one author is required" }).optional().or(z.literal("")),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"], {
      message: "Please select a publication",
    }).optional().or(z.literal("")),
    issn: z.string().min(1, { message: "ISSN is required" }).optional().or(z.literal("")),  
    impactFactor: z.string().min(1, { message: "Impact factor is required" }).optional().or(z.literal("")),
    quartile:z.string().min(1, { message: "Quartile is required" }).optional().or(z.literal("")),
    sponsor: z.string().min(1, { message: "Sponsor is required" }).optional().or(z.literal("")),
    venue : z.string().min(1, { message: "Venue is required" }).optional().or(z.literal("")),
  })
);

export const researchGrantsSchema = z.array(
  z.object({
    projectTitle: z.string().min(1, { message: "Project Title is required" }),
    pi: z.string().optional(), // Principal Investigator (nullable)
    coPi: z.string().optional(), // Co-Principal Investigator (nullable)
    dOfSanction: z
      .coerce.date({ message: "Invalid date format" })
      .optional(), // Sanctioned date (nullable)
    duration: z.string().optional(), // Duration of project (nullable)
    fundingAgency: z
      .string()
      .min(1, { message: "Funding agency is required" }),
    amount:z
    .string()
    .min(1, { message: "Year of publication is required" })
      .optional(), // Sanctioned amount (nullable)
    status: z
      .enum(["Ongoing", "Completed"], { message: "Please select a valid status" })
      .optional(), // Project status (nullable)
  })
);

export const consultancySchema = z.array(
  z.object({
    faculty_name: z.string().min(1, { message: "Faculty name is required" }), // Required
    sanctionedDate: z
      .coerce.date()
      .optional(), // Nullable date
    projectPeriod: z
      .string()
      .optional(), // Nullable string for time period
      amount:z
      .string()
      .min(1, { message: "Year of publication is required" })
        .optional(), // Sanctioned amount (nullable)
    principalInvestigator: z
      .string()
      .optional(), // Nullable string
    coPrincipalInvestigator: z
      .string()
      .optional(), // Nullable string
    status: z
      .enum(["Ongoing", "Completed"], { message: "Please select a valid status" })
      .optional(), // Nullable enum
  })
);

export const patentsSchema = z.array(
  z.object({
    areaOfResearch: z
      .string()
      .min(1, { message: "Area of research is required" }), // Required
    grantedYear:z
    .string()
    .min(1, { message: "Year of publication is required" })
      .optional(),// Assuming a 4-character year string,
    patentNo: z.string().optional(), // Optional field for patent number
    patentStatus: z
      .string(), // Enum with optional status
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
      .min(1, { message: "At least one author is required" })
  })
    );

// export const researchScholarDetailsSchema = z.array(
//   z.object({
//     nameOfResearchScholar: z
//       .string()
//       .min(1, { message: "Name of research scholar is required" }),
//     universitySeatNumber: z
//       .string()
//       .min(1, { message: "University seat number is required" }),
//     areaOfResearch: z
//       .string()
//       .min(1, { message: "Area of research is required" }),
//     dateOfRegistration: z.coerce.date({
//       message: "Date of registration is required",
//     }),
//     universityOfRegistration: z
//       .string()
//       .min(1, { message: "University of registration is required" }),
//     designationOfResearcher: z
//       .string()
//       .min(1, { message: "Designation of researcher is required" }),
//     nameOfInstitute: z
//       .string()
//       .min(1, { message: "Name of institute is required" }),
//     progressOfResearchWork: z.enum(["Ongoing", "Completed"], {
//       message: "Please select an option",
//     }),
//   })
// );
export const publicationsSchema = z.array(
  z.object({
    publicationType:z.string(),// Required enum for publication type
    name: z.string().min(1, { message: "Name of the publication is required" }), // Required
    volume: z.string().optional(), // Optional field for volume (nullable)
    pageNumber: z.string().optional(), // Optional field for page number (nullable)
    issn: z.string().optional(), // Optional ISSN field
    authors: z.array(z.string().min(1, { message: "Author name cannot be empty" }))
    .min(1, { message: "At least one author is required" }).optional().or(z.literal("")),
    publisher: z.string().optional(), // Optional publisher name
    title: z.string().optional(), // Optional title field
    area: z.string().optional(), // Optional research area
    impactFactor: z
      .string().min(1,{message: "impact Factor is missing"}), // Optional impact factor as float
    yearOfPublish:z .string().min(1,{message: "impact Factor is missing"}),// Assuming a 4-character year string
  })
);
export const professionalMembershipSchema = z.array(
  z.object({
    professionalBody: z
      .string()
      .min(1, { message: "Professional Body is required" }), // Required field
    membershipId: z.string().optional(), // Optional membership ID
    membershipSince: z.coerce.date().optional(), // Optional date field, coerced to a date
    membershipType: z
      .string()
      .optional(), // Optional field for membership type
  })
);


export const facultyResearchDetailsSchema = z.object({
  facultyResearchSchema,
  nationalJournalDetailsSchema,
  internationalJournalDetailsSchema,
  nationalConferenceDetailsSchema,
  internationalConferenceDetailsSchema,
  researchGrantsSchema,
  consultancySchema,
  patentsSchema,
  eventsAttendedSchema,
  eventsOrganizedSchema,
  // invitedTalksSchema,
  publicationsSchema,
  professionalMembershipSchema,
});