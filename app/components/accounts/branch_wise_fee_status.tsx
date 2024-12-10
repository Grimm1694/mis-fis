import React, { useState, useMemo } from "react";

interface ReportData {
  branch: string;
  semester: string;
  demandCount: number;
  paidCount: number;
  unpaidCount: number;
  paidPercentage: number;
}

interface StudentCountData {
  branch: string;
  demandCount: number;
  paidCount: number;
  unpaidCount: number;
  paidPercentage: number;
}

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData[];
  grandTotal: { demand: number; paid: number; unpaid: number; paidPercentage: number };
  studentCountReport: StudentCountData[];
  grandStudentCount: { demand: number; paid: number; unpaid: number; paidPercentage: number };
  academicYear: string; // Added prop for academic year
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  reportData,
  grandTotal,
  studentCountReport,
  grandStudentCount,
}) => {
  const [activeReport, setActiveReport] = useState<"branchWise" | "studentCount">("branchWise");

  const formatRupee = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  // Compute branchTotals unconditionally
  const branchTotals = useMemo(() => {
    const totals: Record<
      string,
      { demand: number; paid: number; unpaid: number; paidPercentage: number }
    > = {};
    reportData.forEach((item) => {
      if (!totals[item.branch]) {
        totals[item.branch] = { demand: 0, paid: 0, unpaid: 0, paidPercentage: 0 };
      }
      totals[item.branch].demand += item.demandCount;
      totals[item.branch].paid += item.paidCount;
      totals[item.branch].unpaid += item.unpaidCount;
    });

    for (const branch in totals) {
      const { demand, paid } = totals[branch];
      totals[branch].paidPercentage = demand > 0 ? (paid / demand) * 100 : 0;
    }

    return totals;
  }, [reportData]);

  // Sort the data by branch (alphabetically) and then by semester
  /* const sortedReportData = useMemo(() => {
    const sortedBranches = [...new Set(reportData.map((item) => item.branch))].sort();
    return sortedBranches
      .map((branch) =>
        reportData
          .filter((item) => item.branch === branch)
          .sort((a, b) => a.semester.localeCompare(b.semester))
      )
      .flat();
  }, [reportData]); */

  const sortedReportData = useMemo(() => {
    return reportData
      .sort((a, b) => {
        // First sort by branch alphabetically
        if (a.semester !== b.semester) {
          return a.semester.localeCompare(b.semester);
        }
        // Then sort by semester within each branch
        return a.branch.localeCompare(b.branch);
      });
  }, [reportData]);

  // Sort student count report alphabetically by branch
  const sortedStudentCountReport = useMemo(() => {
    return [...studentCountReport].sort((a, b) => a.branch.localeCompare(b.branch));
  }, [studentCountReport]);

  const handlePrint = () => {
    const academicYear = "2024-25"; // Replace with a dynamic value if needed
    const reportDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const printContent = document.getElementById("modal-print-content");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${activeReport === "branchWise" ? "Branch Wise Report" : "Student Count Report"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: right;
            }
            th {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: center;
              background-color: #f9f9f9;
            }
            .text-left {
              text-align: left;
            }
            .report-info {
              text-align: center;
              margin-bottom: 8px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h2 style="text-align: center;">${
            activeReport === "branchWise" ? "Branch Wise Report" : "Student Count Report"
          }</h2>
          <div class="report-info">
            <p><strong>Academic Year:</strong> ${academicYear}</p>
            <p><strong>Date of Report:</strong> ${reportDate}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] max-w-[800px] p-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Branch & Semester Wise Report</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold hover:underline"
          >
            Close
          </button>
        </div>

        {/* Report Navigation */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveReport("branchWise")}
            className={`px-4 py-2 rounded ${
              activeReport === "branchWise" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Branch Wise Report
          </button>
          <button
            onClick={() => setActiveReport("studentCount")}
            className={`px-4 py-2 rounded ${
              activeReport === "studentCount" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Student Count Report
          </button>
        </div>

        {/* Modal Content */}
        <div
          id="modal-print-content"
          className="overflow-y-auto max-h-[60vh] border-t border-b py-2"
        >
          {/* Branch Wise Report */}
          {activeReport === "branchWise" && (
            <table className="table-auto w-full border border-gray-300 text-sm print:text-xs print:w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-center">Branch</th>
                  <th className="border px-4 py-2 text-center">Semester</th>
                  <th className="border px-4 py-2 text-center">Total Demand</th>
                  <th className="border px-4 py-2 text-center">Total Paid</th>
                  <th className="border px-4 py-2 text-center">To be Collected</th>
                  <th className="border px-4 py-2 text-center">Percentage Paid</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(branchTotals).map((branch) => (
                  <React.Fragment key={branch}>
                    {sortedReportData
                      .filter((item) => item.branch === branch)
                      .map((item, index) => (
                        <tr key={`${branch}-${index}`}>
                          <td className="border px-4 py-2 text-right">{item.branch}</td>
                          <td className="border px-4 py-2 text-right">{item.semester}</td>
                          <td className="border px-4 py-2 text-right">{formatRupee(item.demandCount)}</td>
                          <td className="border px-4 py-2 text-right">{formatRupee(item.paidCount)}</td>
                          <td className="border px-4 py-2 text-right">{formatRupee(item.unpaidCount)}</td>
                          <td className="border px-4 py-2 text-right">{item.paidPercentage.toFixed(2)}%</td>
                        </tr>
                      ))}

                    {/* Branch Total */}
                    <tr className="bg-gray-100 font-bold">
                      <td className="border px-4 py-2 text-right" colSpan={2}>
                        {branch} Total
                      </td>
                      <td className="border px-4 py-2 text-right">{formatRupee(branchTotals[branch].demand)}</td>
                      <td className="border px-4 py-2 text-right">{formatRupee(branchTotals[branch].paid)}</td>
                      <td className="border px-4 py-2 text-right">{formatRupee(branchTotals[branch].unpaid)}</td>
                      <td className="border px-4 py-2 text-right">{branchTotals[branch].paidPercentage.toFixed(2)}%</td>
                    </tr>
                  </React.Fragment>
                ))}

                {/* Grand Total */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border px-4 py-2 text-right" colSpan={2}>
                    Grand Total
                  </td>
                  <td className="border px-4 py-2 text-right">{formatRupee(grandTotal.demand)}</td>
                  <td className="border px-4 py-2 text-right">{formatRupee(grandTotal.paid)}</td>
                  <td className="border px-4 py-2 text-right">{formatRupee(grandTotal.unpaid)}</td>
                  <td className="border px-4 py-2 text-right">{grandTotal.paidPercentage.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Student Count Report */}
          {activeReport === "studentCount" && (
            <table className="table-auto w-full border border-gray-300 text-sm print:text-xs print:w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-center">Branch</th>
                  <th className="border px-4 py-2 text-center">Total Demand</th>
                  <th className="border px-4 py-2 text-center">Total Paid</th>
                  <th className="border px-4 py-2 text-center">To be Collected</th>
                  <th className="border px-4 py-2 text-center">Percentage Paid</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudentCountReport.map((item, index) => (
                  <tr key={`${item.branch}-${index}`}>
                    <td className="border px-4 py-2 text-right">{item.branch}</td>
                    <td className="border px-4 py-2 text-right">{item.demandCount}</td>
                    <td className="border px-4 py-2 text-right">{item.paidCount}</td>
                    <td className="border px-4 py-2 text-right">{item.unpaidCount}</td>
                    <td className="border px-4 py-2 text-right">{item.paidPercentage.toFixed(2)}%</td>
                  </tr>
                ))}

                {/* Grand Total for Student Count */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border px-4 py-2 text-right">Grand Total</td>
                  <td className="border px-4 py-2 text-right">{grandStudentCount.demand}</td>
                  <td className="border px-4 py-2 text-right">{grandStudentCount.paid}</td>
                  <td className="border px-4 py-2 text-right">{grandStudentCount.unpaid}</td>
                  <td className="border px-4 py-2 text-right">{grandStudentCount.paidPercentage.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Print Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
