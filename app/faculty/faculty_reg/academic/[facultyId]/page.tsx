"use client";
import { useState } from "react";
import { motion } from "framer-motion";
// import { useEffect } from "react";
import { z } from "zod";
import { facultyAcademicDetailsSchema } from "../../../../schemas/academic-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import { identity } from "lodash";
import { Step } from "../../../../types/form";
import FormField from "../../../../components/FormField";
// import FormNavigation from "../../../components/FormNavigation";
import { FormProvider } from "../../../../hooks/FormProvider";
// import Header from "@/app/components/ui/commonheader";
// import { NavLinks } from "../../../components/ui/nav-links";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
type Inputs = z.infer<typeof facultyAcademicDetailsSchema>;

const steps: Step[] = [
  {
    id: "Step 1",
    name: "Current Teaching Experience",
    fields: [
      "academicSchema.qualification",
      "academicSchema.department",
      "academicSchema.designation",
      "academicSchema.level",
      "previousTeachingExperienceSchema",
      "teachingExperienceIndustrySchema",
      "awardsSchema",
      "recognitionsSchema",
      "responsibilitiesSchema",
      "extracurricularsSchema",
      "outreachSchema",
    ],
  },
  { id: "Step 2", name: "Preview And Complete", fields: [] },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(facultyAcademicDetailsSchema),
  });

  const {
    fields: previousTeaching,
    append: appendPreviousTeaching,
    remove: removePreviousTeaching,
  } = useFieldArray({ control, name: "previousTeachingExperienceSchema" });

  const {
    fields: teachingIndustry,
    append: appendTeachingIndustry,
    remove: removeTeachingIndustry,
  } = useFieldArray({ control, name: "teachingExperienceIndustrySchema" });

  const {
    fields: responsibilities,
    append: appendResponsibilities,
    remove: removeResponsibilities,
  } = useFieldArray({ control, name: "responsibilitiesSchema" });

  const {
    fields: extracurriculars,
    append: appendExtracurriculars,
    remove: removeExtracurriculars,
  } = useFieldArray({ control, name: "extracurricularsSchema" });
  const {
    fields: outreach,
    append: appendOutreach,
    remove: removeOutreach,
  } = useFieldArray({ control, name: "outreachSchema" });

  const {
    fields: recognitions,
    append: appendRecognitions,
    remove: removeRecognitions,
  } = useFieldArray({ control, name: "recognitionsSchema" });

  const {
    fields: awards,
    append: appendAwards,
    remove: removeAwards,
  } = useFieldArray({ control, name: "awardsSchema" });

  const [facultyid, setFacultyid] = useState("");
  // Extract facultyId from URL using query string
  useEffect(() => {
    const pathname = window.location.pathname; // Get the full path
    const segments = pathname.split("/"); // Split path into segments
    const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)
    console.log(idFromPath);
    if (idFromPath) {
      setFacultyid(idFromPath);
    } else {
      console.warn("Faculty ID is not present in the dynamic route.");
    }
  }, []);

  const facultyId = facultyid;

  
  const processForm: SubmitHandler<Inputs> = async (data) => {
    console.log("All data", data);
    try {
      const response = await axios.post("/api/facultyacademicdetails", {
        // Include academic schema with default values if not available in your form
        academicSchema: data.academicSchema || {
          qualification: "",
          department: "",
          designation: "",
          level: "",
        },
        previousTeachingExperienceSchema:
          data.previousTeachingExperienceSchema || [],
        teachingExperienceIndustrySchema:
          data.teachingExperienceIndustrySchema || [],

        responsibilitiesSchema: data.responsibilitiesSchema || [],
        extracurricularsSchema: data.extracurricularsSchema || [],
        outreachSchema: data.outreachSchema || [],
        recognitionsSchema: data.recognitionsSchema || [],
        awardsSchema: data.awardsSchema || [],
      });

      if (response.status === 200) {
        console.log(response);
        // Handle success (e.g., show success message, redirect, etc.)
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };
  type FieldName = keyof Inputs;
  //   const nextButtonFunction = async () => {
  //     const fields = steps[currentStep].fields;

  //     const output = await trigger(fields as FieldName[], { shouldFocus: true });

  //     if (!output) return; // Prevent navigation if validation fails

  //     if (currentStep < steps.length - 1) {
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

  return (
    <div>
      {/* <FacultyProfileNav /> */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          className={`link hover:underline underline-offset-3`}
          href="/mis_faculty/faculty_home"
        >
          Home
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/faculty/faculty_reg/${facultyId}`}
        >
          Personal Details
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/faculty/faculty_reg/academic/${facultyId}`}
        >
          Academic Details
        </a>
        <a
          className={`link hover:underline underline-offset-3 `}
          href={`/faculty/faculty_reg/research/${facultyId}`}
        >
          Research Details
        </a>
      </nav>
      <section className=" flex flex-col justify-between p-24">
        <FormProvider register={register} errors={errors}>
          <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[-80px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Academic Details
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="Qualification"
                    stepsReference="academicSchema.qualification"
                    type="text"
                  />

                  <FormField
                    label="Department"
                    stepsReference="academicSchema.department"
                    type="text"
                  />

                  <FormField
                    label="Designation"
                    stepsReference="academicSchema.designation"
                    type="text"
                  />

                  <FormField
                    label="Level"
                    stepsReference="academicSchema.level"
                    type="text"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Teaching Experience
                </h2>

                {previousTeaching.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Name of Institute"
                      stepsReference={`previousTeachingExperienceSchema[${index}].instituteName`}
                      type="text"
                    />
                        <div>
                          <label
                            htmlFor={`previousTeachingExperienceSchema[${index}].Designation`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Designation
                          </label>
                          <select
                            id={`previousTeachingExperienceSchema[${index}].Designation`}
                            {...register(`previousTeachingExperienceSchema.${index}.Designation`)}
                            className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                          >
                            <option value="Professor">Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Lecturer">Lecturer</option>
                          </select>
                          {errors.previousTeachingExperienceSchema?.[index]?.Designation && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.previousTeachingExperienceSchema[index]?.Designation?.message}
                            </p>
                          )}
                        </div>

                    <FormField
                      label="Department"
                      stepsReference={`previousTeachingExperienceSchema[${index}].departmentName`}
                      type="text"
                    />
                    <FormField
                      label="From Date"
                      stepsReference={`previousTeachingExperienceSchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`previousTeachingExperienceSchema[${index}].toDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removePreviousTeaching(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendPreviousTeaching({
                      instituteName: "",
                      Designation: "",
                      departmentName: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Previous Teaching Experience
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Industry Teaching Experience
                </h2>

                {teachingIndustry.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Organization"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].organization`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].toDate`}
                      type="date"
                    />

                    <FormField
                      label="Designation"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].designation`}
                      type="text"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeTeachingIndustry(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendTeachingIndustry({
                      organization: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      designation: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Industry Teaching Experience
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Awards
                </h2>

                {awards.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Award Title"
                      stepsReference={`awardsSchema[${index}].awardRecieved`}
                      type="text"
                    />
                    <FormField
                      label="Award From"
                      stepsReference={`awardsSchema[${index}].awardFrom`}
                      type="text"
                    />
                    <FormField
                      label="Award Date"
                      stepsReference={`awardsSchema[${index}].awardDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAwards(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendAwards({
                      awardDate: new Date(),
                      awardFrom: "",
                      awardRecieved: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Awards
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Recognitions
                </h2>

                {recognitions.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Recognition Title"
                      stepsReference={`recognitionsSchema[${index}].recognitionRecieved`}
                      type="text"
                    />
                    <FormField
                      label="Recognition From"
                      stepsReference={`recognitionsSchema[${index}].recognitionFrom`}
                      type="text"
                    />
                    <FormField
                      label="Recognition Date"
                      stepsReference={`recognitionsSchema[${index}].recognitionDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeRecognitions(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendRecognitions({
                      recognitionDate: new Date(),
                      recognitionFrom: "",
                      recognitionRecieved: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Recognitions
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Responsibilities
                </h2>

                {responsibilities.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Responsibility"
                      stepsReference={`responsibilitiesSchema[${index}].additionalResponsibilitiesHeld`}
                      type="text"
                    />
                    <FormField
                      label="Level"
                      stepsReference={`responsibilitiesSchema[${index}].level`}
                      type="text"
                    />
                    <FormField
                      label="From Date"
                      stepsReference={`responsibilitiesSchema[${index}].fromDate`}
                      type="date"
                    />
                    <FormField
                      label="To Date"
                      stepsReference={`responsibilitiesSchema[${index}].toDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeResponsibilities(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendResponsibilities({
                      level: "",
                      additionalResponsibilitiesHeld: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Responsibilities
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Extracurriculars
                </h2>

                {extracurriculars.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Type of Event"
                      stepsReference={`extracurricularsSchema[${index}].typeOfEvent`}
                      type="text"
                    />

                    <FormField
                      label="Title"
                      stepsReference={`extracurricularsSchema[${index}].titleOfEvent`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`extracurricularsSchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`extracurricularsSchema[${index}].toDate`}
                      type="date"
                    />

                    <FormField
                      label="Organizer"
                      stepsReference={`extracurricularsSchema[${index}].organizer`}
                      type="text"
                    />

                    <FormField
                      label="Level"
                      stepsReference={`extracurricularsSchema[${index}].level`}
                      type="text"
                    />

                    <FormField
                      label="Achievement"
                      stepsReference={`extracurricularsSchema[${index}].achievement`}
                      type="text"
                    />

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeExtracurriculars(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendExtracurriculars({
                      typeOfEvent: "",
                      titleOfEvent: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      organizer: "",
                      level: "",
                      achievement: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Extracurriculars
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Outreach Activities
                </h2>

                {outreach.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Activity Name"
                      stepsReference={`outreachSchema[${index}].activity`}
                      type="text"
                    />

                    <FormField
                      label="Role"
                      stepsReference={`outreachSchema[${index}].role`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`outreachSchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`outreachSchema[${index}].toDate`}
                      type="date"
                    />

                    <FormField
                      label="Place"
                      stepsReference={`outreachSchema[${index}].place`}
                      type="text"
                    />

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeOutreach(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendOutreach({
                      activity: "",
                      role: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      place: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Outreach
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Review and Submit
                </h2>
                <p className="text-gray-600 mb-6">
                  Please review the details below. If everything looks correct,
                  click "Submit" to finalize your submission.
                </p>

                {/* Preview Section */}
                <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow">
                  {/* Current Teaching Experience */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Current Teaching Experience
                    </h3>
                    <table className="table-auto w-full text-left mt-2">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Qualification:
                          </td>
                          <td>{watch("academicSchema.qualification")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Department:
                          </td>
                          <td>{watch("academicSchema.department")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Designation:
                          </td>
                          <td>{watch("academicSchema.designation")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">Level:</td>
                          <td>{watch("academicSchema.level")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Previous Teaching Experience */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Previous Teaching Experience
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("previousTeachingExperienceSchema")?.map(
                        (exp: any, index: any) => (
                          <li key={index}>
                            <strong>Institute:</strong> {exp.instituteName},
                            <strong> From:</strong>{" "}
                            {new Date(exp.fromDate).toLocaleDateString()},
                            <strong> To:</strong>{" "}
                            {new Date(exp.toDate).toLocaleDateString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Industry Teaching Experience
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("teachingExperienceIndustrySchema")?.map(
                        (exp: any, index: any) => (
                          <li key={index}>
                            <strong>Organization:</strong> {exp.organization},
                            <strong> From:</strong>{" "}
                            {new Date(exp.fromDate).toLocaleDateString()},
                            <strong> To:</strong>{" "}
                            {new Date(exp.toDate).toLocaleDateString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Events */}

                  {/* Awards and Recognitions */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Awards
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("awardsSchema")?.map((award: any, index: any) => (
                        <li key={index}>{award.awardRecieved}</li>
                      ))}
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Recognitions
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("recognitionsSchema")?.map(
                        (recognition: any, index: any) => (
                          <li key={index}>{recognition.recognitionRecieved}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Responsibilities
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("responsibilitiesSchema")?.map(
                        (resp: any, index: any) => (
                          <li key={index}>
                            <strong>Responsibility:</strong>{" "}
                            {resp.additionalResponsibilitiesHeld},
                            <strong> Dates:</strong>{" "}
                            {new Date(resp.fromDate).toLocaleDateString()} -{" "}
                            {new Date(resp.toDate).toLocaleDateString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Extracurriculars
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("extracurricularsSchema")?.map(
                        (extra: any, index: any) => (
                          <li key={index}>
                            <strong>Title:</strong> {extra.titleOfEvent},
                            <strong> Organizer:</strong> {extra.organizer},
                            <strong> Dates:</strong>{" "}
                            {new Date(extra.fromDate).toLocaleDateString()} -{" "}
                            {new Date(extra.toDate).toLocaleDateString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Outreach
                    </h3>
                    <ul className="list-disc pl-5">
                      {watch("outreachSchema")?.map((out: any, index: any) => (
                        <li key={index}>
                          <strong>Activity:</strong> {out.activity},
                          <strong> Role:</strong> {out.role},
                          <strong> Dates:</strong>{" "}
                          {new Date(out.fromDate).toLocaleDateString()} -{" "}
                          {new Date(out.toDate).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit(async (data) => {
                      try {
                        // Map form data to API schema
                        const payload = {
                          facultyId: facultyId, // Ensure this is defined and correct
                          academicSchema: data.academicSchema, // Adjust based on form field names
                          previousTeachingExperienceSchema:
                            data.previousTeachingExperienceSchema || [],
                          teachingExperienceIndustrySchema:
                            data.teachingExperienceIndustrySchema || [],
                          awardsSchema: data.awardsSchema || [],
                          recognitionsSchema: data.recognitionsSchema || [],
                          responsibilitiesSchema:
                            data.responsibilitiesSchema || [],
                          extracurricularsSchema:
                            data.extracurricularsSchema || [],
                          outreachSchema: data.outreachSchema || [],
                        };

                        console.log("Payload being sent to API:", payload);

                        const response = await axios.post(
                          "/api/fac_reg_aca",
                          payload
                        );
                        if (response.status === 200) {
                          console.log(response.data);
                          alert("Form submitted successfully!");
                          reset();
                          setCurrentStep(0); // Restart the form
                        }
                      } catch (error) {
                        console.error(error);
                        alert("An error occurred while submitting the form.");
                      }
                    })}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </FormProvider>

        {/* <FormNavigation
        prevButtonFunction={prevButtonFunction}
        steps={steps}
        currentStep={currentStep}
        nextButtonFunction={nextButtonFunction}
      /> */}
      </section>
    </div>
  );
}
