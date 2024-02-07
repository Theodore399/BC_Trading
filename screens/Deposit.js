import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { IconTextButton } from '../components';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import axios from 'axios';

const Deposit = ({ navigation }) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [depositMethods, setDepositMethods] = useState(null);
  const [depositAddresses, setDepositAddresses] = useState([]);

  const apiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
  const apiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';

  useEffect(() => {
    // Get system status
    const getSystemStatus = async () => {
      try {
        const response = await axios.get('https://api.kraken.com/0/public/SystemStatus');
        setSystemStatus(response.data.result.status);
        console.log(systemStatus);
      } catch (error) {
        console.log(error);
      }
    };

    if (depositMethods) {
      console.log(depositMethods);
    };

    if (depositAddresses) {
      console.log(depositAddresses);
    };

    getSystemStatus();
  }, [selectedAsset, depositMethods, depositAddresses]);

  // Get deposit methods
  const getDepositMethods = async () => {
    try {
      const nonce = Date.now();
      const asset = selectedAsset;
      const aclass = 'currency';

      const requestBody = {
        nonce,
        asset,
        aclass,
      };

      const signature = crypto
        .createHmac('sha512', apiSecret)
        .update(nonce + JSON.stringify(requestBody))
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/DepositMethods', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': apiKey,
          'API-Sign': signature,
        },
      });

      setDepositMethods(response.data.result);
      console.log(depositMethods);
    } catch (error) {
      console.log(error);
    }
  };

  // Get deposit addresses
  const getDepositAddresses = async (method, amount) => {
    try {
      const nonce = Date.now();
      const asset = selectedAsset;

      const requestBody = {
        nonce,
        asset,
        method,
        new: false,
        amount,
      };

      const signature = crypto
        .createHmac('sha512', apiSecret)
        .update(nonce + JSON.stringify(requestBody))
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/DepositAddresses', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': apiKey,
          'API-Sign': signature,
        },
      });

      setDepositAddresses(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  if (systemStatus === null) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ padding: 20 }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 30,}}>
          <IconTextButton
            icon={icons.back}
            containerStyle={{height: 30, backgroundColor: 'white', color: 'black',}}
            onPress={() => {
              console.log('Back...');
              navigation.goBack();
          }}/>
          <Text style={{fontSize: 20, fontWeight: 'bold',}}>Deposit</Text>
          <Text style={{fontSize: 14, color: 'green',}}>{systemStatus}</Text>
        </View>
        <TextInput
          style={{ marginTop: 20, borderWidth: 1, borderColor: COLORS.gray, padding: 5, borderRadius: SIZES.radius, }}
          placeholder="Enter asset (ex. 'BTC', 'ETH', 'LTC', 'BCH', etc...)"
          onChangeText={setSelectedAsset}
          value={selectedAsset}
        />
        <TextInput
          style={{ marginTop: 20, borderWidth: 1, borderColor: COLORS.gray, padding: 5, borderRadius: SIZES.radius, }}
          placeholder="Enter amount to deposit"
          onChangeText={setDepositAmount}
          value={depositAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: COLORS.gray, marginTop: 20, backgroundColor: COLORS.lightGray3, alignSelf: 'center', height: 50, borderRadius: SIZES.radius,}} onPress={getDepositMethods}>
          <Text style={{ color: COLORS.black, marginTop: 13, marginLeft: 5, marginRight: 5,}}>Get Deposit Methods</Text>
        </TouchableOpacity>
        {depositMethods && (
          <FlatList
            data={depositMethods}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View 
                style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray }}
              >
                <Text style={{ fontSize: 18 }}>{item.aclass}</Text>
                <Text style={{ fontSize: 18 }}>{item.methods.length > 0 ? item.methods[0].name : ''}</Text>
                <TouchableOpacity
                  style={{ marginTop: 20, backgroundColor: COLORS.blue, padding: 10 }}
                  onPress={() => {
                    if (depositAmount !== null && depositAmount !== '') {
                      getDepositAddresses(item.methods[0].name, depositAmount);
                    } else {
                      alert('Please enter a deposit amount.');
                    }
                  }}
                >
                  <Text style={{ color: COLORS.black }}>Get Deposit Addresses</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        {depositAddresses && (
          <FlatList
            data={depositAddresses}
            keyExtractor={(item) => item.addr}
            renderItem={({ item }) => (
              <View key={item.addr}>
                <Text>{item.addr}</Text>
                <Text>{item.tag}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Deposit;