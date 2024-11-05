import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import NavigationNames from '../../utils/NavigationNames';
import SingleNews from '../../components/SingleNews';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const News = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]); // State to hold news data
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [filteredNews, setFilteredNews] = useState([]); // State for filtered news based on search

  useEffect(() => {
    fetchNews(); // Fetch news when component mounts
  }, []);

  useEffect(() => {
    // Filter news whenever search query changes
    const filtered = news.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [searchQuery, news]); // Depend on searchQuery and news

  const fetchNews = async () => {
    try {
      const response = await fetch('https://pos.kashmirbookdepot.com/webservice/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'query=fetch.news',
      });
      const result = await response.json();

      if (Array.isArray(result)) {
        setNews(result); // Set news data if response is an array
        setFilteredNews(result); // Set filtered news to the full list initially
      } else {
        console.log('No valid data format found:', result);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const handleSearch = () => {
    // Handle search logic
    if (searchQuery.trim() === '') {
      ToastAndroid.show('Please enter a search term', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Search Successfully', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Header text={'News'} onPress={() => { navigation.navigate(NavigationNames.Invoices); }} />
      <View style={styles.secondView}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={'black'}
          value={searchQuery}
          onChangeText={setSearchQuery} // Update search query state
        />
        <TouchableOpacity style={styles.searchbtn1} onPress={handleSearch}>
          <FontAwesome5 name='search' color='white' size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#cb0a36" style={styles.loadingIndicator} />
      ) : (
        <ScrollView style={styles.scroll}>
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <SingleNews key={index} text={item.title} date={item.date} description={item.description} />
            ))
          ) : (
            <Text style={styles.noResultsText}>No matching news found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 30,
  },
  secondView: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 15,
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    width: '77%',
    height: 40,
    alignSelf: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    elevation: 15,
    paddingHorizontal: 10,
  },
  searchbtn1: {
    width: 70,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cb0a36',
    alignSelf: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    elevation: 18,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
