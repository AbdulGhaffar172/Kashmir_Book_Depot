import { StyleSheet, View, StatusBar, Image} from 'react-native';
import React from 'react';
import NavigationNames from '../../utils/NavigationNames';
import { useFocusEffect } from '@react-navigation/native';
const SplashScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
        const timer = setTimeout(() => {
            navigation.navigate(NavigationNames.Login);
        }, 2000);

        return () => clearTimeout(timer); 
    }, [navigation])
);
  return (
    <View style={styles.container}>
    <StatusBar backgroundColor={'#cb0a36'}/>
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