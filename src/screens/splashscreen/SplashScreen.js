import { StyleSheet, View, StatusBar, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import NavigationNames from '../../utils/NavigationNames';

const SplashScreen = ({ navigation }) => {
  const [isNavigated, setIsNavigated] = useState(false); // To track if navigation has already occurred

  // Using useEffect for checking login status initially
  useEffect(() => {
    const checkLoginStatus = async () => {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');
        const savedUserId = await AsyncStorage.getItem('saveduserId'); // Corrected key name

        console.log(savedUserId, savedUsername, savedPassword, lastLoginTime);

        if (savedUsername && savedPassword && savedUserId && lastLoginTime && savedUserId !== null) {
            if (!isNavigated) {
                setIsNavigated(true);
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: NavigationNames.Bottom_Tab_Navigation,
                        params: {
                            screen: NavigationNames.Wellcome,
                            params: {
                                Username: savedUsername,
                                UserId: savedUserId,
                                loginDate: lastLoginTime,
                            }
                        }
                    }],
                });
            }
        }
    };

    checkLoginStatus();
  }, [navigation, isNavigated]);

  // Using useFocusEffect for additional navigation handling after a delay
  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        if (!isNavigated) { // Only navigate to Login if it hasn't been done already
          navigation.navigate(NavigationNames.Login);
        }
      }, 2000);

      // Cleanup timer when the component is unfocused
      return () => clearTimeout(timer);
    }, [navigation, isNavigated])
  );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#cb0a36'} />
            <View style={styles.imgcontainer}>
                <Image source={require('../../assets/images/Logo.png')}
                    style={styles.logo}
                />
            </View>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    text:{
        fontSize:30,
    },
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#cb0a36',
    },
    logo:{
        backgroundColor:'white',
        width:'70%',
        height:'70%',
    },
    imgcontainer:{
        backgroundColor:'white',
        width:200,
        height:200,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
    },
});