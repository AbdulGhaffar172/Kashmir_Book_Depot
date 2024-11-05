import { StyleSheet, Text, Alert, TouchableOpacity, View, ToastAndroid, PermissionsAndroid, Linking, Modal, ScrollView,  } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Ledger = () => {
  const navigation = useNavigation();
  const [isSecondViewVisible, setSecondViewVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedDateText, setSelectedDateText] = useState('Select start date');

  const [date1, setDate1] = useState(null);
  const [show1, setShow1] = useState(false);
  const [selectedDateText1, setSelectedDateText1] = useState('Select end date');

  const handleShowDatepicker = () => setShow(true);
  const handleShowDatepicker1 = () => setShow1(true);

  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedLedgerItem, setSelectedLedgerItem] = useState(null);

  useEffect(() => {
    console.log("Current ledger data:", ledgerData);
  }, [ledgerData]);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setSelectedDateText(currentDate.toDateString());
  };

  const onChange1 = (event, selectedDate1) => {
    const currentDate = selectedDate1 || date1;
    setShow1(false);
    setDate1(currentDate);
    setSelectedDateText1(currentDate.toDateString());
  };

  const handleFirstViewClick = () => {
    if (!date && !date1) {
      Alert.alert('Missing Dates', 'Please select both start and end dates.');
      return;
    }

    if (!date) {
      Alert.alert('Missing Start Date', 'Please select the start date.');
      return;
    }

    if (!date1) {
      Alert.alert('Missing End Date', 'Please select the end date.');
      return;
    }

    if (date && date1 && date > date1) {
      Alert.alert('Invalid Date Range', 'Start date must be less than or equal to the end date.');
      return;
    }

    fetchLedgerData();
  };

  const fetchLedgerData = async () => {
    setLoading(true);
    setLedgerData([]);

    try {
      const response = await fetch('https://pos.kashmirbookdepot.com/webservice/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `customer_id=${global.UserId}&start_date=${date.toISOString().split('T')[0]}&end_date=${date1.toISOString().split('T')[0]}&query=fetch.ledger`,
      });

      const responseText = await response.text();

      const result = JSON.parse(responseText);

      if (result && Array.isArray(result)) {
        setLedgerData(result);
        setSecondViewVisible(true);
      } else {
        Alert.alert('Error', 'Failed to fetch ledger data');
      }
    } catch (error) {
      console.error('Fetch ledger error:', error);
      Alert.alert('Network Error', 'Unable to fetch ledger data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the file',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const createPDF = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download the PDF.');
        return;
    }

    // Create HTML for all entries in ledgerData
    const ledgerHTML = ledgerData.map(item => `
      <tr>
        <td>${item.date}</td>
        <td>${item.invoiceno || 'N/A'}</td>
        <td>${item.booksAmount || '0'}</td>
        <td>${item.paymentReceived || '0'}</td>
        <td>${item.Balance || '0'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>Ledger</h1>
      <p><strong>From:</strong> ${selectedDateText}</p>
      <p><strong>To:</strong> ${selectedDateText1}</p>
      <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Invoices</th>
            <th>Amount</th>
            <th>Received</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${ledgerHTML}
        </tbody>
      </table>
    `;

    try {
        const options = {
            html: htmlContent,
            fileName: 'ledger_report', // name of the file
            directory: 'Downloads', // Save to Downloads folder
        };

        const file = await RNHTMLtoPDF.convert(options);
        ToastAndroid.show('PDF Downloaded to: ' + file.filePath, ToastAndroid.SHORT);
        Linking.openURL(file.filePath);
        console.log(file.filePath);
    } catch (error) {
        Alert.alert('Error', 'Failed to create PDF: ' + error.message);
    }
};
const handleInvoicePress = (item) => {
  setSelectedLedgerItem(item); // Set the selected ledger item
  setShowModal(true); // Show the modal
};

  return (
    <View style={styles.searchcontainer}>
      {!isSecondViewVisible && (
        <View style={styles.searchcontainer}>
          <Header text={'Ledger'} onPress={() => { navigation.goBack() }} />
          
          <View style={styles.externalcontainer}>
            <View style={styles.inputcontainer}>
              <Text style={styles.textinput}>From</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <TouchableOpacity onPress={handleShowDatepicker}>
                <Text style={styles.input}> {selectedDateText}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputcontainer}>
              <Text style={styles.textinput}>To </Text>
              {show1 && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date1 || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange1}
                />
              )}
              <TouchableOpacity onPress={handleShowDatepicker1}>
                <Text style={styles.input}>   {selectedDateText1}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.searchbtn} onPress={handleFirstViewClick} disabled={loading}>
            <Icon name="search" size={20} color="white" />
            <Text style={styles.textbtn}>Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {isSecondViewVisible && (
        <View style={{ flex: 1 }}>
          <Header text={'Ledger'} onPress={() => { setSecondViewVisible(false) }} />
          <View style={{ marginTop: 20, paddingLeft: 10, paddingRight: 10, height: 20, alignContent: 'flex-start', alignItems: 'flex-start', flexDirection:'row', }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>From:  </Text>
            <Text style={{ color:'black', fontWeight:'400' }}>{selectedDateText}</Text>
          </View>
          <View style={{ paddingLeft: 10, paddingRight: 10, height: 20, alignContent: 'flex-start', alignItems: 'flex-start', flexDirection:'row', }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>To:       </Text>
            <Text style={{ color:'black', fontWeight:'400' }}>{selectedDateText1}</Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Invoices</Text>
            <Text style={styles.headerText}>Amount</Text>
            <Text style={styles.headerText}>Received</Text>
            <Text style={styles.headerText}>Balance</Text>
          </View>
          {ledgerData.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available</Text>
        ) : (
            <ScrollView style={{marginBottom:60}}>
                {ledgerData.map((item, index) => (
                    <View key={index} style={styles.dataContainer}>
                        <Text style={styles.dataText}>{item.date}</Text>
                        <Text onPress={()=> handleInvoicePress(item)} style={styles.dataText1}>{item.invoiceno || 'N/A'}</Text>
                        <Modal
                        visible={showModal}
                        transparent={true}
                        onRequestClose={() => setShowModal(false)}
                        >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                          {selectedLedgerItem && (
                  <>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalText}>Date</Text>
                      <Text style={styles.modalText}>{selectedLedgerItem.date}</Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalText}>Invoice Number</Text>
                      <Text style={styles.modalText}>{selectedLedgerItem.invoiceno || 'N/A'}</Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalText}>Total Amount</Text>
                      <Text style={styles.modalText}>{selectedLedgerItem.total || '0'}</Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalText}>Payment Received</Text>
                      <Text style={styles.modalText}>{selectedLedgerItem.paymentReceived || '0'}</Text>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalText}>Balance</Text>
                      <Text style={styles.modalText}>{`${Number(selectedLedgerItem.Balance).toLocaleString('en-IN')}`}</Text>
                    </View>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setShowModal(false)}>
                      <Text style={styles.downloadtext}>Okay</Text>
                    </TouchableOpacity>
                  </>
                )}
                          </View>
                        </View>
                        </Modal>
                        <Text style={styles.dataText}>{item.total || '0'}</Text>
                        <Text style={styles.dataText}>{item.paymentReceived || '0'}</Text>
                        <Text style={styles.dataText}>{`${Number(item.Balance).toLocaleString('en-IN')}`}</Text>
                    </View>
                ))}
            </ScrollView>
        )}
          <TouchableOpacity style={styles.downloadbtn} onPress={createPDF}>
            <FontAwesome name='download' color='white' size={20} />
            <Text style={styles.downloadtext}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default Ledger;

const styles = StyleSheet.create({
  searchcontainer: {
    flex: 1,
  
  },
  input: {
    backgroundColor: 'white',
    width: 130,
    height: 40,
    borderRadius: 5,
    marginVertical: 10,
    color: 'black',
    textAlign: 'center',
    paddingTop: 10,
    elevation:8
  },
  textinput: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputcontainer: {
    alignItems: 'center',
  },
  externalcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 50,
  },
  searchbtn: {
    backgroundColor: '#cb0a36',
    width: 300,
    height: 40,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 50,
    borderRadius:10,
    elevation:10
  },
  textbtn: {
    fontSize: 20,
    color: 'white',
    right: 50,
    fontWeight:'bold'
  },
  headings: {
    flexDirection: 'row',
    backgroundColor: '#ffb3c3',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
    marginTop: 40,
  },
  headingtext: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  info: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  infotext: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  downloadbtn: {
    width:'60%',
    height: 40,
    backgroundColor: '#cb0a36',
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    elevation:7,
  },
  downloadtext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft:10
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 40,
    backgroundColor: '#cb0a36',
    alignItems:'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center', 
    flexWrap: 'wrap', 
    fontSize: 13,
    color:'white',
    paddingHorizontal:4,
    borderColor:'white',
    borderWidth:1,
    height:60,
    textAlignVertical:'center',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ffffff',
    paddingHorizontal:2,
  },
  dataText: {
    flex: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 13,
    color:'black',
    paddingHorizontal:4,
    borderColor:'black',
    borderWidth:1,
    height:60,
    textAlignVertical:'center',
  },
  dataText1: {
    flex: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 13,
    color:'black',
    paddingHorizontal:4,
    borderColor:'black',
    borderWidth:1,
    height:60,
    textAlignVertical:'center',
    textDecorationLine:'underline',
  },
  modalContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width:"95%",
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom:20,
    padding:10,
  },
  modalText:{
    fontSize:18,
    color:'black',
  },
  modalRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:10,
  },
  modalBtn: {
    width:'40%',
    height: 40,
    backgroundColor: '#cb0a36',
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    elevation:7,
    marginVertical:10,
    marginTop:20,
  },
});