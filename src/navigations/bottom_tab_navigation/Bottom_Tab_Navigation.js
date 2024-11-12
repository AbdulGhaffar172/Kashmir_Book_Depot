import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ledger from '../../screens/ledger/Ledger';
import Invoices from '../../screens/invoices/Invoices';
import News from '../../screens/news/News';
import NavigationNames from '../../utils/NavigationNames';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Wellcome from '../../screens/wellcomescreen/Wellcome';

const Tab = createBottomTabNavigator();

const Bottom_Tab_Navigation = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const logout = async () => {
    // Clear the AsyncStorage data when logging out
    await AsyncStorage.multiRemove(['savedUsername', 'savedPassword',  'saveduserId']);
    global.UserId = null;
    setModalVisible(true); // Show modal when logout is pressed
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName={NavigationNames.Wellcome}
        screenOptions={({ route }) => ({
          tabBarActiveBackgroundColor: '#cb0a36',
          tabBarInactiveBackgroundColor: '#cb0a36',
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#cb0a36', // Active icon and label color
          tabBarInactiveTintColor: '#ffffff', // Inactive icon and label color
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let IconComponent;
            let label;

            // Define background color based on focused state
            const backgroundColor = focused ? 'white' : '#cb0a36';

            // Choose icon based on route
            if (route.name === NavigationNames.Ledger) {
              iconName = 'filetext1';
              IconComponent = Icon3;
              label = 'Ledger';
            } else if (route.name === NavigationNames.Invoices) {
              iconName = 'file-invoice-dollar';
              IconComponent = Icon1;
              label = 'Invoices';
            } else if (route.name === NavigationNames.News) {
              iconName = 'newspaper-o';
              IconComponent = Icon;
              label = 'News';
            } else if (route.name === NavigationNames.Logout) {
              iconName = 'logout';
              IconComponent = Icon3;
              label = 'Log out';
            }

            return (
              <View style={[styles.iconLabelContainer, { backgroundColor }]}>
                <View style={styles.iconContainer}>
                  <IconComponent name={iconName} size={20} color={color} />
                </View>
                <Text style={[styles.label, { color: focused ? '#cb0a36' : '#ffffff' }]}>
                  {label}
                </Text>
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name={NavigationNames.Wellcome}
          component={Wellcome}
          options={{ tabBarButton: () => null }} // Hide the tab bar button for this screen
        />
        <Tab.Screen name={NavigationNames.Ledger} component={Ledger} />
        <Tab.Screen name={NavigationNames.Invoices} component={Invoices} />
        <Tab.Screen name={NavigationNames.News} component={News} />
        <Tab.Screen
          name={NavigationNames.Logout}
          component={() => null} // Remove component but keep tab for logout functionality
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevent tab navigation
              logout(); // Show the modal instead
            },
          }}
        />
      </Tab.Navigator>

      {/* Modal for logout confirmation */}
      <Modal
        transparent={true}
        visible={modalVisible}
        // animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalcontentcontainer}>
            <View style={styles.logoutcontainer}>
              <Text style={styles.logouttext}>Logout</Text>
              <Text style={styles.logouttext1}>Do you want to Logout?</Text>
            </View>
            <View style={styles.btncontainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.canceltext}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                navigation.navigate(NavigationNames.SplashScreen); // Navigate to login
              }}>
                <Text style={styles.canceltext}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Bottom_Tab_Navigation;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    borderWidth: 0.5,
  },
  label: {
    fontSize: 10, // Customize label size
    fontWeight: '600', // Customize label weight
  },
  modalcontentcontainer: {
    paddingVertical: 15,
    backgroundColor: '#424242',
    width: '85%',
    // height: '19%',
  },
  modalcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logouttext: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  logouttext1: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
  },
  btncontainer: {
    flexDirection: 'row',
    marginTop: 40,
    alignSelf: 'flex-end',
    marginRight: 35,
  },
  canceltext: {
    fontSize: 16,
    color: 'black',
    marginLeft: 20,
    fontWeight: '500',
  },
  logoutcontainer: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
});
