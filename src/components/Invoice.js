import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share'; 
import PushNotification from 'react-native-push-notification';

const Invoice = ({ id, date, total, invoice, no }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFilePath, setPdfFilePath] = useState('');
  useEffect(() => {
    if (modalVisible) {
      ToastAndroid.show('Touch the screen for zoom in or zoom out', ToastAndroid.LONG);
    }
  }, [modalVisible]);

  PushNotification.configure({
    onNotification: function (notification) {
      if (notification.data && notification.data.filePath) {
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.previewDocument(notification.data.filePath);
        } else {
          RNFetchBlob.android.actionViewIntent(notification.data.filePath, 'application/pdf');
        }
      }
    },
    requestPermissions: Platform.OS === 'ios',
  });

  const fetchInvoiceUrl = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pos.kashmirbookdepot.com/webservice/api.php?customerId=${global.UserId}&order_id=${id}&query=fetch.invoice`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invoice Url:', data);
      if (data && data.link) {
        setInvoiceUrl(data.link);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Invoice URL not found');
      }
    } catch (error) {
      console.error('Failed to fetch invoice URL:', error);
      Alert.alert('Error', 'Failed to fetch invoice URL');
    } finally {
      setLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download invoices.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const convertHtmlToPdf = async (htmlContent) => {
    try {
      const options = {
        html: htmlContent,
        fileName: `invoice_${id}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      setPdfFilePath(file.filePath);

      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.previewDocument(file.filePath);
      } else {
      }
      return file.filePath;
    } catch (error) {
      console.error('PDF generation failed:', error);
      Alert.alert('Error', 'Failed to generate PDF from HTML');
      return null; 
    }
  };
  const downloadInvoice = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to give storage permission to download the invoice.');
      return;
    }
    try {
      const { config, fs } = RNFetchBlob;
      const invoiceFileName = `invoice_${id}.pdf`;
      const downloadPath = `${fs.dirs.DownloadDir}/${invoiceFileName}`;
      const downloadOptions = {
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          description: 'Downloading invoice...',
        },
      };
      const res = await config(downloadOptions).fetch('GET', invoiceUrl);
      const fileExists = await fs.exists(downloadPath);
      if (fileExists) {
        console.log('Download completed:', downloadPath);
        setPdfFilePath(downloadPath);
      } else {
        Alert.alert('Download Failed', 'Failed to download the invoice.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download the invoice.');
    }
  };
  const downloadInvoice1 = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to give storage permission to download the invoice.');
      return null;
    }

    try {
      const response = await fetch(invoiceUrl);
      const htmlContent = await response.text();
      const filePath = await convertHtmlToPdf(htmlContent);
      return filePath; 
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download or convert invoice');
      return null; 
    }
  };

  const sharePdf = async () => {
    const filePath = await downloadInvoice1();
    if (filePath) {
      try {
        await Share.open({
          url: `file://${filePath}`,
          title: 'Share Invoice PDF',
          message: 'Here is the invoice PDF file.',
        });
        console.log('PDF shared successfully');
      } catch (error) {
        if (error.message.includes("User did not share")) {
        } else {
          console.error('Share failed:', error);
          Alert.alert('Error', 'Failed to share the PDF');
        }
      }
    } else {
      Alert.alert('Error', 'Failed to download the PDF for sharing');
    }
  };

  return (
    <ScrollView style={styles.scrollcon}>
      <View style={styles.container}>
        <View style={styles.headingcontainer}>
          <Text style={styles.heading2}>Invoice No </Text>
          <Text style={styles.heading3}>{no}</Text>
        </View>
        <View style={styles.details}>
          <View>
            <View style={styles.detailscontainer}>
              <Text style={styles.heading}>Date    </Text>
              <Text style={styles.heading1}>{date}</Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.amountText}>Amount       </Text>
              <Text style={styles.heading1}>{total}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.pdfcontainer} onPress={fetchInvoiceUrl}>
            <FontAwesome5 name='file-pdf' color='white' size={25} />
            <Text style={styles.pdftext}> View</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#cb0a36" />
              ) : (
                <>
                  {invoiceUrl ? (
                    <WebView
                      source={{ uri: invoiceUrl }}
                      startInLoadingState={true}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Text style={styles.modalText}>No invoice available</Text>
                  )}
                  <TouchableOpacity style={styles.downloadbtn} onPress={() => {
                    downloadInvoice();
                    setModalVisible(false);
                  }}>
                    <FontAwesome name='download' color='white' size={20} />
                    <Text style={styles.downloadtext}>Download PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sharebtn} onPress={sharePdf}>
                    <FontAwesome name='share' color='white' size={20} />
                    <Text style={styles.downloadtext}>Share PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => {
                    setModalVisible(false);
                  }}>
                    <Text style={styles.pdftext}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};


export default Invoice

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollcon:{
    flex:1
  },
  heading: {
    fontSize: 15,
    color: 'black',
    fontWeight:'bold',
  },
  amountText: {
    fontSize: 15,
    color: 'black',
    fontWeight:'bold',
  },
  heading1: {
    fontSize: 15,
    color: 'black',
  },
  heading2: {
    fontSize: 15,
    fontWeight:"700",
    color: 'white',
  },
  heading3: {
    fontSize: 15,
   
    color: 'white',
  },
  headingcontainer: {
    alignItems: 'center',
    backgroundColor: '#cb0a36',
    height: 45,
    justifyContent: 'center',
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
    flexDirection:'row',

  },
  detailscontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"row",
    marginTop:8,
    width:'70%',
  },
  details: {
   flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:'97%',
    marginLeft:10,
    marginTop:20,
    marginBottom:10,
    height:50,
  },
  pdftext: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  pdfcontainer: {
    alignItems: 'center',
    alignSelf:'flex-end',
    backgroundColor: '#cb0a36',
    height: 40,
    justifyContent: 'center',
    borderRadius: 25,
    flexDirection:'row',
    width:'30%',
    marginBottom:10,
    marginRight:10,
  },
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderColor:"black",
    elevation: 9,
    backgroundColor:'white',
    borderRadius:5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width:'90%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    color:'black',
    fontWeight:'bold',
    margin:6,
  },
  closeButton: {
    backgroundColor: '#454545',
    padding: 10,
    borderRadius: 5,
    bottom:0,
    position:'absolute',
    width:'100%',
    paddingRight:20,
    height:50,
    justifyContent:'center',
    alignItems:'flex-end',
  },
  firstcontainer:{
    borderBottomWidth:2,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10,
    borderColor:'black',
    paddingBottom:5,
  },
  secondcontainer:{
    backgroundColor:'white',
    paddingVertical:10,
    borderBottomWidth:2,
    borderColor:'black',
  },
  thirdcontainer:{
    paddingHorizontal:10,
    backgroundColor:'white',
  },
  address:{
    fontSize:10,
    color:'black',
    marginVertical:2,
  },
  headingtext:{
    fontSize:10,
    fontWeight:'bold',
    color:'black',
    marginVertical:3,
  },
  rowContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:4,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:5,
    paddingVertical:3,
  },
  headerText: {
    flex: 1,
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 10,
    color:'black',
  },
  dataText: {
    flex: 1,
    textAlign: 'center', 
    flexWrap: 'wrap', 
    fontSize: 10,
    color:'black',
  },
  textcontainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  operatorText:{
    fontSize:20,
    fontWeight:'bold',
    color:'red',
  },
  nameText:{
    fontSize:20,
    fontWeight:'bold',
    color:'black',
  },
  downloadbtn: {
    width:'45%',
    height: 40,
    backgroundColor: '#cb0a36',
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 70,
    elevation:7
  },
  downloadtext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft:10,
  },
  sharebtn: {
    width: '45%',
    height: 40,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 120,
    elevation: 7,
  },
});

