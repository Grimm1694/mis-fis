import { z } from "zod";

export const FormDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
});

export const testSchema = z.object({
  FormDataSchema,
});

export const personalSchema = z.object({
  // facultyId: z
  //   .string({ message: "Faculty ID is required" })
  //   .regex(/[a-zA-Z]{3}[0-9]{2}/, {
  //     message: "Correct format - first three letters followed by 2 digits",
  //   }), //first three letters then 2 digits
  qualification: z.string().min(1, { message: "Qualification is required" }),
  //photo: z.string({ message: "Photo is required" }),
  title: z.string().min(1, { message: "Qualification is required" }),
  department:z.string().min(1, { message: "Department is required" }),
  designation: z.string().min(1, { message: "Designation is required" }),
  aided : z.string().min(1, { message: "Field is required" }),
  prefix: z.enum(["Mr", "Mrs", "Ms", "Dr", "Prof"]),
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]*$/, "First name must contain only alphabets"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]*$/, "Last name must contain only alphabets"),
  emailId: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  contactNo: z
    .string({ message: "Phone number is required" })
    .regex(/[0-9]{10}/, { message: "Phone number must be 10 digits" }),
  alternateContactNo: z
    .string({ message: "Phone number is required" })
    .regex(/[0-9]{10}/, { message: "Phone number must be 10 digits" }),
  emergencyContactNo: z
    .string({ message: "Emergency contact number is required" })
    .regex(/[0-9]{10}/, { message: "Phone number must be 10 digits" }).optional().or(z.literal("")),
  aadhar: z
    .string({ message: "Aadhar number is required" })
    .regex(/[0-9]{12}/, { message: "Aadhar number must be 12 digits" }),
  pan: z
    .string({ message: "PAN number is required" })
    .regex(/[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/, {
      message: "PAN number must be in the correct format",
    }),
  dob: z.coerce.date({ message: "Date of birth is required" }),
  gender: z.enum(["Male", "Female"]),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  firstAddressLine1: z.string().min(5, { message: "Address is required" }),
  firstAddressLine2: z.string().min(5, { message: "Address is required" }),
  firstAddressLine3: z.string().min(5, { message: "Address is required" }),
  correspondenceAddressLine1: z.string().min(5, {
    message: "Correspondence Address is required",
  }),
  correspondenceAddressLine2: z.string().min(5, {
    message: "Correspondence Address is required",
  }),
  correspondenceAddressLine3: z.string().min(5, {
    message: "Correspondence Address is required",
  }),
  religion: z.string().min(1, { message: "Religion is required" }),
  caste: z.string().min(1, { message: "Caste is required" }),
  category: z.enum(["General", "OBC", "SC", "ST"], {
    message: "Category is required",
  }),
  motherTongue: z.string().min(1, { message: "Mother tongue is required" }),
  speciallyChanged: z.boolean(),
  speciallyChangedRemarks: z.string().optional().or(z.literal("")),
  languagesToSpeak: z.array(z.string(), {
    message: "Please select a language",
  }),
  languagesToRead: z.array(z.string(), {
    message: "Please select a language",
  }),
  languagesToWrite: z.array(z.string(), {
    message: "Please select a language",
  }),
});

export const financialSchema = z.object({
  //facultyId: z.string({ message: "Faculty ID is required" }),
  bankName: z.string().min(3, { message: "Bank name is required" }),
  accountNo: z.string().regex(/[0-9]{8,17}/, {
    message: "Account number must be in correct format",
  }),
  accountName: z.string().min(3, { message: "Account name is required" }),
  typeOfAccount: z.enum(["Savings", "Current"]),
  branch: z.string().min(3, { message: "Branch is required" }),
  ifscCode: z
    .string({ message: "IFSC code is required" })
    .regex(/[a-zA-Z0-9]{11}/, {
      message: "IFSC code must be in correct format",
    }),
  pfNumber: z
    .string({ message: "PF number is required" })
    .regex(/[a-zA-Z0-9]{22}/, {
      message: "PF number must be in correct format",
    }).optional()
    .or(z.literal("")),
  uanNumber: z
    .string({ message: "UAN number is required" })
    .regex(/[0-9]{12}/, { message: "UAN number must be in correct format" }).optional().or(z.literal(""))
    .or(z.literal("")),
  pensionNumber: z
    .string({ message: "Pension number is required" })
    .regex(/[0-9]{12}/, {
      message: "Pension number must be in correct format",
    }).optional().or(z.literal(""))
    .or(z.literal("")),

});

export const educationSchema = z.array(
  //facultyId: z.string().min(1, { message: "Faculty ID is required" }),
  z.object({
    class: z.string().min(1, { message: "Class is required" }),
    usn: z.string().min(1, { message: "USN is required" }),
    institution: z.string().min(3, { message: "Institution is required" }),
    specialization: z
      .string()
      .min(3, { message: "Specialization is required" }),
    mediumOfInstruction: z.string().min(3, {
      message: "Medium of instruction is required",
    }),
    directCorr: z.enum(["Direct", "Correspondence"], {
      message: "Please select a mode of education",
    }),
    passClass: z.enum(["Distinction", "First", "Second", "Third", "Fail"], {
      message: "Please select a class",
    }),
    PassingYear: z.string().min(1, { message: "Passing year is required" })
  })
);

export const dependentsSchema = z.object({
  //facultyId: z.string({ message: "Faculty ID is required" }),
  motherName: z.string().optional().or(z.literal("")),
  fatherName: z.string().optional().or(z.literal("")),
  spouseName: z.string().optional().or(z.literal("")),
  children: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }).optional().or(z.literal("")),
      gender: z.enum(["Male", "Female", "Prefer not to say"]).optional().or(z.literal("")),
      dob: z.coerce.date({ message: "Date of birth is required" }).optional().or(z.literal("")),
    })
  ),
});

export const facultyPersonalDetailsSchema = z.object({
  personalSchema,
  financialSchema,
  educationSchema,
  dependentsSchema,
});
