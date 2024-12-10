// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { z } from "zod";
// import { facultyAcademicDetailsSchema } from "@/schemas/academic-details";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import { identity } from "lodash";
// import FormProgress from "@/components/FormProgress";
// import { Step } from "@/types/form";
// import FormField from "@/components/FormField";
// import FormNavigation from "@/components/FormNavigation";
// import { FormProvider } from "@/hooks/FormProvider";
// import Header from "@/components/ui/header";
// import { NavLinks } from "@/components/faculty/ui/nav-links";

// type Inputs = z.infer<typeof facultyAcademicDetailsSchema>;

// const steps: Step[] = [
//   {
//     id: "Step 1",
//     name: "Current Teaching Experience",
//     fields: [
//       "academicSchema.qualification",
//       "academicSchema.aicteFacultyId",
//       "academicSchema.department",
//       "academicSchema.designation",
//       "academicSchema.level",
//       "teachingExperienceDrAITSchema.dateOfJoining",
//       "teachingExperienceDrAITSchema.designationOnJoining",
//       "areaOfSpecializationSchema.subjectsTaught",
//       "areaOfSpecializationSchema.program",
//       "areaOfSpecializationSchema.noOfTimes",
//     ],
//   },
//   {
//     id: "Step 2",
//     name: "Previous Teaching Experience",
//     fields: [
//       "previousTeachingExperienceSchema",
//       "teachingExperienceIndustrySchema",
//       "teachingExperienceResearchSchema",
//     ],
//   },
//   {
//     id: "Step 3",
//     name: "Events",
//     fields: [
//       "eventsAttendedSchema",
//       "eventsOrganizedSchema",
//       "invitedTalksSchema",
//     ],
//   },
//   {
//     id: "Step 4",
//     name: "Publications and Awards",
//     fields: ["publicationsSchema"],
//   },
//   {
//     id: "Step 5",
//     name: "Awards and Recognitions",
//     fields: ["awardsSchema", "recognitionsSchema"],
//   },
//   {
//     id: "Step 6",
//     name: "Extracurricular Details",
//     fields: [
//       "responsibilitiesSchema",
//       "extracurricularsSchema",
//       "outreachSchema",
//     ],
//   },
//   { id: "Step 7", name: "Complete", fields: [] },
// ];

// export default function Form() {
//   const [previousStep, setPreviousStep] = useState(0);
//   const [currentStep, setCurrentStep] = useState(0);
//   const delta = currentStep - previousStep;
//   const formatDate = (date: Date) => date.toISOString().split('T')[0];
//   const {
//     control,
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     trigger,
//     setValue,
//     formState: { errors },
//   } = useForm<Inputs>({
//     resolver: zodResolver(facultyAcademicDetailsSchema),
//     defaultValues: {
//       academicSchema: {
//         qualification: "PhD",
//         aicteFacultyId: "FAC12345",
//         department: "Computer Science",
//         designation: "Assistant Professor",
//         level: "L1",
//       },
//       teachingExperienceDrAITSchema: {
//         dateOfJoining: new Date("2020-08-01"),
//         designationOnJoining: "Lecturer",
//       },
//       previousTeachingExperienceSchema: [
//         {
//           slNo: "1",
//           instituteName: "XYZ University",
//           fromDate: new Date("2017-01-01"),
//           toDate: new Date("2020-01-01"),
//         },
//       ],
//       teachingExperienceIndustrySchema: [],
//       teachingExperienceResearchSchema: [],
//       areaOfSpecializationSchema: {
//         subjectsTaught: "Data Structures, Algorithms",
//         program: "B.Tech",
//         noOfTimes: "2",
//       },
//       eventsAttendedSchema: [
//         {
//           slNo: "1",
//           typeOfEvent: "Conference",
//           title: "AI Conference 2021",
//           fromDate: new Date("2021-09-15"),
//           toDate: new Date("2021-09-15"),
//           organizer: "Tech AI",
//           venueOfEvent: "Virtual",
//         },
//       ],
//       eventsOrganizedSchema: [],
//       invitedTalksSchema: [],
//       publicationsSchema: [
//         {
//           slNo: "1",
//           typeOfPublication: "Journal",
//           n_In: "International",
//           nameOfJournal: "AI and Its Applications",
//           volumeAndPage: "Vol 5, pp 23-45",
//           doi: "10.1234/ai.journal.2021",
//           impactFactor: "3.5",
//         },
//       ],
//       responsibilitiesSchema: [
//         {
//           slNo: "1",
//           additionalResponsibilitiesHeld: "Department Head",
//           fromDate: new Date("2021-01-01"),
//           toDate: new Date("2022-01-01"),
//         },
//       ],
//       extracurricularsSchema: [
//         {
//           slNo: "1",
//           typeOfEvent: "Sports",
//           titleOfEvent: "Inter-College Football Championship",
//           fromDate: new Date("2019-03-10"),
//           toDate: new Date("2019-03-15"),
//           organizer: "XYZ University",
//           level: "University",
//           achievement: "Winner",
//         },
//       ],
//       outreachSchema: [
//         {
//           slNo: "1",
//           activity: "Community Service",
//           role: "Volunteer",
//           fromDate: new Date("2020-05-01"),
//           toDate: new Date("2020-05-10"),
//           place: "Local Shelter",
//         },
//       ],
//       recognitionsSchema: [
//         {
//           slNo: "1",
//           recognitionRecieved: "Best Research Paper Award",
//         },
//       ],
//       awardsSchema: [
//         {
//           slNo: "1",
//           awardRecieved: "Best Teacher Award 2021",
//         },
//       ],
//     },
//   });
  
//   const {
//     fields: previousTeaching,
//     append: appendPreviousTeaching,
//     remove: removePreviousTeaching,
//   } = useFieldArray({ control, name: "previousTeachingExperienceSchema" });

//   const {
//     fields: teachingIndustry,
//     append: appendTeachingIndustry,
//     remove: removeTeachingIndustry,
//   } = useFieldArray({ control, name: "teachingExperienceIndustrySchema" });

//   const {
//     fields: teachingResearch,
//     append: appendTeachingResearch,
//     remove: removeTeachingResearch,
//   } = useFieldArray({ control, name: "teachingExperienceResearchSchema" });

//   const {
//     fields: eventsAttended,
//     append: appendEventsAttended,
//     remove: removeEventsAttended,
//   } = useFieldArray({ control, name: "eventsAttendedSchema" });

//   const {
//     fields: eventsOrganized,
//     append: appendEventsOrganized,
//     remove: removeEventsOrganized,
//   } = useFieldArray({ control, name: "eventsOrganizedSchema" });

//   const {
//     fields: invitedTalks,
//     append: appendInvitedTalks,
//     remove: removeInvitedTalks,
//   } = useFieldArray({ control, name: "invitedTalksSchema" });

//   const {
//     fields: publications,
//     append: appendPublications,
//     remove: removePublications,
//   } = useFieldArray({ control, name: "publicationsSchema" });

//   const {
//     fields: responsibilities,
//     append: appendResponsibilities,
//     remove: removeResponsibilities,
//   } = useFieldArray({ control, name: "responsibilitiesSchema" });

//   const {
//     fields: extracurriculars,
//     append: appendExtracurriculars,
//     remove: removeExtracurriculars,
//   } = useFieldArray({ control, name: "extracurricularsSchema" });

//   const {
//     fields: outreach,
//     append: appendOutreach,
//     remove: removeOutreach,
//   } = useFieldArray({ control, name: "outreachSchema" });

//   const {
//     fields: recognitions,
//     append: appendRecognitions,
//     remove: removeRecognitions,
//   } = useFieldArray({ control, name: "recognitionsSchema" });

//   const {
//     fields: awards,
//     append: appendAwards,
//     remove: removeAwards,
//   } = useFieldArray({ control, name: "awardsSchema" });

//   const processForm: SubmitHandler<Inputs> = (data) => {
//     console.log(data);
//     reset();
//   };

//   type FieldName = keyof Inputs;
 
//   const nextButtonFunction = async () => {
//     const fields = steps[currentStep].fields;

//     const output = await trigger(fields as FieldName[], { shouldFocus: true });

//     if (!output) return;

//     if (currentStep < steps.length - 1) {
//       if (currentStep === steps.length - 2) {
//         const allFieldsValid = await trigger();
//         console.log("Submitting entire form");
//         if (allFieldsValid) {
//           console.log("Validation Successfull with all input data");
//           await handleSubmit(processForm)();
//         } else {
//           console.error(
//             "Validation Error with all input data with entire schema"
//           );
//         }
//       }
//       setPreviousStep(currentStep);
//       setCurrentStep((step) => step + 1);
//     }
//   };

//   const prevButtonFunction = () => {
//     if (currentStep > 0) {
//       setPreviousStep(currentStep);
//       setCurrentStep((step) => step - 1);
//     }
//   };

//   const handleStepClick = async (index: number) => {
//     if (index <= currentStep) {
//       // Allow navigating to any step before or equal to the current step
//       setPreviousStep(currentStep);
//       setCurrentStep(index);
//     } else {
//       // For future steps, validate the current step before allowing navigation
//       const fieldsToValidate = steps[currentStep].fields as FieldName[];
  
//       const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
      
//       if (isValid) {
//         setPreviousStep(currentStep);
//         setCurrentStep(index);
//       } else {
//         console.error("Please fix the validation errors before moving ahead.");
//       }
//     }
//   };
  
//   return (
//     <div>
//       <Header title="Faculty Details" />
//       <NavLinks />
    
//     <section className=" flex flex-col justify-between p-24">
//       <FormProgress steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

//       <FormProvider register={register} errors={errors}>
//         <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
//           {currentStep === 0 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Current Teaching Experience
//               </h2>

//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                 <FormField
//                   label="Qualification"
//                   stepsReference="academicSchema.qualification"
//                   type="text"
//                 />

//                 <FormField
//                   label="AICTE Faculty ID"
//                   stepsReference="academicSchema.aicteFacultyId"
//                   type="text"
//                 />

//                 <FormField
//                   label="Department"
//                   stepsReference="academicSchema.department"
//                   type="text"
//                 />

//                 <FormField
//                   label="Designation"
//                   stepsReference="academicSchema.designation"
//                   type="text"
//                 />

//                 <FormField
//                   label="Level"
//                   stepsReference="academicSchema.level"
//                   type="text"
//                 />

//                 <FormField
//                   label="Date of Joining"
//                   stepsReference="teachingExperienceDrAITSchema.dateOfJoining"
//                   type="date"
                  
//                 />

//                 <FormField
//                   label="Designation on Joining"
//                   stepsReference="teachingExperienceDrAITSchema.designationOnJoining"
//                   type="text"
//                 />

//                 <FormField
//                   label="Subjects Taught"
//                   stepsReference="areaOfSpecializationSchema.subjectsTaught"
//                   type="text"
//                 />

//                 <FormField
//                   label="Program"
//                   stepsReference="areaOfSpecializationSchema.program"
//                   type="text"
//                 />

//                 <FormField
//                   label="No of Times"
//                   stepsReference="areaOfSpecializationSchema.noOfTimes"
//                   type="number"
//                 />
//               </div>
//             </motion.div>
//           )}

//           {currentStep === 1 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Previous Teaching Experience
//               </h2>

//               {previousTeaching.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`previousTeachingExperienceSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Name of Institute"
//                     stepsReference={`previousTeachingExperienceSchema[${index}].instituteName`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`previousTeachingExperienceSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`previousTeachingExperienceSchema[${index}].toDate`}
//                     type="date"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removePreviousTeaching(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendPreviousTeaching({
//                     slNo: "",
//                     instituteName: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Previous Teaching Experience
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Industry Teaching Experience
//               </h2>

//               {teachingIndustry.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`teachingExperienceIndustrySchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Organization"
//                     stepsReference={`teachingExperienceIndustrySchema[${index}].organization`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`teachingExperienceIndustrySchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`teachingExperienceIndustrySchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Designation"
//                     stepsReference={`teachingExperienceIndustrySchema[${index}].designation`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeTeachingIndustry(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendTeachingIndustry({
//                     slNo: "",
//                     organization: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     designation: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Industry Teaching Experience
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Research Teaching Experience
//               </h2>

//               {teachingResearch.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`teachingExperienceResearchSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Organization"
//                     stepsReference={`teachingExperienceResearchSchema[${index}].organization`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`teachingExperienceResearchSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`teachingExperienceResearchSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Designation"
//                     stepsReference={`teachingExperienceResearchSchema[${index}].designation`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeTeachingResearch(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() =>
//                   appendTeachingResearch({
//                     slNo: "",
//                     organization: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     designation: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Research Teaching Experience
//               </button>
//             </motion.div>
//           )}

//           {currentStep === 2 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Events
//               </h2>

//               {eventsAttended.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`eventsAttendedSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Type of Event"
//                     stepsReference={`eventsAttendedSchema[${index}].typeOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Title"
//                     stepsReference={`eventsAttendedSchema[${index}].title`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`eventsAttendedSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`eventsAttendedSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Organizer"
//                     stepsReference={`eventsAttendedSchema[${index}].organizer`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Venue of Event"
//                     stepsReference={`eventsAttendedSchema[${index}].venueOfEvent`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeEventsAttended(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendEventsAttended({
//                     slNo: "",
//                     typeOfEvent: "",
//                     title: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     organizer: "",
//                     venueOfEvent: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Events Attended
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Events Organized
//               </h2>

//               {eventsOrganized.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`eventsOrganizedSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Type of Event"
//                     stepsReference={`eventsOrganizedSchema[${index}].typeOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Title"
//                     stepsReference={`eventsOrganizedSchema[${index}].title`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`eventsOrganizedSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`eventsOrganizedSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Sponsor"
//                     stepsReference={`eventsOrganizedSchema[${index}].sponsor`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Venue of Event"
//                     stepsReference={`eventsOrganizedSchema[${index}].venueOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Target Audience"
//                     stepsReference={`eventsOrganizedSchema[${index}].targetAudience`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeEventsOrganized(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendEventsOrganized({
//                     slNo: "",
//                     typeOfEvent: "",
//                     title: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     sponsor: "",
//                     venueOfEvent: "",
//                     targetAudience: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Events Organized
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Invited Talks
//               </h2>

//               {invitedTalks.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`invitedTalksSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Type of Event"
//                     stepsReference={`invitedTalksSchema[${index}].typeOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Title"
//                     stepsReference={`invitedTalksSchema[${index}].title`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`invitedTalksSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`invitedTalksSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Organizer"
//                     stepsReference={`invitedTalksSchema[${index}].organizer`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Venue of Event"
//                     stepsReference={`invitedTalksSchema[${index}].venueOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Target Audience"
//                     stepsReference={`invitedTalksSchema[${index}].targetAudience`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeInvitedTalks(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendInvitedTalks({
//                     slNo: "",
//                     typeOfEvent: "",
//                     title: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     organizer: "",
//                     venueOfEvent: "",
//                     targetAudience: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Invited Talks
//               </button>
//             </motion.div>
//           )}

//           {currentStep === 3 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Publications
//               </h2>

//               {publications.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`publicationsSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <div>
//                     <label
//                       htmlFor="directCorr"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Direct/Correspondence
//                     </label>
//                     <select
//                       id="directCorr"
//                       {...register(
//                         `publicationsSchema.${index}.typeOfPublication`
//                       )}
//                       className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
//                     >
//                       <option value="Direct">Direct</option>
//                       <option value="Correspondence">Correspondence</option>
//                     </select>
//                     {errors.publicationsSchema?.[index]?.typeOfPublication && (
//                       <p className="mt-2 text-sm text-red-600">
//                         {
//                           errors.publicationsSchema[index].typeOfPublication
//                             .message
//                         }
//                       </p>
//                     )}
//                   </div>

//                   <FormField
//                     label="N/IN"
//                     stepsReference={`publicationsSchema[${index}].n_In`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Name of journal"
//                     stepsReference={`publicationsSchema[${index}].nameOfJournal`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Volume and Page"
//                     stepsReference={`publicationsSchema[${index}].volumeAndPage`}
//                     type="text"
//                   />
//                   <FormField
//                     label="DOI"
//                     stepsReference={`publicationsSchema[${index}].doi`}
//                     type="text"
//                   />
//                   <FormField
//                     label="Impact Factor"
//                     stepsReference={`publicationsSchema[${index}].impactFactor`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removePublications(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendPublications({
//                     slNo: "",
//                     typeOfPublication: "Journal",
//                     n_In: "",
//                     nameOfJournal: "",
//                     volumeAndPage: "",
//                     doi: "",
//                     impactFactor: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Publications
//               </button>
//             </motion.div>
//           )}

//           {currentStep === 4 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Awards and Recognitions
//               </h2>

//               {awards.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`awardsSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Award"
//                     stepsReference={`awardsSchema[${index}].awardRecieved`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeAwards(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendAwards({
//                     slNo: "",
//                     awardRecieved: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Awards
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Recognitions
//               </h2>

//               {recognitions.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`recognitionsSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Recognition"
//                     stepsReference={`recognitionsSchema[${index}].recognitionRecieved`}
//                     type="text"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeRecognitions(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() =>
//                   appendRecognitions({
//                     slNo: "",
//                     recognitionRecieved: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Recognitions
//               </button>
//             </motion.div>
//           )}

//           {currentStep === 5 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Responsibilities
//               </h2>

//               {responsibilities.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`responsibilitiesSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Responsibility"
//                     stepsReference={`responsibilitiesSchema[${index}].additionalResponsibilitiesHeld`}
//                     type="text"
//                   />
//                   <FormField
//                     label="From Date"
//                     stepsReference={`responsibilitiesSchema[${index}].fromDate`}
//                     type="date"
//                   />
//                   <FormField
//                     label="To Date"
//                     stepsReference={`responsibilitiesSchema[${index}].toDate`}
//                     type="date"
//                   />
//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeResponsibilities(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendResponsibilities({
//                     slNo: "",
//                     additionalResponsibilitiesHeld: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Responsibilities
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Extracurriculars
//               </h2>

//               {extracurriculars.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`extracurricularsSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Type of Event"
//                     stepsReference={`extracurricularsSchema[${index}].typeOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Title"
//                     stepsReference={`extracurricularsSchema[${index}].titleOfEvent`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`extracurricularsSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`extracurricularsSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Organizer"
//                     stepsReference={`extracurricularsSchema[${index}].organizer`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Level"
//                     stepsReference={`extracurricularsSchema[${index}].level`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Achievement"
//                     stepsReference={`extracurricularsSchema[${index}].achievement`}
//                     type="text"
//                   />

//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeExtracurriculars(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendExtracurriculars({
//                     slNo: "",
//                     typeOfEvent: "",
//                     titleOfEvent: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     organizer: "",
//                     level: "",
//                     achievement: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Extracurriculars
//               </button>

//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Outreach
//               </h2>

//               {outreach.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-1 gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     label="S.No"
//                     stepsReference={`outreachSchema[${index}].slNo`}
//                     type="number"
//                   />

//                   <FormField
//                     label="Type of Event"
//                     stepsReference={`outreachSchema[${index}].activity`}
//                     type="text"
//                   />

//                   <FormField
//                     label="Role"
//                     stepsReference={`outreachSchema[${index}].role`}
//                     type="text"
//                   />

//                   <FormField
//                     label="From Date"
//                     stepsReference={`outreachSchema[${index}].fromDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="To Date"
//                     stepsReference={`outreachSchema[${index}].toDate`}
//                     type="date"
//                   />

//                   <FormField
//                     label="Place"
//                     stepsReference={`outreachSchema[${index}].place`}
//                     type="text"
//                   />

//                   <div className="col-span-2 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => removeOutreach(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove Button
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   appendOutreach({
//                     slNo: "",
//                     activity: "",
//                     role: "",
//                     fromDate: new Date(),
//                     toDate: new Date(),
//                     place: "",
//                   })
//                 }
//                 className="text-blue-500 text-sm"
//               >
//                 + Add Outreach
//               </button>
//             </motion.div>
//           )}

//           {currentStep === 6 && (
//             <motion.div
//               initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Complete
//               </h2>
//             </motion.div>
//           )}
//         </form>
//       </FormProvider>

//       <FormNavigation
//         prevButtonFunction={prevButtonFunction}
//         steps={steps}
//         currentStep={currentStep}
//         nextButtonFunction={nextButtonFunction}
//       />
//     </section>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { FacultyProfileNav } from "@/components/dashboard/facultyProfileNav";
export default function AcademicProfile() {
  const [academicDetails, setAcademicDetails] = useState<{
    data: {
      facultyId: string;
      employeeId: string;
      qualification: string;
      department: string;
      level: string;
      designation: string;
      responsibilities: Array<{
        additionalResponsibility: string;
        level: string;
        fromDate: string;
        toDate: string;
      }>;
      awardsandrecognition: Array<{
        recognitionReceived: string;
        awardReceived: string;
      }>;
      eventsAttended: Array<{
        nameofevent: string;
        typeofevent: string;
        fromDate: string;
        toDate: string;
        organizer: string;
        venue: string;
        sponsor?: string;
        targetAudience?: string;
      }>;
      EventOrganized: Array<{
        nameofevent: string;
        typeofevent: string;
        fromDate: string;
        toDate: string;
        organizer: string;
        venue: string;
        sponsor?: string;
        targetAudience?: string;
      }>;
      extracurriculars: Array<{
        eventType: string;
        eventTitle: string;
        fromDate: string;
        toDate: string;
        organizer: string;
        level: string;
        achievement: string;
      }>;
      industryExperience: Array<{
        organization: string;
        designation: string;
        fromDate: string;
        toDate: string;
      }>;
      invitedTalks: Array<{
        eventType: string;
        topic: string;
        fromDate: string;
        toDate: string;
        organizer: string;
        venue: string;
        targetAudience: string;
      }>;
      outreachActivities: Array<{
        activity: string;
        role: string;
        fromDate: string;
        toDate: string;
        place: string;
      }>;
      previousExperience: {
        instituteName: string;
        fromDate: string;
        toDate: string;
      } | null;
      researchExperience: Array<{
        organization: string;
        designation: string;
        fromDate: string;
        toDate: string;
      }>;
      specializations: Array<{
        subjectsTaught: string;
        program: string;
        numberOfTimes: number;
      }>;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // For fetching query parameters
  const router = useRouter(); // New router from `next/navigation`

  useEffect(() => {
    async function fetchAcademicDetails() {
      try {
        const token = localStorage.getItem("token");
        const facultyId = token ? JSON.parse(token).facultyId : null;

        if (!facultyId) {
          notFound();
          return;
        }

        const response = await fetch(
          `/api/facultyacademicdetails?facultyId=${facultyId}`
        );
        if (!response.ok) {
          router.push(`/faculty/faculty_reg/profile/academic-details?facultyId=${facultyId}`);
          return;
        }
        
        const data = await response.json();
        console.log(data);
        setAcademicDetails(data);


      } catch (error) {
        console.error("Error fetching academic details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAcademicDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!academicDetails) {
    return <div>Academic details not found</div>;
  }

  return (
    <div>
      <FacultyProfileNav />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Academic Details
        </h1>

        {/* General Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-medium text-gray-800">
              {academicDetails.data.employeeId}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Faculty ID</p>
            <p className="font-medium text-gray-800">
              {academicDetails.data.facultyId}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Qualification</p>
            <p className="font-medium text-gray-800">
              {academicDetails.data.qualification}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium text-gray-800">
              {academicDetails.data.department}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Designation</p>
            <p className="font-medium text-gray-800">
              {academicDetails.data.designation}
            </p>
            
          </div>
        </div>

      </div>
    </div>
  );
}
