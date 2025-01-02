import { z } from "zod";


export const academicSchema = z.object({
  qualification: z.string().min(1, { message: "Qualification is required" }).optional().or(z.literal("")),
  department: z.string().min(1, { message: "Department is required" }).optional().or(z.literal("")),
  designation: z.string().min(1, { message: "Designation is required" }).optional().or(z.literal("")),
  level: z.string().min(1, { message: "Level is required" }).optional().or(z.literal("")),
});


export const previousTeachingExperienceSchema = z.array(
  z.object({
  
    instituteName: z.string().min(1, { message: "Institution is required" }),
    Designation: z.string().min(1, { message: "Designation is required" }),
    departmentName: z.string().min(1, { message: "departmentName is required" }),
    fromDate: z.coerce.date({ message: "From date is required" }),
    toDate: z.coerce.date({ message: "To date is required" }),
  })
);

export const teachingExperienceIndustrySchema = z.array(
  z.object({
   
    organization: z.string().min(1, { message: "Organization is required" }),
    fromDate: z.coerce.date({ message: "Designation on joining is required" }),
    toDate: z.coerce.date({ message: "Date of leaving is required" }),
    designation: z
      .string()
      .min(1, { message: "Designation on leaving is required" }),
  })
);



export const responsibilitiesSchema = z.array(
  z.object({
    
    additionalResponsibilitiesHeld: z
      .string()
      .min(1, { message: "Additional responsibilities is required" }),
    level: z.string().min(1, { message: "level is required" }),
    fromDate: z.coerce.date({ message: "From date is required" }),
    toDate: z.coerce.date({ message: "To date is required" }),
  })
);

export const extracurricularsSchema = z.array(
  z.object({
  
    typeOfEvent: z.string().min(1, { message: "Type of event is required" }),
    titleOfEvent: z.string().min(1, { message: "Title of event is required" }),
    fromDate: z.coerce.date({ message: "From date is required" }),
    toDate: z.coerce.date({ message: "To date is required" }),
    organizer: z.string().min(1, { message: "Organizer is required" }),
    level: z.string().min(1, { message: "Level is required" }),
    achievement: z.string().min(1, { message: "Achievement is required" }),
  })
);

export const outreachSchema = z.array(
  z.object({
 
    activity: z.string().min(1, { message: "Activity is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    fromDate: z.coerce.date({ message: "From date is required" }),
    toDate: z.coerce.date({ message: "To date is required" }),
    place: z.string().min(1, { message: "Place is required" }),
  })
);

export const recognitionsSchema = z.array(
  z.object({
     recognitionFrom: z.string().min(1, { message: "Recognition recieved from is required" }),
     recognitionRecieved: z.string().min(1, { message: "Recognition recieved is required" }),
     recognitionDate: z.coerce.date({ message: "Recognition date is required" }),
  })
);

export const awardsSchema = z.array(
  z.object({
    awardFrom: z.string().min(1, { message: "Award recieved from is required" }),
    awardRecieved: z.string().min(1, { message: "Award recieved is required" }),
    awardDate: z.coerce.date({ message: "Award date is required" }),
  })
);

export const facultyAcademicDetailsSchema = z.object({
  academicSchema,
  previousTeachingExperienceSchema,
  teachingExperienceIndustrySchema,
  responsibilitiesSchema,
  extracurricularsSchema,
  outreachSchema,
  recognitionsSchema,
  awardsSchema,
});
