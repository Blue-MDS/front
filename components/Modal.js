import React, { Children } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import CustomButton from './Button'

export const CustomModal = ({ isVisible, onClose, buttonText, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: 'rgba(80, 80, 80, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold'
  },
})