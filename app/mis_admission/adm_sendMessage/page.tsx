"use client";

import { useState } from 'react';
import SearchBar from '../../components/searchbar';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';

const MessageForm = () => {
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phError, setPhError] = useState('');
  const [text, setText] = useState("Dear {#var#} please contact {#var#} Principal, Dr.AIT"); // Default prefixed message

  const [selectedResult, setSelectedResult] = useState<{
    id: number;
    s_name: string;
    usno: string;
    st_email: string;
    st_mobile: string;
    parent_mobile: string;
  } | null>(null);

  // Update `handleSelect` to accept the full object
  const handleSelect = (result: {
    id: number;
    s_name: string;
    usno: string;
    st_email: string;
    st_mobile: string;
    parent_mobile: string;
  }) => {
    setSelectedResult(result); // Store the full object in state
    setTo(result.st_mobile);
  };


  //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setTo(phone);
    setPhError('');
    /* if (!emailRegex.test(phone)) {
      setPhError('Invalid email format');
    } else {
      setPhError('');
    } */
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        if (phError) return; // Prevent submission if email is invalid
        setIsSending(true);

        const prefixedNumbers = to
            .split(",") // Split by commas into an array
            .map((number) => {
            const trimmedNumber = number.trim(); // Remove extra spaces
            return trimmedNumber.startsWith("91") ? trimmedNumber : `91${trimmedNumber}`; // Prefix with '91' if not already prefixed
        })
        .join(","); // Join back into a comma-separated string

        console.log('ph', prefixedNumbers);
    
        const Jsondata = {
        SenderId: "DrAITB",
        ApiKey: process.env.NEXT_PUBLIC_API_KEY,
        ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        Message: text,
        MobileNumbers: prefixedNumbers,   //to.startsWith('91') ? to : `91${to}`,
        };

        try {
            const response = await fetch("/api/send-sms", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(Jsondata),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
            }

            const result = await response.json();
            console.log("SMS Sent Successfully:", result);
            alert("SMS sent successfully!");
        } catch (error) {
            console.error("Error sending SMS:", error);
            alert("Failed to send SMS. Please try again.");
        } finally {
            setIsSending(false); // Reset loading state
        }
    };

    const handleClear = () => {
        setTo('');
        setText('');
        setStatus('');
        setIsSending(false);
        setPhError('');
        setSelectedResult(null);
    };

    const handleMobileSelection = (mobile: string) => {
        setTo(mobile);
      };
 
    return (
    <Layout moduleType="admission"> 
        <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg w-8/12 mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Send Message</h2>
            {/* <SearchBar onSelect={(email) => setTo(email)} onClear={handleClear} /> */}
            <SearchBar onSelect={handleSelect}  onClear={handleClear} />

            {selectedResult && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
            
                    {/* Dropdown for selecting mobile number */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Select Mobile Number
                        </label>
                        <select
                            value={to}
                            onChange={(e) => handleMobileSelection(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        >
                            <option value={selectedResult.st_mobile}>
                                Student Mobile: {selectedResult.st_mobile}
                            </option>
                            <option value={selectedResult.parent_mobile}>
                                 Parent Mobile: {selectedResult.parent_mobile}
                            </option>
                        </select>
                    </div> 
                </div>
             )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="text"
                        value={to}
                        onChange={handlePhoneChange}
                        required
                        className={`w-full p-2 border ${phError ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
                    />
                    {phError && <p className="text-red-500 text-xs mt-1">{phError}</p>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center"
                    disabled={isSending || !!phError} // Disable if sending or email is invalid
                    >
                    {isSending ? 'Sending...' : 'Send Message'}
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200 mt-2"
                    >
                    Clear
                </button>

                {isSending && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                )}
            </form>
            {status && <p className="text-center text-sm text-green-500 mt-4">{status}</p>}
        </div>
    </Layout>  
    );
};

export default MessageForm;
