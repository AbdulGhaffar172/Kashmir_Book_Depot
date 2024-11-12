import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationNames from '../../utils/NavigationNames';

const Login = ({ navigation }) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
  
    const onLogin = useCallback(async () => {
      if (!Username || !Password) {
        ToastAndroid.show('Please fill in required fields', ToastAndroid.SHORT);
        return;
      }
  
      try {
        // Clear previous data to avoid using old login information
        await AsyncStorage.multiRemove(['savedUsername', 'savedPassword', 'saveduserId', 'previousLoginDate']);
        global.UserId = null; // Reset global.UserId
  
        // Add slight delay to ensure AsyncStorage is fully cleared
        await new Promise(resolve => setTimeout(resolve, 100));
  
        const response = await fetch('https://pos.kashmirbookdepot.com/webservice/api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `user_name=${Username}&password=${Password}&query=user.auttentication`,
        });
  
        const result = await response.json();
        console.log("API Response:", result);
  
        if (result && result.error === "no" && result.id) {
            const currentLoginDate = new Date().toLocaleString();
                
                // Check if it's the first login
                const previousLoginTime = await AsyncStorage.getItem('lastLoginTime');
                
                if (!previousLoginTime) {
                    // If it's the first login, display "First Login"
                    await AsyncStorage.setItem('lastLoginTime', currentLoginDate);
                } else {
                    // If not first login, update the login date
                    await AsyncStorage.setItem('lastLoginTime', currentLoginDate);
                }
        //   await AsyncStorage.setItem('previousLoginDate', currentLoginDate);
          await AsyncStorage.setItem('savedUsername', Username);
          await AsyncStorage.setItem('savedPassword', Password);
          await AsyncStorage.setItem('saveduserId', result.id.toString());  // Ensure UserId is saved correctly
  
          global.UserId = result.id; // Set global.UserId with the new ID
          console.log("New UserId set:", global.UserId);
  
          // Navigate to Welcome screen
          navigation.navigate(NavigationNames.Bottom_Tab_Navigation, {
            screen: NavigationNames.Wellcome,
            params: { Username, loginDate: previousLoginTime || "First Login",

             },
          });
        } else {
          ToastAndroid.show('Invalid Username or Password', ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
        console.log(error, 'error');
      }
    }, [Username, Password, navigation]);
    
     // useEffect(() => {
    //     const checkLoginExpiry = async () => {
    //         const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');
    //         const savedUsername = await AsyncStorage.getItem('savedUsername');
    //         const savedPassword = await AsyncStorage.getItem('savedPassword');

    //         if (lastLoginTime && savedUsername && savedPassword) {
    //             const timeElapsed = Date.now() - parseInt(lastLoginTime, 10);
    //             const oneDay = 24 * 60 * 60 * 1000;

    //             if (timeElapsed < oneDay) {
    //                 setUsername(savedUsername);
    //                 setPassword(savedPassword);

    //                 onLogin(true);
    //             } else {
    //                 await AsyncStorage.multiRemove(['savedUsername', 'savedPassword', 'lastLoginTime', 'userId']);
    //             }
    //         }
    //     };

    //     checkLoginExpiry();
    // }, [onLogin]);

   

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image 
                    source={require('../../assets/images/Logo.png')}
                    style={styles.logo}
                    resizeMode='cover'
                />
            </View>
            <Text style={styles.loginText}>Login</Text>
            <TextInput 
                placeholder='Username'
                placeholderTextColor={'white'}
                style={styles.userInput}
                value={Username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder='Password' 
                placeholderTextColor={'white'}
                style={styles.userInput}
                value={Password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={onLogin}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cb0a36',
    },
    logo: {
        backgroundColor: 'white',
        width: '70%',
        height: '70%',
    },
    imgContainer: {
        backgroundColor: 'white',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    loginText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 40,
    },
    userInput: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    btn: {
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 55,
    },
    btnText: {
        color: '#cb0a36',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
