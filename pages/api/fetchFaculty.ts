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
            const query = `USE aittest; 
            SELECT employee_id, faculty_name, department, qualification, contactNo, title FROM facultyPersonalDetails`;
            const result = await dbQuery(query);
            return res.status(200).json(result.recordset);
        }

        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
