"use client";

import React, { useState } from "react";

const SendSMS = () => {
  const [isSending, setIsSending] = useState(false);
  
  /* const formatPhoneNumber = (phone: string): string => {
    // Ensure the phone number starts with 91, avoid duplication
    return phone.startsWith("91") ? phone : `91${phone}`;
  }; */

  
  //const formattedNumber = formatPhoneNumber(phone);

  const handleSubmit = async () => {
    setIsSending(true); // Show loading state
    const Jsondata = {
      SenderId: "DrAITB",
      ApiKey: process.env.NEXT_PUBLIC_API_KEY,
      ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      Message: "Dear {#var#} please contact {#var#} Principal, Dr.AIT",
      MobileNumbers: "919449679652",
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

  

 
   return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Send SMS</h1>
      <button
        onClick={handleSubmit}
        disabled={isSending}
        className={`py-2 px-4 rounded ${
          isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"
        }`}
      >
        {isSending ? "Sending..." : "Send SMS"}
      </button>
    </div>
  ); 

  

}; 

export default SendSMS;
