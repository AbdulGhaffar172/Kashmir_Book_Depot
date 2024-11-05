import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icon1 from 'react-native-vector-icons/EvilIcons';

const SingleNews = ({ text, date, description }) => {
  const [modalVisible, setModalVisible] = useState(false); // Manage modal visibility state

  const openModal = () => setModalVisible(true); // Show the modal
  const closeModal = () => setModalVisible(false); // Close the modal

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={openModal}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.datecontainer}>
          <Icon name="calendar" size={15} color="white" />
          <Text style={styles.date1}>{date}</Text>
        </View>
      </TouchableOpacity>

      {/* Modal Component */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal} // Handle back button on Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closebtn} onPress={closeModal}>
                <Icon1 name="close" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalText}>News Alert</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.detailtext}>{text}</Text>
              <View style={styles.datecontainer2}>
                <Icon name="calendar" size={17} color="black" />
                <Text style={styles.date}>{date}</Text>
              </View>
              <Text style={styles.detailtext2}>{description}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SingleNews;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cb0a36',
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 7 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderColor: 'black',
    elevation: 14,
    width: '108%',
    marginLeft: -14,
  },
  text: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 5,
    marginLeft: 10,
  },
  date1: {
    color: 'white',
    marginLeft: 5,
  },
  date: {
    color: 'black',
    marginLeft: 5,
    fontSize: 14,
  },
  datecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
  },
  datecontainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 11,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 110,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#cb0a36',
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
  },
  closebtn: {
    marginLeft: 10,
  },
  detailtext: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  detailtext2: {
    fontSize: 15,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
  },
});
