"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { facultyPersonalDetailsSchema } from "../../../schemas/personal-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import FormProgress from "../../components/FormProgress";
// import FormNavigation from "../../components/FormNavigation";
import FormField from "../../../components/FormField";
import { Step } from "../../../types/form";
import { FormProvider } from "../../../hooks/FormProvider";
// import Header from "../../components/ui/header copy";
// import { NavLinks } from "@/components/ui/nav-links";
import { useRouter, useSearchParams } from "next/navigation";
// import ProfilePhotoInput from "@/components/image";
import axios from "axios";
type Inputs = z.infer<typeof facultyPersonalDetailsSchema>;
const steps: Step[] = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: [
      "personalSchema.qualification",
      "personalSchema.prefix",
      "personalSchema.firstName",
      "personalSchema.lastName",
      "personalSchema.emailId",
      "personalSchema.contactNo",
      "personalSchema.alternateContactNo",
      "personalSchema.emergencyContactNo",
      "personalSchema.aadhar",
      "personalSchema.pan",
      "personalSchema.dob",
      "personalSchema.gender",
      "personalSchema.nationality",
      "personalSchema.firstAddressLine2",
      "personalSchema.firstAddressLine1",
      "personalSchema.firstAddressLine3",
      "personalSchema.correspondenceAddressLine1",
      "personalSchema.correspondenceAddressLine2",
      "personalSchema.correspondenceAddressLine3",
      "personalSchema.religion",
      "personalSchema.caste",
      "personalSchema.category",
      "personalSchema.motherTongue",
      "personalSchema.speciallyChanged",
      "personalSchema.speciallyChangedRemarks",
      "personalSchema.languagesToSpeak",
      "personalSchema.languagesToRead",
      "personalSchema.languagesToWrite",
      "personalSchema.department",
      "personalSchema.designation",
      "personalSchema.aided",
      "personalSchema.dateOfJoiningDrait",
      "financialSchema.bankName",
      "financialSchema.accountNo",
      "financialSchema.accountName",
      "financialSchema.typeOfAccount",
      "financialSchema.branch",
      "financialSchema.ifscCode",
      "financialSchema.pfNumber",
      "financialSchema.uanNumber",
      "financialSchema.pensionNumber",
      "educationSchema",
      "dependentsSchema.motherName",
      "dependentsSchema.fatherName",
      "dependentsSchema.spouseName",
      "dependentsSchema.children",
    ],
  },
  {
    id: "Step 2",
    name: " Preview and Complete",
    fields: [],
  },
];

const languagesOptions = [
  "English",
  "Hindi",
  "Kannada",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [facultyId, setFacultyId] = useState("");
  const delta = currentStep - previousStep;
  const router = useRouter();
  const searchParams = useSearchParams();
  const departments = [
    { code: 'EI', title: 'Electronics and Instrumentation Engineering' },
    { code: 'AE', title: 'Aeronautical Engineering' },
    { code: 'ME', title: 'Mechanical Engineering' },
    { code: 'EE', title: 'Electrical Engineering' },
    { code: 'EC', title: 'Electronics and Communication Engineering' },
    { code: 'CV', title: 'Civil Engineering' },
    { code: 'CS', title: 'Computer Science and Engineering' },
    { code: 'AI', title: 'Artificial Intelligence and Machine Learning' },
    { code: 'CB', title: 'Computer Science and Business System' },
    { code: 'ET', title: 'Electronics and Telecommunication Engineering' },
    { code: 'IM', title: 'Industrial Engineering and Management' },
    { code: 'IS', title: 'Information Science and Engineering' }
  ];
  const designations = [
    'Professor',
    'Assistant Professor',
    'Associate Professor',
    'Lecturer'
  ];
  
  const aidedOptions = ['Yes', 'No'];
  // Extract facultyId from URL using query string
  useEffect(() => {
    const pathname = window.location.pathname; // Get the full path
    const segments = pathname.split("/"); // Split path into segments
    const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)
    console.log(idFromPath,"idFromPath");
    if (idFromPath) {
        setFacultyId(idFromPath);
    } else {
        console.warn("Faculty ID is not present in the dynamic route.");
    }
    }, []);

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
    resolver: zodResolver(facultyPersonalDetailsSchema),
  });
  const [isSameAddress, setIsSameAddress] = useState(false);
  const firstAddressLine1 = watch("personalSchema.firstAddressLine1");
  const firstAddressLine2 = watch("personalSchema.firstAddressLine2");
  const firstAddressLine3 = watch("personalSchema.firstAddressLine3");
  const handleCheckboxChange = (e: any) => {
    setIsSameAddress(e.target.checked);
    if (!e.target.checked) {
      // Clear correspondence address fields when unchecked
      setValue("personalSchema.correspondenceAddressLine1", "");
      setValue("personalSchema.correspondenceAddressLine2", "");
      setValue("personalSchema.correspondenceAddressLine3", "");
    }
  };
  // Sync correspondence address fields if checkbox is checked
  useEffect(() => {
    if (isSameAddress) {
      setValue("personalSchema.correspondenceAddressLine1", firstAddressLine1);
      setValue("personalSchema.correspondenceAddressLine2", firstAddressLine2);
      setValue("personalSchema.correspondenceAddressLine3", firstAddressLine3);
    }
  }, [isSameAddress, firstAddressLine1, firstAddressLine2, firstAddressLine3]);

  // Initialize useFieldArray for children

  // Initialize useFieldArray for education details
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "educationSchema",
  });

  // const id = sessionStorage.getItem("emp_id");
//   const facultyId = "1234";
  // console.log(facultyId);
  //   useEffect(() => {

  //     if (!facultyId) {
  //       alert("Faculty ID is missing. Redirecting...");
  //       router.push("/"); // Redirect to the dashboard or relevant page
  //     }
  //   }, [facultyId, router]);

  const processForm: SubmitHandler<Inputs> = async (data) => {
    console.log("Form data:", data);

    try {
      // Send the schema data directly without nesting under combinedData
      const response = await axios.post("/api/fac_reg_per", {
        facultyId: facultyId,
        personalSchema: data.personalSchema,
        financialSchema: data.financialSchema,
        educationSchema: data.educationSchema,
        dependentsSchema: data.dependentsSchema,
      });

      if (response.data.success) {
        console.log("Data saved successfully:", response.data);
        // Add your success handling here (e.g., showing a success message, redirecting)
      } else {
        console.error("Server returned error:", response.data.error);
        // Add your error handling here (e.g., showing an error message)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        // Add your error handling here (e.g., showing the specific error message)
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };


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
        <div className="mt-6 flex justify-end">
  <button
    type="button"
    onClick={handleSubmit(async (data) => {
      console.log("Submit handler invoked", data);
      console.log("Faculty ID:", facultyId);
    })}
    className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700"
  >
    Submit
  </button>
</div>
        <FormProvider register={register} errors={errors}>
          <form onSubmit={handleSubmit(processForm)} className="mt-12 py-12">
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[-80px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* <ProfilePhotoInput className="col-span-2" /> */}

                 
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                    <div className="col-span-1">
                      <label
                        htmlFor="prefix"
                        className="block  text-sm font-medium text-gray-700"
                      >
                        Prefix
                      </label>
                      <select
                        id="prefix"
                        {...register("personalSchema.prefix")}
                        className="mt-1 w-full block p-1 py-2 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Ms</option>
                        <option>Dr</option>
                      </select>
                    </div>

                    <div className="col-span-5">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        {...register("personalSchema.firstName")}
                        className="mt-1 block w-full p-1 py-1.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      />
                      {errors.personalSchema?.firstName && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.personalSchema.firstName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <FormField
                    label="Last Name"
                    stepsReference="personalSchema.lastName"
                    type="text"
                  />

                  <FormField
                    label="Email ID"
                    stepsReference="personalSchema.emailId"
                    type="email"
                  />

                  <FormField
                    label="Contact Number"
                    stepsReference="personalSchema.contactNo"
                    type="tel"
                  />

                  <FormField
                    label="Alternate Contact Number"
                    stepsReference="personalSchema.alternateContactNo"
                    type="tel"
                  />

                  <FormField
                    label="Emergency Contact Number"
                    stepsReference="personalSchema.emergencyContactNo"
                    type="tel"
                  />

                  <FormField
                    label="Aadhar Number"
                    stepsReference="personalSchema.aadhar"
                    type="text"
                  />

                  <FormField
                    label="PAN Number"
                    stepsReference="personalSchema.pan"
                    type="text"
                  />

                  <FormField
                    label="Date of Birth"
                    stepsReference="personalSchema.dob"
                    type="date"
                  />

                    <div>
                      <label
                        htmlFor="qualification"
                        className="block text-sm font-medium text-gray-700"
                      >
                       Highest Qualification
                      </label>
                      <select
                        id="qualification"
                        {...register("personalSchema.qualification")}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="B.E.">B.E.</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="M.Tech.">M.Tech.</option>
                        <option value="B.Tech.">B.Tech.</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="Ph.D">Ph.D</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="BBA">BBA</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Com">B.Com</option>
                        <option value="M.Com">M.Com</option>
                        <option value="B.A.">B.A.</option>
                        <option value="M.A.">M.A.</option>
                        <option value="B.Ed.">B.Ed.</option>
                        <option value="M.Ed.">M.Ed.</option>
                        <option value="D.Ed.">D.Ed.</option>
                      </select>
                      {errors.personalSchema?.qualification && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.personalSchema.qualification.message}
                        </p>
                      )}
                    </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...register("personalSchema.gender")}
                      className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    {errors.personalSchema?.gender && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.gender.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    label="Nationality"
                    stepsReference="personalSchema.nationality"
                    type="text"
                  />
                </div>
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            id="department"
            {...register("personalSchema.department")}
            className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.title}
              </option>
            ))}
          </select>
          {errors.personalSchema?.department && (
            <p className="mt-2 text-sm text-red-600">
              {errors.personalSchema.department.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700"
          >
            Designation
            </label>
          <select
            id="designation"
            {...register("personalSchema.designation")}
            className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
          {errors.personalSchema?.designation && (
            <p className="mt-2 text-sm text-red-600">
              {errors.personalSchema.designation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="aided"
            className="block text-sm font-medium text-gray-700"
          >
            Aided
          </label>
          <select
            id="aided"
            {...register("personalSchema.aided")}
            className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
          ><option value="">Select Aided</option>
          {aidedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.personalSchema?.aided && (
          <p className="mt-2 text-sm text-red-600">
            {errors.personalSchema.aided.message}
          </p>
        )}
      </div>
      <FormField label="Date of Joining DRAIT" stepsReference="personalSchema.dateOfJoiningDrait" type="date" />
      
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[10px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Address
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="First Address Line 1"
                    stepsReference="personalSchema.firstAddressLine1"
                    type="text"
                  />

                  <FormField
                    label="First Address Line 2"
                    stepsReference="personalSchema.firstAddressLine2"
                    type="text"
                  />

                  <FormField
                    label="First Address Line 3"
                    stepsReference="personalSchema.firstAddressLine3"
                    type="text"
                  />

                  {/* Checkbox for Same Address */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSameAddress}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Same as First Address
                    </label>
                  </div>

                  <FormField
                    label="Correspondence Address Line 1"
                    stepsReference="personalSchema.correspondenceAddressLine1"
                    type="text"
                    disabled={isSameAddress}
                  />

                  <FormField
                    label="Correspondence Address Line 2"
                    stepsReference="personalSchema.correspondenceAddressLine2"
                    type="text"
                    disabled={isSameAddress}
                  />

                  <FormField
                    label="Correspondence Address Line 3"
                    stepsReference="personalSchema.correspondenceAddressLine3"
                    type="text"
                    disabled={isSameAddress}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[10px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Other Details
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Religion Dropdown */}
                  <div>
                    <label
                      htmlFor="religion"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Religion
                    </label>
                    <select
                      id="religion"
                      {...register("personalSchema.religion")}
                      className="mt-1 block w-full p-2 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option value="">Select Religion</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Christian">Christian</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.personalSchema?.religion && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.religion.message}
                      </p>
                    )}
                  </div>

                  {/* Caste Dropdown */}
                  <div>
                    <label
                      htmlFor="caste"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Caste
                    </label>
                    <select
                      id="caste"
                      {...register("personalSchema.caste")}
                      className="mt-1 block w-full p-2 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option value="">Select Caste</option>
                      <option value="Brahmins">Brahmins</option>
                      <option value="Thakur">Thakur</option>
                      <option value="Vaishya">Vaishya</option>
                      <option value="Tyagi">Tyagi</option>
                      <option value="Bhumihar">Bhumihar</option>
                      <option value="Muslims">Muslims</option>
                      <option value="Christians">Christians</option>
                      <option value="Rajput">Rajput</option>
                      <option value="Kayastha">Kayastha</option>
                      <option value="Pathans">Pathans</option>
                      <option value="Muslim Mughals">Muslim Mughals</option>
                      <option value="Muslim Shaikh">Muslim Shaikh</option>
                      <option value="Muslim Sayyad">Muslim Sayyad</option>
                      <option value="Jat Sikh">Jat Sikh</option>
                      <option value="Bania">Bania</option>
                      <option value="Punjabi Khatri">Punjabi Khatri</option>
                      <option value="Punjabi Arora">Punjabi Arora</option>
                      <option value="Punjabi Sood">Punjabi Sood</option>
                      <option value="Baidya">Baidya</option>
                      <option value="Patidar">Patidar</option>
                      <option value="Patel">Patel</option>
                      <option value="Kshatriya">Kshatriya</option>
                      <option value="Reddy">Reddy</option>
                      <option value="Kamma">Kamma</option>
                      <option value="Kapu">Kapu</option>
                      <option value="Gomati Baniya">Gomati Baniya</option>
                      <option value="Velamma">Velamma</option>
                      <option value="Kshatriya Raju">Kshatriya Raju</option>
                      <option value="Iyengar">Iyengar</option>
                      <option value="Iyer">Iyer</option>
                      <option value="Vellalars">Vellalars</option>
                      <option value="Nair">Nair</option>
                      <option value="Naidu">Naidu</option>
                      <option value="Mukkulathor">Mukkulathor</option>
                      <option value="Sengunthar">Sengunthar</option>
                      <option value="Parkavakulam">Parkavakulam</option>
                      <option value="Nagarathar Baniya">
                        Nagarathar Baniya
                      </option>
                      <option value="Komati">Komati</option>
                      <option value="Vokkaligas">Vokkaligas</option>
                      <option value="Lingayats">Lingayats</option>
                      <option value="Bunts">Bunts</option>
                    </select>
                    {errors.personalSchema?.caste && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.caste.message}
                      </p>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      {...register("personalSchema.category")}
                      className="mt-1 block w-full p-2 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                    {errors.personalSchema?.category && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.category.message}
                      </p>
                    )}
                  </div>

                  {/* Mother Tongue Dropdown */}
                  <div>
                    <label
                      htmlFor="motherTongue"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mother Tongue
                    </label>
                    <select
                      id="motherTongue"
                      {...register("personalSchema.motherTongue")}
                      className="mt-1 block w-full p-2 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option value="">Select Mother Tongue</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.personalSchema?.motherTongue && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.motherTongue.message}
                      </p>
                    )}
                  </div>

                  {/* Specially Challenged Checkbox */}
                  <div>
                    <label
                      htmlFor="speciallyChanged"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Specially Challenged
                    </label>
                    <input
                      type="checkbox"
                      id="speciallyChanged"
                      {...register("personalSchema.speciallyChanged")}
                      className="mt-1"
                    />
                    {errors.personalSchema?.speciallyChanged && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.speciallyChanged.message}
                      </p>
                    )}
                    <label
                      htmlFor="speciallyChangedRemarks"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Specially Challenged Remarks
                    </label>
                    <input
                      type="text"
                      id="speciallyChangedRemarks"
                      {...register("personalSchema.speciallyChangedRemarks")}
                      className="mt-1 block w-full p-1 py-1.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    />
                    {errors.personalSchema?.speciallyChangedRemarks && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.speciallyChangedRemarks.message}
                      </p>
                    )}
                  </div>

                  <div></div>

                  {/* Languages to Speak (Multiselect Checkboxes) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Languages to Speak
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {languagesOptions.map((language) => (
                        <div key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`languagesToSpeak_${language}`}
                            value={language}
                            {...register("personalSchema.languagesToSpeak")}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`languagesToSpeak_${language}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.personalSchema?.languagesToSpeak && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.languagesToSpeak.message}
                      </p>
                    )}
                  </div>

                  {/* Languages to Read (Multiselect Checkboxes) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Languages to Read
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {languagesOptions.map((language) => (
                        <div key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`languagesToRead_${language}`}
                            value={language}
                            {...register("personalSchema.languagesToRead")}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`languagesToRead_${language}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.personalSchema?.languagesToRead && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.languagesToRead.message}
                      </p>
                    )}
                  </div>

                  {/* Languages to Write (Multiselect Checkboxes) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Languages to Write
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {languagesOptions.map((language) => (
                        <div key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`languagesToWrite_${language}`}
                            value={language}
                            {...register("personalSchema.languagesToWrite")}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`languagesToWrite_${language}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.personalSchema?.languagesToWrite && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.personalSchema.languagesToWrite.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[10px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Financial Details
                </h2>

                {/* Financial Details Form Fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="Bank Name"
                    stepsReference="financialSchema.bankName"
                    type="text"
                  />

                  <FormField
                    label="Account Number"
                    stepsReference="financialSchema.accountNo"
                    type="text"
                  />

                  <FormField
                    label="Account Name"
                    stepsReference="financialSchema.accountName"
                    type="text"
                  />

                  <div>
                    <label
                      htmlFor="typeOfAccount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type of Account
                    </label>
                    <select
                      id="typeOfAccount"
                      {...register("financialSchema.typeOfAccount")}
                      className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                    >
                      <option>Savings</option>
                      <option>Current</option>
                    </select>
                    {errors.financialSchema?.typeOfAccount && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.financialSchema.typeOfAccount.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    label="Branch"
                    stepsReference="financialSchema.branch"
                    type="text"
                  />

                  <FormField
                    label="IFSC Code"
                    stepsReference="financialSchema.ifscCode"
                    type="text"
                  />

                  <FormField
                    label="PF Number"
                    stepsReference="financialSchema.pfNumber"
                    type="text"
                  />

                  <FormField
                    label="UAN Number"
                    stepsReference="financialSchema.uanNumber"
                    type="text"
                  />

                  <FormField
                    label="Pension Number"
                    stepsReference="financialSchema.pensionNumber"
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
                className="space-y-6 mt-[10px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Education Details
                </h2>

                {/* Education Details Form Fields */}
                {educationFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <div>
                      <label
                        htmlFor={`educationSchema.${index}.class`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Program (Class)
                      </label>
                      <select
                        id={`educationSchema.${index}.class`}
                        {...register(`educationSchema.${index}.class`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="B.E.">B.E.</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="M.Tech.">M.Tech.</option>
                        <option value="B.Tech.">B.Tech.</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="Ph.D">Ph.D</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="BBA">BBA</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Com">B.Com</option>
                        <option value="M.Com">M.Com</option>
                        <option value="B.A.">B.A.</option>
                        <option value="M.A.">M.A.</option>
                        <option value="B.Ed.">B.Ed.</option>
                        <option value="M.Ed.">M.Ed.</option>
                        <option value="D.Ed.">D.Ed.</option>
                      </select>
                      {errors.educationSchema?.[index]?.class && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.educationSchema[index]?.class?.message}
                        </p>
                      )}
                    </div>


                    <FormField
                      label="USN"
                      stepsReference={`educationSchema.${index}.usn`}
                      type="text"
                    />

                    <FormField
                      label="Institution"
                      stepsReference={`educationSchema.${index}.institution`}
                      type="text"
                    />

                    <FormField
                      label="Specialization"
                      stepsReference={`educationSchema.${index}.specialization`}
                      type="text"
                    />

                    <FormField
                      label="Medium of Instruction"
                      stepsReference={`educationSchema.${index}.mediumOfInstruction`}
                      type="text"
                    />

                    {/* Direct Correspondence Dropdown */}
                    <div>
                      <label
                        htmlFor="directCorr"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Direct/Correspondence
                      </label>
                      <select
                        id="directCorr"
                        {...register(`educationSchema.${index}.directCorr`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Direct">Direct</option>
                        <option value="Correspondence">Correspondence</option>
                      </select>
                      {errors.educationSchema?.[index]?.directCorr && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.educationSchema[index].directCorr.message}
                        </p>
                      )}
                    </div>
                    <FormField
                      label="Passing Year"
                      stepsReference={`educationSchema.${index}.PassingYear`}
                      type="number"
                    />
                    {/* Pass Class Dropdown */}
                    <div>
                      <label
                        htmlFor="passClass"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Pass Class
                      </label>
                      <select
                        id="passClass"
                        {...register(`educationSchema.${index}.passClass`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Distinction">Distinction</option>
                        <option value="First">First</option>
                        <option value="Second">Second</option>
                        <option value="Third">Third</option>
                        <option value="Fail">Fail</option>
                      </select>
                      {errors.educationSchema?.[index]?.passClass && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.educationSchema[index].passClass.message}
                        </p>
                      )}
                    </div>

                    {/* Remove Education Button */}
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 text-sm"
                      >
                        Remove Education
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Education Button */}
                <button
                  type="button"
                  onClick={() =>
                    appendEducation({
                      class: "",
                      usn: "",
                      institution: "",
                      specialization: "",
                      mediumOfInstruction: "",
                      directCorr: "Direct",
                      passClass: "First",
                      PassingYear: "",
                    })
                  }
                  className="text-indigo-600 text-sm"
                >
                  + Add Education
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[10px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Dependents
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="Mother Name"
                    stepsReference="dependentsSchema.motherName"
                    type="text"
                  />

                  <FormField
                    label="Father Name"
                    stepsReference="dependentsSchema.fatherName"
                    type="text"
                  />

                  <FormField
                    label="Spouse Name"
                    stepsReference="dependentsSchema.spouseName"
                    type="text"
                  />

                  {/* Children */}
                  <FormField
                    label="Number of Children"
                    stepsReference="dependentsSchema.children"
                    type="number"
                  />
                </div>
              </motion.div>
            )}
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[10px] mb-[10px]"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Review and Submit
                </h2>
                <p className="text-gray-600 mb-6">
                  Please review your details below. Click "Submit" to finalize
                  your submission.
                </p>

                {/* Preview Section */}
                <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <table className="table-auto w-full text-left mt-2">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Qualification:
                          </td>
                          <td>{watch("personalSchema.qualification")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Full Name:
                          </td>
                          <td>{`${watch("personalSchema.firstName")} ${watch(
                            "personalSchema.lastName"
                          )}`}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Email ID:
                          </td>
                          <td>{watch("personalSchema.emailId")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Contact Number:
                          </td>
                          <td>{watch("personalSchema.contactNo")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Alternate Contact Number:
                          </td>
                          <td>{watch("personalSchema.alternateContactNo")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Emergency Contact Number:
                          </td>
                          <td>{watch("personalSchema.emergencyContactNo")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Date of Birth:
                          </td>
                          <td>
                            {watch("personalSchema.dob")
                              ? new Date(
                                  watch("personalSchema.dob")
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">Gender:</td>
                          <td>{watch("personalSchema.gender")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Aadhar Number:
                          </td>
                          <td>{watch("personalSchema.aadhar")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            PAN Number:
                          </td>
                          <td>{watch("personalSchema.pan")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Nationality:
                          </td>
                          <td>{watch("personalSchema.nationality")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Religion:
                          </td>
                          <td>{watch("personalSchema.religion")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">Caste:</td>
                          <td>{watch("personalSchema.caste")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Category:
                          </td>
                          <td>{watch("personalSchema.category")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Mother Tongue:
                          </td>
                          <td>{watch("personalSchema.motherTongue")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Specially Challenged:
                          </td>
                          <td>
                            {watch("personalSchema.speciallyChanged")
                              ? "Yes"
                              : "No"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Specially Challenged Remarks:
                          </td>
                          <td>
                            {watch("personalSchema.speciallyChangedRemarks")}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Languages to Speak:
                          </td>
                          <td>
                            {Array.isArray(
                              watch("personalSchema.languagesToSpeak")
                            )
                              ? watch("personalSchema.languagesToSpeak").join(
                                  ", "
                                )
                              : "No languages selected"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Languages to Read:
                          </td>
                          <td>
                            {Array.isArray(
                              watch("personalSchema.languagesToRead")
                            )
                              ? watch("personalSchema.languagesToRead").join(
                                  ", "
                                )
                              : "No languages selected"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Languages to Write:
                          </td>
                          <td>
                            {Array.isArray(
                              watch("personalSchema.languagesToWrite")
                            )
                              ? watch("personalSchema.languagesToWrite").join(
                                  ", "
                                )
                              : "No languages selected"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Address
                    </h3>
                    <table className="table-auto w-full text-left mt-2">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700">
                            First Address:
                          </td>
                          <td>{`${watch(
                            "personalSchema.firstAddressLine1"
                          )}, ${watch(
                            "personalSchema.firstAddressLine2"
                          )}, ${watch(
                            "personalSchema.firstAddressLine3"
                          )}`}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Correspondence Address:
                          </td>
                          <td>{`${watch(
                            "personalSchema.correspondenceAddressLine1"
                          )}, ${watch(
                            "personalSchema.correspondenceAddressLine2"
                          )}, ${watch(
                            "personalSchema.correspondenceAddressLine3"
                          )}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Financial Details
                    </h3>
                    <table className="table-auto w-full text-left mt-2">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Bank Name:
                          </td>
                          <td>{watch("financialSchema.bankName")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Account Number:
                          </td>
                          <td>{watch("financialSchema.accountNo")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            IFSC Code:
                          </td>
                          <td>{watch("financialSchema.ifscCode")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Dependents */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Dependents
                    </h3>
                    <table className="table-auto w-full text-left mt-2">
                      <tbody>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Mother's Name:
                          </td>
                          <td>{watch("dependentsSchema.motherName")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Father's Name:
                          </td>
                          <td>{watch("dependentsSchema.fatherName")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Spouse's Name:
                          </td>
                          <td>{watch("dependentsSchema.spouseName")}</td>
                        </tr>
                        <tr>
                          <td className="font-medium text-gray-700">
                            Number of Children:
                          </td>
                          <td>{watch("dependentsSchema.children")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Education Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Education Details
                    </h3>
                    <table className="table-auto w-full  mt-2">
                      <thead>
                        <tr>
                          <th className="font-medium text-gray-700">Program</th>
                          <th className="font-medium text-gray-700">USN</th>
                          <th className="font-medium text-gray-700">
                            Institution
                          </th>
                          <th className="font-medium text-gray-700">
                            Specialization
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {watch("educationSchema")?.map((edu, index) => (
                          <tr key={index}>
                            <td>{edu.class}</td>
                            <td>{edu.usn}</td>
                            <td>{edu.institution}</td>
                            <td>{edu.specialization}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
  <button
    type="button"
    onClick={handleSubmit(async (data) => {
      console.log("Submit handler invoked with data:", data);

      if (!facultyId) {
        alert("Faculty ID is missing.");
        return;
      }

      const requestBody = {
        personalSchema: data.personalSchema,
        financialSchema: data.financialSchema,
        educationSchema: data.educationSchema,
        dependentsSchema: data.dependentsSchema,
        facultyId: facultyId,
      };

      console.log("Request body:", requestBody);

      try {
        const response = await fetch("/api/fac_reg_per", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const responseData = await response.json();
          console.log("Response data:", responseData);

          if (responseData.success) {
            alert("Form submitted successfully!");
            router.push(`/faculty/faculty_reg/academic/${facultyId}`);
            reset();
          } else {
            alert("Error submitting form: " + responseData.message);
          }
        } else {
          alert("Failed to submit form. Please try again.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred. Please try again.");
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
      </section>
    </div>
  );
}
