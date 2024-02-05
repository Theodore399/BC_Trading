import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, } from 'react-native';
import { IconTextButton } from '../components';
import { COLORS, icons } from '../constants';
import axios from 'axios';
import crypto from 'crypto-js';

const krakenApiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
const krakenApiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';

const signRequest = (method, secret, data) => {
  try {
    const message = `${method}\n${JSON.stringify(data)}`;
    const key = Buffer.from(secret, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('base64');
  } catch (error) {
    console.error('Error signing request:', error);
  }
};

const Deposit = ({ navigation }) => {
  const [depositAddress, setDepositAddress] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [depositMethods, setDepositMethods] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  const assets = ['BTC', 'ETH', 'LTC', 'BCH'];

  const fetchDepositMethods = async () => {
    try {
      const response = await axios.post(
        'https://api.kraken.com/0/private/GetDepositMethods',
        {
          asset: selectedAsset,
        },
        {
          headers: {
            'API-Key': krakenApiKey,
            'API-Sign': signRequest(
              'GetDepositMethods',
              krakenApiSecret,
              {
                asset: selectedAsset,
              }
            ),
          },
        }
      );

      if (response.data && response.data.result) {
        setDepositMethods(response.data.result.methods);
      } else {
        console.log('Desired asset not found');
        setDepositMethods([]);
      }
    } catch (error) {
      console.error('Error fetching deposit methods:', error);
      toast.error('Error fetching deposit methods. Please try again later.', { position: toast.POSITION.BOTTOM_CENTER });
      setDepositMethods([]);
    }
  };

  const getDepositAddress = async () => {
    if (depositMethods.length > 0) {
      const method = depositMethods[0];
      try {
        const response = await axios.post(
          'https://api.kraken.com/0/private/DepositAddresses',
          {
            asset: selectedAsset,
            method: method.method,
          },
          {
            headers: {
              'API-Key': krakenApiKey,
              'API-Sign': signRequest(
                'DepositAddresses',
                krakenApiSecret,
                {
                  asset: selectedAsset,
                  method: method.method,
                }
              ),
            },
          }
        );

        if (response.data && response.data.result) {
          setDepositAddress(response.data.result[method.method]);
        } else {
          console.log('Failed to get deposit address');
        }
      } catch (error) {
        console.error('Error fetching deposit address:', error);
        toast.error('Error fetching deposit address. Please try again later.', { position: toast.POSITION.BOTTOM_CENTER });
      }
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.post(
        'https://api.kraken.com/0/private/Deposits',
        {
          asset: selectedAsset,
          method: 'all',
        },
        {
          headers: {
            'API-Key': krakenApiKey,
            'API-Sign': signRequest(
              'Deposits',
              krakenApiSecret,
              {
                asset: selectedAsset,
                method: 'all',
              }
            ),
          },
        }
      );
  
      if (response.data && response.data.result) {
        setDeposits(response.data.result);
      } else {
        console.log('Failed to fetch deposits');
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Error fetching deposits. Please try again later.', { position: toast.POSITION.BOTTOM_CENTER });
    }
  };
  
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
    getSystemStatus();
    fetchDepositMethods();
    fetchDeposits();
  }, [selectedAsset]);

  const handleInputChange = (inputValue) => {
    // Check if the input is a valid asset
    if (assets.includes(inputValue)) {
      setSelectedAsset(inputValue);
    } else {
      // Show an alert or a toast message to inform the user of the invalid input
      toast.error('Please select a valid asset.', { position: toast.POSITION.BOTTOM_CENTER });
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
      <Text style={{ fontSize: 16 }}>{item.amount}</Text>
      <Text style={{ fontSize: 12, color: COLORS.gray }}>{item.status}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ padding: 20 }}>
        <IconTextButton
          label='Back'
          icon={icons.back}
          containerStyle={{flex: 1, height: 50, backgroundColor: 'red', color: 'white', marginBottom: 20,}}
          onPress={() => {
            console.log('Back...');
            navigation.goBack();
        }}/>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Deposits</Text>
        <TextInput
          style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.gray, paddingBottom: 10 }}
          placeholder="Enter asset (ex. 'BTC', 'ETH', 'LTC', 'BCH', etc...)"
          onChangeText={handleInputChange}
          value={selectedAsset}
        />
        <Text style={{ marginTop: 20, fontSize: 16 }}>Deposit Methods:</Text>
        <Text style={{ fontSize: 14, color: COLORS.gray }}>{depositMethods[0]?.method}</Text>
        <Text style={{ marginTop: 20, fontSize: 16 }}>Deposit Address:</Text>
        <Text style={{ fontSize: 14, color: COLORS.gray }}>{depositAddress}</Text>
      </View>
      <FlatList
        data={deposits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ padding: 20 }}
        ListEmptyComponent={deposits && deposits.length === 0 ? <Text>No deposits found.</Text> : null}
      />
      {depositMethods.length > 0 && (
        <IconTextButton
          label='Get Deposit Address'
          icon={icons.deposit}
          containerStyle={{flex: 1, height: 50, backgroundColor: 'red', color: 'white', marginTop: 20,}}
          onPress={() => {
            console.log('Get Deposit Address...');
            getDepositAddress();
          }}
        />
      )}
    </View>
  );
};

export default Deposit;