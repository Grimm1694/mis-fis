"use client";

import { useState } from 'react';
import SearchBar from '../../components/searchbar';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';

const EmailForm = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');

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
    setTo(result.st_email);
  };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleFileChange = (e: any) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setTo(email);
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return; // Prevent submission if email is invalid
    setIsSending(true);

    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);
    if (file) formData.append('file', file);

    const res = await fetch('/api/adm_sendEmail', { method: 'POST', body: formData });
    setStatus(res.ok ? 'Email sent successfully!' : 'Failed to send email.');
    setIsSending(false);
  };

  const handleClear = () => {
    setTo('');
    setSubject('');
    setText('');
    setFile(null);
    setStatus('');
    setIsSending(false);
    setEmailError('');
  };
 
  return (
   <Layout moduleType="admission"> 
    <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg w-1/2 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Send Email</h2>
      <SearchBar onSelect={handleSelect}  onClear={handleClear} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="email"
            value={to}
            onChange={handleEmailChange}
            required
            className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
          />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Attachment</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center"
          disabled={isSending || !!emailError} // Disable if sending or email is invalid
        >
          {isSending ? 'Sending...' : 'Send Email'}
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

export default EmailForm;
