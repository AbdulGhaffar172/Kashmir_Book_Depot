import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { size } from 'react-native-responsive-sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import NavigationNames from '../../utils/NavigationNames';
import Invoice from '../../components/Invoice';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]); // Store the invoices to display
  const [previousInvoices, setPreviousInvoices] = useState([]); // Store previous invoices fetched
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allInvoicesLoaded, setAllInvoicesLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      // Retrieve UserId from AsyncStorage if not set globally
      if (!global.UserId) {
        const userId = await AsyncStorage.getItem('savedUserid'); // Adjust key if necessary
        if (userId) {
          global.UserId = userId;
        } else {
          ToastAndroid.show('User ID not found, please log in again.', ToastAndroid.SHORT);
          return; // Prevent further actions if User ID is not found
        }
      }
      fetchInvoices(); // Call the function to fetch invoices once UserId is fetched
    };

    fetchUserId(); // Call the async function on mount

    // Empty dependency array ensures this runs only once when the component mounts
  }, [fetchInvoices]);

  const fetchInvoices = useCallback(
    async () => {
      setLoading(true);
      try {
        console.log('Fetching invoices...'); // Debug log
        const url = `https://pos.kashmirbookdepot.com/webservice/api.php?customerId=${global.UserId}&query=fetch.all_invoice`;
        console.log('URL:', url); // Log the URL being fetched

        const response = await fetch(url);
        console.log('Response status:', response.status); // Log the response status

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data

        if (data.length === 0) {
          setAllInvoicesLoaded(true); // No more invoices to load
        } else {
          setInvoices(data); // Set all invoices
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        ToastAndroid.show('Error fetching invoices: ' + error.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchInvoices(); // Fetch invoices on screen focus
      setSearchQuery('');
      setAllInvoicesLoaded(false);
      setIsSearching(false);
    }, [fetchInvoices])
  );

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      ToastAndroid.show('Please enter an invoice number', ToastAndroid.SHORT);
      resetSearch();
      return;
    }

    setLoading(true);
    setIsSearching(true);

    try {
      const response = await fetch(
        `https://pos.kashmirbookdepot.com/webservice/api.php?customerId=${global.UserId}&query=search.invoice&order_no=SO-${searchQuery}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        console.log('Search Results', data);
        setInvoices(data); // Set invoices to only search results
        setPreviousInvoices([]); // Clear previous invoices on search
        setAllInvoicesLoaded(true);
        ToastAndroid.show('Search Successful', ToastAndroid.SHORT);
      } else {
        resetSearch();
        ToastAndroid.show('No matching invoice found', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error searching invoice:', error);
      ToastAndroid.show('Error occurred while searching', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const resetSearch = useCallback(() => {
    setInvoices(previousInvoices);
    setSearchQuery('');
    setAllInvoicesLoaded(false);
  }, [previousInvoices]);

  const handleInputChange = useCallback((text) => {
    let updatedText = text;
    if (!updatedText.startsWith('SO-')) {
      updatedText = `SO-${updatedText}`;
    }
    const regex = /^SO-\d+$/;
    if (regex.test(updatedText)) {
      updatedText += '-';
    }
    setSearchQuery(updatedText.replace('SO-', ''));
  }, []);

  const header = useMemo(() => (
    <Header
      text={'Invoices'}
      onPress={() => {
        navigation.navigate(NavigationNames.Ledger);
        resetSearch();
      }}
      rightButton={
        <TouchableOpacity onPress={fetchInvoices}>
          <FontAwesome5 name="sync" color="white" size={20} />
        </TouchableOpacity>
      }
    />
  ), [navigation, resetSearch, fetchInvoices]);

  const renderFooter = useMemo(() => (
    loading && <ActivityIndicator size="small" color="#cb0a36" />
  ), [loading]);

  // Memoize the Invoice component to prevent unnecessary re-renders
  const MemoizedInvoice = React.memo(({ item }) => (
    <Invoice
      no={item.purchase_order_no}
      id={item.id}
      date={item.purchase_order_date}
      total={` ${Number(item.total_price).toLocaleString('en-IN')}`}
      invoice={item}
    />
  ));

  return (
    <View style={styles.container}>
      {header}
      <View style={styles.secondView}>
        <View style={styles.input}>
          <Text style={styles.soText}>SO-</Text>
          <TextInput
            style={styles.input1}
            value={searchQuery}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.searchbtn1} onPress={handleSearch}>
          <FontAwesome5 name="search" color="white" size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#cb0a36" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MemoizedInvoice item={item} />}  // Use memoized Invoice component
          ListFooterComponent={renderFooter}
          initialNumToRender={100}
          maxToRenderPerBatch={100}
          windowSize={100}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};
export default Invoices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstView: {
    flex: 1,
  },
  nametext: {
    color: 'black',
    fontSize: size(20),
    fontWeight: 'bold',
    marginTop: size(80),
    marginLeft: size(30),
    marginBottom: size(10),
  },
  secondView: {
    flexDirection:'row',
    marginTop:30,
    marginLeft:11,
    marginBottom:25,
    borderRadius:5
    
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
      fontWeight:'bold',
    },
    searchbtn:{
      width:'40%',
      height:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#8E0725',
      alignSelf:'flex-end',
      marginVertical:20,
      marginHorizontal:15,
      borderRadius:5,
      keyboardType:'numeric',
    },
    input:{
      backgroundColor:'white',
      color:'black',
      // width:300,
      height:40,
      alignSelf:'center',
       width:'77%',
      elevation:15,
      borderTopLeftRadius:5,
      borderBottomLeftRadius:5,
      paddingHorizontal:10,
      flexDirection:'row',
      alignItems:'center',
    },
    searchbtn1:{
      width:78,
      height:40,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#cb0a36',
      alignSelf:'center',
      elevation:18,
      borderTopRightRadius:5,
      borderBottomRightRadius:5,
    },
    soText:{
      color:'black',
      fontSize:15,
    },
    input1:{
      width:'100%',
      height:40,
      color:'black',
    },
});
