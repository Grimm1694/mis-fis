import { connectToDatabase } from '../../app/config/dbconfig';
import sql from "mssql";

async function dbQuery(query: string, inputs: Array<{ name: string; type: any; value: any }> = []) {
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
    const method = req.method;

    if (method === "GET") {
      const query = `USE aittest; SELECT * FROM employee_table`;
      const result = await dbQuery(query);
      return res.status(200).json(result.recordset);
    }

    if (method === "POST") {
      const { eid, ename, pass, role, department, designation } = req.body;
      if (!eid || !ename || !pass || !role || !department || !designation) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const query = `USE aittest;
        INSERT INTO employee_table (eid, ename, pass, role, department, designation)
        VALUES (@eid, @ename, @pass, @role, @department, @designation)
      `;

      await dbQuery(query, [
        { name: "eid", type: sql.NVarChar, value: eid },
        { name: "ename", type: sql.NVarChar, value: ename },
        { name: "pass", type: sql.NVarChar, value: pass },
        { name: "role", type: sql.NVarChar, value: role },
        { name: "department", type: sql.NVarChar, value: department },
        { name: "designation", type: sql.NVarChar, value: designation },
      ]);

      return res.status(201).json({ success: true, message: "User added successfully" });
    }

    if (method === "PUT") {
      const { pky, eid, ename, pass, role, department, designation } = req.body;

      if (!pky || !eid || !ename || !pass || !role || !department || !designation) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const query = `USE aittest;
        UPDATE employee_table
        SET eid = @eid, ename = @ename, pass = @pass, role = @role, 
            department = @department, designation = @designation
        WHERE pky = @pky
      `;

      await dbQuery(query, [
        { name: "pky", type: sql.Int, value: pky },
        { name: "eid", type: sql.NVarChar, value: eid },
        { name: "ename", type: sql.NVarChar, value: ename },
        { name: "pass", type: sql.NVarChar, value: pass },
        { name: "role", type: sql.NVarChar, value: role },
        { name: "department", type: sql.NVarChar, value: department },
        { name: "designation", type: sql.NVarChar, value: designation },
      ]);

      return res.status(200).json({ success: true, message: "User updated successfully" });
    }

    if (method === "DELETE") {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: "ID is required" });
      }

      const query = `USE aittest; DELETE FROM employee_table WHERE pky = @id`;

      const result = await dbQuery(query, [{ name: "id", type: sql.Int, value: id }]);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, message: "User deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
