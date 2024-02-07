import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { IconTextButton } from '../components';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import axios from 'axios';

const Withdraw = ({ navigation }) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [withdrawalAddresses, setWithdrawalAddresses] = useState([]);
  const [withdrawalFees, setWithdrawalFees] = useState(null);
  const [refid, setRefid] = useState('');

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
    getSystemStatus();
  }, [selectedAsset]);

  // Get withdrawal methods
  const getWithdrawalMethods = async () => {
    try {
      const nonce = new Date().getTime();
      const aclass = 'currency';
      const requestBody = {
        nonce,
        asset: selectedAsset,
        aclass
      };
      const response = await axios.post('https://api.kraken.com/0/private/WithdrawMethods', requestBody, {
        headers: {
          'API-Key': apiKey,
          'API-Sign': apiSecret
        }
      });
      setWithdrawalMethods(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Get withdrawal addresses
  const getWithdrawalAddresses = async (method) => {
    try {
      const nonce = new Date().getTime();
      const aclass = 'currency';
      const requestBody = {
        nonce,
        aclass,
        asset: selectedAsset,
        method,
        key: 'active',
        verified: 'yes'
      };
      const response = await axios.post('https://api.kraken.com/0/private/WithdrawAddresses', requestBody, {
        headers: {
          'API-Key': apiKey,
          'API-Sign': apiSecret
        }
      });
      setWithdrawalAddresses(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Get withdrawal fees
  const getWithdrawalFees = async (asset, amount) => {
  try {
    const nonce = new Date().getTime();
    const requestBody = {
      nonce,
      asset,
      key: 'active',
      amount
    };
    const response = await axios.post('https://api.kraken.com/0/private/WithdrawFees', requestBody, {
      headers: {
        'API-Key': apiKey,
        'API-Sign': apiSecret
      }
    });
    setWithdrawalFees(response.data);
    console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Withdraw function
  const makeWithdrawal = async (asset, address, amount, maxFee = '0') => {
    try {
      const nonce = Math.floor(Date.now() / 1000);
      const requestBody = {
        nonce,
        asset,
        key: 'active',
        address,
        amount,
        max_fee: maxFee
      };
      const response = await axios.post('https://api.kraken.com/0/private/Withdraw', requestBody, {
        headers: {
          'API-Key': apiKey,
          'API-Sign': apiSecret
        }
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Cancel Withdraw function
  const cancelWithdrawal = async (asset, refid) => {
    try {
      const nonce = Math.floor(Date.now() / 1000);
      const requestBody = {
        nonce,
        asset,
        refid,
      };
      const response = await axios.post('https://api.kraken.com/0/private/WithdrawCancel', requestBody, {
        headers: {
          'API-Key': apiKey,
          'API-Sign': apiSecret
        }
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Transfer Fund function
  const transferFunds = async (asset, amount) => {
    try {
      const nonce = Math.floor(Date.now() / 1000);
      const requestBody = {
        nonce,
        asset,
        from: 'spot',
        to: 'futures',
        amount,
      };
      const response = await axios.post('https://api.kraken.com/0/private/WalletTransfer', requestBody, {
        headers: {
          'API-Key': apiKey,
          'API-Sign': apiSecret
        }
      });
      console.log(response.data);
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
          <Text style={{fontSize: 20, fontWeight: 'bold',}}>Withdraw</Text>
          <Text style={{fontSize: 14, color: 'green',}}>{systemStatus}</Text>
        </View>
        <TextInput
          style={{ marginTop: 20, borderWidth: 1, borderColor: COLORS.gray, padding: 5, borderRadius: SIZES.radius, }}
          placeholder="Enter asset (ex. 'BTC', 'ETH', 'LTC', 'BCH', etc...)"
          onChangeText={setSelectedAsset}
          value={selectedAsset}
        />
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={getWithdrawalMethods}>
          <Text style={{ color: 'white' }}>Get withdrawal methods</Text>
        </TouchableOpacity>
        {withdrawalMethods.length > 0 && (
          <FlatList
            data={withdrawalMethods}
            keyExtractor={(item) => item.method}
            renderItem={({ item }) => (
              <View>
                <Text>{item.method}</Text>
                <Text>{item.desc}</Text>
                <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={() => getWithdrawalAddresses(item.method)}>
                  <Text style={{ color: 'white' }}>Get withdrawal addresses</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        {withdrawalAddresses.length > 0 && (
          <FlatList
            data={withdrawalAddresses}
            keyExtractor={(item) => item.addr}
            renderItem={({ item }) => (
              <View>
                <Text>{item.addr}</Text>
                <Text>{item.tag}</Text>
              </View>
            )}
          />
        )}
        {withdrawalFees && (
          <Text>
            Withdrawal fee for {selectedAsset} is {withdrawalFees.fee} {withdrawalFees.asset}
          </Text>
        )}
        <TextInput
          style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.gray, paddingBottom: 10 }}
          placeholder="Enter amount to withdraw"
          onChangeText={setWithdrawalAmount}
          value={withdrawalAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={() => getWithdrawalFees(selectedAsset, withdrawalAmount)}>
          <Text style={{ color: 'white' }}>Get withdrawal fee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={() => makeWithdrawal(selectedAsset, withdrawalAddresses, withdrawalAmount)}>
          <Text style={{ color: 'white' }}>Withdraw</Text>
        </TouchableOpacity>
        <TextInput
          style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.gray, paddingBottom: 10 }}
          placeholder="Enter reference ID"
          onChangeText={setRefid}
          value={refid}
        />
        <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={() => cancelWithdrawal(selectedAsset, refid)}>
          <Text style={{ color: 'white' }}>Cancel withdrawal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', marginTop: 20 }} onPress={() => transferFunds(selectedAsset, withdrawalAmount)}>
          <Text style={{ color: 'white' }}>Transfer to Futures wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Withdraw;