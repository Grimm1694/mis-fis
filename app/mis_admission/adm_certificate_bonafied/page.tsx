"use client";

import { useState } from "react";
import ScrollToTop from "../../components/ui/scroll_to_top";
import Layout from "../../components/ui/Layout";

const CertificatePage = () => {
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCertificate(true);
  };

  const handlePrint = () => {
    const printContent = document.querySelector(".printable-area");
    const newWindow = window.open("", "", "width=800,height=600");
    if (newWindow && printContent) {
      newWindow.document.write("<html><head><title>Print Certificate</title></head><body>");
      newWindow.document.write(printContent.innerHTML);
      newWindow.document.write("</body></html>");
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    }
  };

  return (
    <Layout moduleType="admission">
      <ScrollToTop />
      <div className="p-8 max-w-2xl mx-auto">
        <style>
          {`
            @media print {
              .no-print {
                display: none;
              }
            }
          `}
        </style>

        <h1 className="text-2xl font-bold mb-6">Bonafide Certificate Generator</h1>

        <form onSubmit={handleGenerateCertificate} className="space-y-4">
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block font-medium">
              Student Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="fatherName" className="block font-medium">
              Father’s Name:
            </label>
            <input
              type="text"
              id="fatherName"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="course" className="block font-medium">
              Course:
            </label>
            <input
              type="text"
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className="block font-medium">
              Academic Year:
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="block font-medium">
              Roll Number:
            </label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block font-medium">
              Purpose:
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Certificate
          </button>
        </form>

        {showCertificate && (
          <div className="printable-area mt-8 p-4 border border-gray-300 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Bonafide Certificate</h2>
            <p>
              This is to certify that <strong>{name}</strong>, son/daughter of{" "}
              <strong>{fatherName}</strong>, is a bonafide student of our
              institution, pursuing the <strong>{course}</strong> course in the
              academic year <strong>{year}</strong>, bearing the roll number{" "}
              <strong>{rollNumber}</strong>.
            </p>
            <p className="mt-4">
              This certificate is issued upon his/her request for the purpose of{" "}
              <strong>{purpose}</strong>.
            </p>
            <p className="mt-8 font-medium">[Signature of the Authorized Person]</p>
            <p>[Seal of the Institution]</p>

            <button
              onClick={handlePrint}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded no-print"
            >
              Print Certificate
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatePage;
