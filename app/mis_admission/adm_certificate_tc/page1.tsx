'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, PDFViewer, Image } from '@react-pdf/renderer';

// Register the custom font
Font.register({
  family: 'tunga',
  src: '/fonts/tunga-regular-unicode-kannada-font.ttf', // Path to the Kannada font
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'tunga', // Use the Kannada font
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Adjust for spacing
  },
  logo: {
    width: 40, // Adjust the size as per the logo's aspect ratio
    height: 'auto',
  },
  instituteName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 1,
  },
  instituteType: {
    fontSize: 12,
    fontWeight: 'light',
    marginTop: -15,
    textAlign: 'center',
  },
  instituteAddress: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -8,
    textAlign: 'center',
  },
  TCHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -12,
    marginBottom: 0,
  },
  ADMContainer: {
    marginTop: -12,
    flexDirection: 'row', // Arrange elements in a row
    justifyContent: 'space-between', // Space out elements
    marginBottom: 1, // Add spacing below
  },
  ADMBookNo: {
    fontSize: 12, // Adjust font size as needed
    marginBottom: 5, // Adjust spacing between text
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 1,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellslno: {
    padding: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    width: '5%',
    fontSize: 12,
    textAlign: 'center',
  },
  tableCell: {
    padding: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    width: '50%',
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  tableText: {
    textAlign: 'left',
    paddingLeft: 5,
    fontSize: 12,
  },
  Place: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 0,
  },
});

const getCurrentDate = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('en-IN', options); // Adjust locale if needed
};

// Table data
const tableData = [
  ['Name of Student / ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು  ', 'John Doe'],
  ['Name of Father / Mother / Gardian\n ತಂದೆ / ತಾಯಿಯ / ಪೋಷಕರ ಹೆಸರು   ', 'Doe Sr.'],
  ['Gender / ಲಿಂಗ', 'Male'],
  ['Date of Birth / ಜನ್ಮ ದಿನಾಂಕ ', '01/01/2000'],
  ['Caste / ಜಾತಿ', 'General'],
  ['Category / ವರ್ಗ', 'Category 1'],
  ['Nationality / ರಾಷ್ಟ್ರೀಯತೆ   ', 'Indian'],  
  ['Admission Date / ಪ್ರವೇಶ ದಿನಾಂಕ   ', '01/06/2021'],
  ['Date of Leaving / ಸಂಸ್ಥೆಯನ್ನು ಬಿಟ್ಟ ದಿನಾಂಕ  ', 'N/A'],
  ['Programme Studied / ಓದುತಿದ್ದ ವಿಭಾಗ   ', 'Engineering'],
  ['USNO / ನೋಂದಣಿ ಸಂಖ್ಯೆ', '123456'],
  ['Class Studying / ಓದುತಿದ್ದ ತರಗತಿ   ', 'Semester 5'],
  ['Whether Qualified for promotion to the Next higher Class\n ಮೇಲಿನ ತರಗತಿಗೆ ಭಡ್ತಿ ಪಡೆಯಲು ಅರ್ಹರೇ?  ', 'Yes'],
  ['Conduct & Character / ವಿದ್ಯಾರ್ಥಿಯ ಗುಣ ಮತ್ತು ನಡೆತೆ   ', 'Excellent'],
  ['Shara / ಷರಾ', 'N/A'],
];

// MyDocument component
const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      {/* Logo and Institute Name Section */}
      <View style={styles.logoContainer}>
        {/* Logo */}
        <Image
          style={styles.logo}
          src="/image/DrAIT_logo.png" // Adjust the path to your logo image
        />
        {/* Institute Name */}
        <Text style={styles.instituteName}>Dr Ambedkar Institute of Technology</Text>
        {/* Institute Type */}
        <Text style={styles.instituteType}>(An Autonomous Instition Aided by Govt. of Karnataka and affiliated to Visveswaraya Technological University, Belagavi)</Text>
        {/* Institute Address */}
        <Text style={styles.instituteAddress}>Next to IIPM, Mallathahalli,BDA Outer Ring Road, Bengaluru - 560056</Text>
        {/* TC heading */}
        <Text style={styles.TCHeading}>ವರ್ಗಾವಣೆ ಪ್ರಮಾಣ ಪತ್ರ / Transfer Certificate </Text>
      </View>
      <View style={styles.ADMContainer}>
        <Text style={styles.ADMBookNo}>ಪ್ರವೇಶ ಪುಸ್ತಕ ಕ್ರಮಾಂಕ /Admission Book No:___________________ </Text>
        <Text style={styles.ADMBookNo}>ಕ್ರಮಾಂಕ /Sl No:___________________ </Text>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        {/* Table Header */}
        {/* <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>English</Text>
          <Text style={styles.tableCell}>Kannada</Text>
        </View> */}
        
        {/* Table Data */}
        {tableData.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCellslno}>{index+1}</Text>
            <Text style={styles.tableCell}>{row[0]}</Text>
            <Text style={styles.tableCell}>{row[1]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.Place}>
        <Text style={styles.Place}>Place: Bengaluru </Text>
      </View>
      <View style={styles.ADMContainer}>
        <Text style={styles.ADMBookNo}>Date: {getCurrentDate()}</Text>
        <Text style={styles.ADMBookNo}>Principal </Text>
      </View>
    </Page>
  </Document>
);

const VTUusnoUpdate = () => {
  const [preview, setPreview] = useState(false);  // State to toggle preview

  return (
    <div className="ml-2">
      {/* Button to toggle PDF preview */}
      <button 
        onClick={() => setPreview(!preview)} 
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        {preview ? 'Hide Preview' : 'Preview PDF'}
      </button>

      {/* Conditional rendering for PDF preview */}
      {preview ? (
        <PDFViewer width="100%" height="600">
          <MyDocument />
        </PDFViewer>
      ) : (
        <PDFDownloadLink
          document={<MyDocument />}
          fileName="Student_Admission_Information.pdf"
        >
          <button 
            className="mb-4 p-2 bg-green-300 text-white rounded"
          >
            Download PDF
          </button>

          {/* {({ loading }: { loading: boolean }) => (
            <span>{loading ? 'Preparing document...' : 'Download PDF'}</span>
          )} */}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default VTUusnoUpdate;
