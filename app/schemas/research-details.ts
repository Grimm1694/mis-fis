import { xor } from "lodash";
import { z } from "zod";

export const facultyResearchSchema = z.object({
  vtuFacultyId: z.string().optional(),
  googleScholarId: z.string().optional(),
  orcId: z.string().optional(),
  scopusId: z.string().optional(),
  publonsAndWebOfScienceId: z.string().optional(),
  researchId: z.string().optional(),
});


export const research_experienceSchema = z.array(z.object({
  areaofresearch: z.string().optional(),
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
}))
export const nationalJournalDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().optional(),
    doi: z.string().optional(),
    volume: z.string().optional(),
    joConName: z.string().optional(),
    issueNo: z.string().optional(),
    yearOfPublication: z.string().optional(),
    pageNo: z.string().optional(),
    authors: z.array(z.string().optional()).optional(),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"]).optional(),
    issn: z.string().optional(),
    impactFactor: z.string().optional(),
    quartile: z.string().optional(),
    sponsor: z.string().optional(),
    venue: z.string().optional(),
  })
);

export const internationalJournalDetailsSchema = nationalJournalDetailsSchema; // Reuse the schema

export const nationalConferenceDetailsSchema = z.array(
  z.object({
    titleOfResearchPaper: z.string().optional(),
    doi: z.string().optional(),
    volume: z.string().optional(),
    joConName: z.string().optional(),
    issueNo: z.string().optional(),
    yearOfPublication: z.string().optional(),
    pageNo: z.string().optional(),
    authors: z.array(z.string().optional()).optional(),
    publishedUnder: z.enum(["Web of Science", "Scopus", "Q1", "Q2", "Q3"]).optional(),
    issn: z.string().optional(),
    impactFactor: z.string().optional(),
    quartile: z.string().optional(),
    sponsor: z.string().optional(),
    venue: z.string().optional(),
  })
);

export const internationalConferenceDetailsSchema = nationalConferenceDetailsSchema; // Reuse the schema

export const eventsAttendedSchema = z.array(
  z.object({
    typeOfEvent: z.string().optional(),
    nameofevent: z.string().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    organizer: z.string().optional(),
    venue: z.string().optional(),
    sponsor: z.string().optional(),
    targetAudience: z.string().optional(),
  })
);

export const eventsOrganizedSchema = z.array(
  z.object({
    id: z.number().optional(),
    typeOfEvent: z.string().optional(),
    nameofevent: z.string().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    organizer: z.string().optional(),
    venue: z.string().optional(),
    sponsor: z.string().optional(),
    targetAudience: z.string().optional(),
  })
);

export const researchGrantsSchema = z.array(
  z.object({
    projectTitle: z.string().optional(),
    pi: z.string().optional(),
    coPi: z.string().optional(),
    dOfSanction: z.coerce.date().optional(),
    duration: z.string().optional(),
    fundingAgency: z.string().optional(),
    amount: z.string().optional(),
    status: z.enum(["Ongoing", "Completed"]).optional(),
  })
);

export const consultancySchema = z.array(
  z.object({
    faculty_name: z.string().optional(),
    sanctionedDate: z.coerce.date().optional(),
    projectPeriod: z.string().optional(),
    amount: z.string().optional(),
    principalInvestigator: z.string().optional(),
    coPrincipalInvestigator: z.string().optional(),
    status: z.enum(["Ongoing", "Completed"]).optional(),
  })
);

export const patentsSchema = z.array(
  z.object({
    areaOfResearch: z.string().optional(),
    grantedYear: z.string().optional(),
    patentNo: z.string().optional(),
    patentStatus: z.string().optional(),
    authors: z.array(z.string().optional()).optional(),
  })
);

export const publicationsSchema = z.array(
  z.object({
    publicationType: z.string().optional(),
    name: z.string().optional(),
    volume: z.string().optional(),
    pageNumber: z.string().optional(),
    issn: z.string().optional(),
    authors: z.array(z.string().optional()).optional(),
    publisher: z.string().optional(),
    title: z.string().optional(),
    area: z.string().optional(),
    impactFactor: z.string().optional(),
    yearOfPublish: z.string().optional(),
  })
);

export const professionalMembershipSchema = z.array(
  z.object({
    professionalBody: z.string().optional(),
    membershipId: z.string().optional(),
    membershipSince: z.coerce.date().optional(),
    membershipType: z.string().optional(),
  })
);

export const facultyResearchDetailsSchema = z.object({
  facultyResearchSchema: facultyResearchSchema.optional(),
  nationalJournalDetailsSchema: nationalJournalDetailsSchema.optional(),
  internationalJournalDetailsSchema: internationalJournalDetailsSchema.optional(),
  nationalConferenceDetailsSchema: nationalConferenceDetailsSchema.optional(),
  internationalConferenceDetailsSchema: internationalConferenceDetailsSchema.optional(),
  researchGrantsSchema: researchGrantsSchema.optional(),
  consultancySchema: consultancySchema.optional(),
  patentsSchema: patentsSchema.optional(),
  eventsAttendedSchema: eventsAttendedSchema.optional(),
  eventsOrganizedSchema: eventsOrganizedSchema.optional(),
  publicationsSchema: publicationsSchema.optional(),
  professionalMembershipSchema: professionalMembershipSchema.optional(),
  research_experienceSchema: research_experienceSchema.optional(),
});


