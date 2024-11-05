import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useCallback } from 'react';
import { size } from 'react-native-responsive-sizes';
import Header from '../../components/Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import NavigationNames from '../../utils/NavigationNames';
import Invoice from '../../components/Invoice';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [originalInvoices, setOriginalInvoices] = useState([]);
  const [isSecondViewVisible, setSecondViewVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allInvoicesLoaded, setAllInvoicesLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigation = useNavigation();

  const fetchInvoices = useCallback(
    async (reset = false) => {
      if (reset) setPage(1);
      setLoading(true);
      
      try {
        const pageParam = reset ? 1 : page;
        const response = await fetch(
          `https://pos.kashmirbookdepot.com/webservice/api.php?customerId=${global.UserId}&query=fetch.all_invoice&page=${pageParam}`
        );
        const data = await response.json();

        if (data.length === 0) {
          setAllInvoicesLoaded(true);
        } else {
          setInvoices((prevInvoices) => (reset ? data : [...prevInvoices, ...data]));
          setOriginalInvoices((prevInvoices) => (reset ? data : [...prevInvoices, ...data]));
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        ToastAndroid.show('Error fetching invoices', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useFocusEffect(
    useCallback(() => {
      fetchInvoices(true);
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
        setInvoices(data);
        setSecondViewVisible(false);
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

  const resetSearch = () => {
    setInvoices(originalInvoices);
    setSearchQuery('');
    setSecondViewVisible(false);
    setIsSearching(false);
    setAllInvoicesLoaded(false);
  };

  const handleLoadMore = () => {
    if (!loading && !allInvoicesLoaded && !isSearching) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleInputChange = (text) => {
    let updatedText = text;
    if (!updatedText.startsWith('SO-')) {
      updatedText = `SO-${updatedText}`;
    }
    const regex = /^SO-\d+$/;
    if (regex.test(updatedText)) {
      updatedText += '-';
    }
    setSearchQuery(updatedText.replace('SO-', ''));
  };

  return (
    <View style={styles.container}>
      <Header
        text={'Invoices'}
        onPress={() => {
          navigation.navigate(NavigationNames.Ledger);
          resetSearch();
        }}
        rightButton={
          <TouchableOpacity onPress={() => fetchInvoices(true)}>
            <FontAwesome5 name="sync" color="white" size={20} />
          </TouchableOpacity>
        }
      />
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

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#cb0a36" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Invoice
              no={item.purchase_order_no}
              id={item.id}
              date={item.purchase_order_date}
              total={` ${Number(item.total_price).toLocaleString('en-IN')}`}
              invoice={item}
            />
          )}
          onEndReached={handleLoadMore}
          // onEndReachedThreshold={0.5}
          ListFooterComponent={() => loading && <ActivityIndicator size="small" color="#cb0a36" />}
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
