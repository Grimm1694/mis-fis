import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, PDFViewer, Image } from '@react-pdf/renderer';

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
      marginTop: -2,
      marginBottom: 0,
    },
    ADMContainer: {
      marginTop: -8,
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

interface MyDocumentProps {
    tableData: string[][];
  }
  
  const MyDocument: React.FC<MyDocumentProps> = ({ tableData }) => (
    <Document>
      <Page style={styles.page}>
        {/* Logo and Institute Name Section */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            src="/image/DrAIT_logo.png"
          />
          <Text style={styles.instituteName}>Dr Ambedkar Institute of Technology</Text>
          <Text style={styles.instituteType}>(An Autonomous Institution Aided by Govt. of Karnataka and affiliated to Visvesvaraya Technological University, Belagavi)</Text>
          <Text style={styles.instituteAddress}>Next to IIPM, Mallathahalli, BDA Outer Ring Road, Bengaluru - 560056</Text>
          <Text style={styles.TCHeading}> Transfer Certificate / ವರ್ಗಾವಣೆ ಪ್ರಮಾಣ ಪತ್ರ </Text>
        </View>
  
        <View style={styles.ADMContainer}>
          <Text style={styles.ADMBookNo}>ಪ್ರವೇಶ ಪುಸ್ತಕ ಕ್ರಮಾಂಕ / Admission Book No: ___________________</Text>
          <Text style={styles.ADMBookNo}>ಕ್ರಮಾಂಕ / Sl No: ___________________</Text>
        </View>
  
        {/* Table Section */}
        <View style={styles.table}>
          {tableData.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCellslno}>{index + 1}</Text>
              <Text style={styles.tableCell}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
            </View>
          ))}
        </View>
  
        <View style={styles.Place}>
          <Text style={styles.Place}>Place: Bengaluru</Text>
        </View>
  
        <View style={styles.ADMContainer}>
          <Text style={styles.ADMBookNo}>Date: {getCurrentDate()}</Text>
          <Text style={styles.ADMBookNo}>Principal</Text>
        </View>
      </Page>
    </Document>
  );
  export default MyDocument