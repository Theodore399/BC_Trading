import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, } from 'react-native';

const DropdownButton = ({ data, onSelect, initialValue }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(initialValue); // Set initial value

  const toggleDropdown = () => setVisible(!visible);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Text style={styles.item}>{item.value}</Text>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.selectedText}>{selected?.value || 'Select an option'}</Text>
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" onRequestClose={toggleDropdown}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.dropdownList}/>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  selectedText: {
    padding: 7,
  },
  dropdownList: {
    backgroundColor: 'white',
    padding: 20,
  },
  item: {
    padding: 10,
  },
});

export default DropdownButton;
