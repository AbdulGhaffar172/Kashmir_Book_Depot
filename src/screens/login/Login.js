import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import NavigationNames from '../../utils/NavigationNames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    

    useEffect(() => {
        // Optionally, fetch previous login date here if needed
    }, []);

    const onLogin = async () => {
        if (!Username || !Password) {
            ToastAndroid.show('Please fill in required fields', ToastAndroid.SHORT);
            return;
        }
    
        try {
            const response = await fetch('https://pos.kashmirbookdepot.com/webservice/api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user_name=${Username}&password=${Password}&query=user.auttentication`,
            });
    
            const result = await response.json();
            global.UserId = result.id;
            // console.log('User ID:', global.UserId);
            // console.log('Server response:', result); // Log the response for debugging
    
            if (result && result.error === "no") {
                // Retrieve the previous login date from AsyncStorage
                const previousLoginDate = await AsyncStorage.getItem('previousLoginDate');
                
                // Store the current date as the new login date
                await AsyncStorage.setItem('previousLoginDate', new Date().toLocaleString()); 
    
                // Check if it is the user's first login
                const isFirstLogin = previousLoginDate === null;
    
                // Store the first login flag
                if (isFirstLogin) {
                    await AsyncStorage.setItem('hasLoggedIn', 'true');
                }
    
                // Navigate to the welcome screen
                navigation.navigate(NavigationNames.Bottom_Tab_Navigation, { 
                    screen: NavigationNames.Wellcome,
                    params: { 
                        Username: Username,
                        UserId: result.id,
                        loginDate: isFirstLogin ? "First Login" : previousLoginDate, // Pass the previous login date
                    }, 
                });
            } else {
                // Show an error message if authentication fails
                ToastAndroid.show('Invalid Username or Password', ToastAndroid.SHORT);
            }
        } catch (error) {
            // Handle any network errors
            ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
        }
    };
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
