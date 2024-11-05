import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import NavigationNames from '../utils/NavigationNames';
const Header = ({text, onPress}) => {
  const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const logout = () =>{
      setModalVisible(true);
    }
  return (
    <View style={styles.container}>
    <View style={styles.headercontainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon2 name="chevron-back" size={25} color="white"/>
      </TouchableOpacity>
      <Text style={styles.text}>{text}</Text>
      </View>
      {/* <TouchableOpacity onPress={()=>{
        logout();}
      }>
      <Icon name="logout" size={25} color="white"/>
      </TouchableOpacity> */}
      <Modal 
      transparent={true}
      visible={modalVisible}
      // animationType='slide'
      onRequestClose={()=>{
        navigation.navigate(NavigationNames.Login);
      }}>
      <View style={styles.modalcontainer}>
      <View style={styles.modalcontentcontainer}>
      <View style={styles.logoutcontainer}>
        <Text style={styles.logouttext}>Logout</Text>
        <Text style={styles.logouttext1}>Do you want to Logout?</Text>
        </View>
        <View style={styles.btncontainer}>
        <TouchableOpacity onPress={()=>{
          setModalVisible(false);
        }}>
        <Text style={styles.canceltext}>
          CANCEL
        </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          setModalVisible(false);
          navigation.navigate(NavigationNames.Login);
        }}>
        <Text style={styles.canceltext}>
          YES
        </Text>
        </TouchableOpacity>
        </View>
        
      </View>
      </View>
      </Modal>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    text:{
        fontSize:20,
        fontWeight:'400',
        color:'white',
        marginLeft:20,
    },
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#cb0a36',
        height:50,
        paddingHorizontal:20,
    },
    headercontainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
    },
    modalcontentcontainer:{
      paddingVertical:15,
      backgroundColor:'#424242',
      width:'85%',
      height:'17%',
    },
    modalcontainer:{
      justifyContent:'center',
      alignItems:'center',
      flex:1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    logouttext:{
      fontSize:17,
      fontWeight:'600',
      color:'white',
        },
    logouttext1:{
          fontSize:13,
          color:'white',
          marginTop:5
            },
    btncontainer:{
      flexDirection:'row',
      marginTop:40,
      alignSelf:'flex-end',
      marginRight:35,
    },
    canceltext:{
      fontSize:16,
      color:'black',
      marginLeft:20,
      fontWeight:'500',
    },
    logoutcontainer:{
      alignSelf:'flex-start',
      marginLeft:20,
    }
});