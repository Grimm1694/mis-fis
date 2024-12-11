import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

async function dbQuery(query, inputs = []) {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    inputs.forEach(({ name, type, value }) => {
      request.input(name, type, value);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database query failed");
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { facultyId } = req.body;

      if (!facultyId) {
        return res.status(400).json({ success: false, message: "Faculty ID is required" });
      }

      const query = `
        USE aittest;
        SELECT eid, ename 
        FROM employee_table 
        WHERE eid = @facultyId
      `;
      const inputs = [
        { name: "facultyId", type: sql.VarChar, value: facultyId },
      ];

      const result = await dbQuery(query, inputs);

      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: "Faculty ID not found" });
      }

      const { emp_id, isRegistered } = result.recordset[0];

      return res.status(200).json({ success: true, emp_id, isRegistered });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
