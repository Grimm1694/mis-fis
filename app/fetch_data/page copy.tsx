"use client"

import { useEffect, useState } from 'react';

// Define the type for each item in the fetched data
interface Employee {
  fid: string;
  fname: string;
  pass: string;
  role: string;
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/retrieve_data');
        const result = await res.json();
        setData(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const [faid, setFaid] = useState('');
  const [faname, setFaName] = useState('');
  const [fapass, setFaPass] = useState('');
  const [farole, setFaRole] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send a POST request to the API route with the form data
      const res = await fetch('/api/insert_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faid, faname, fapass, farole }),
      });

      if (res.ok) {
        alert('Data inserted successfully');
        setFaName('');
        setFaid('');
        setFaPass('');
        setFaRole('');
      } else {
        alert('Failed to insert data');
      }
    } catch (error) {
      console.error('Error inserting data', error);
    }
  };

  if (loading) return <p>Loading...</p>; 

  return (
    <div className = "flex flex-col h-screen">
      <div className = "mt-5 ml-10 pb-8">
        <h1>Faculty Login Credentials</h1>
      </div>
      <div className = "flex ml-10">
        <div>
          <table  className="table-auto border-collapse  w-auto h-40 items-center justify-center bg-white border-2  border-gray-700 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-100 h-10 border-b ">
                <th className="text-left py-3 px-4 font-bold text-gray-600">Faculty ID</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Faculty Name</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Password</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Role</th>  
              </tr>
            </thead>
            <tbody>
               {data && data.map((item) => (
                <tr key={item.fid} className="border-b h-10 hover:bg-gray-100" >
                  <td className="py-3 px-4">{item.fid}</td>
                  <td className="py-3 px-4">{item.fname}</td>
                  <td className="py-3 px-4">{item.pass}</td>
                  <td className="py-3 px-4">{item.role}</td>
                </tr> 
              ))} 
            </tbody>
          </table>  
        </div>
        <div className="pl-20">
        <form onSubmit={handleSubmit} className = "justify-center bg-white border-2 shadow-md rounded-lg"> 
          {/* <form className = "justify-center bg-white border-2 shadow-md rounded-lg"> */}
            <div className="mb-4">
              <label htmlFor="faid" className="block pl-5 text-gray-700">FID:</label>
              <input
                id="faid"
                type="text"
                value={faid}
                onChange={(e) => setFaid(e.target.value)}
                className="mt-1 block w-96 p-2 ml-5 mr-5 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="faname" className="block pl-5 text-gray-700">Faculty Name:</label>
              <input
                id="faname"
                type="text"
                value={faname}
                onChange={(e) => setFaName(e.target.value)}
                className="mt-1 block w-96 p-2 ml-5 mr-5 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fapass" className="block ml-5 text-gray-700">Password:</label>
              <input
                id="fapass"
                type="text"
                value={fapass}
                onChange={(e) => setFaPass(e.target.value)}
                className="mt-1 block w-96 p-2 ml-5 mr-5 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="farole" className="block ml-5 text-gray-700">Faculty Role:</label>
              <input
                id="farole"
                type="text"
                value={farole}
                onChange={(e) => setFaRole(e.target.value)}
                className="mt-1 block w-96 p-2 ml-5 mr-5 border border-gray-300"
                required
              />
            </div >
            <div className = " text-left">
              <button
                type="submit"
                className="px-12 py-2 ml-60 mb-5 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>  
        </div>
      </div>
    </div> 
  );
};

export default HomePage;