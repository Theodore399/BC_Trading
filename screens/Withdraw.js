import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { IconTextButton } from '../components';
import axios from 'axios';
import crypto from 'crypto-js';
import { COLORS, icons } from '../constants';

const krakenApiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
const krakenApiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';
const maxRequestsPerMinute = 60; // maximum number of requests per minute

const Withdraw = ({ navigation }) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawFee, setWithdrawFee] = useState(0);
  const [withdraws, setWithdraws] = useState([]);
  const [withdrawalRequestId, setWithdrawalRequestId] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const apiKey = krakenApiKey;
  const apiSecret = krakenApiSecret;

  const signRequest = (path, data, nonce) => {
    const message = nonce + JSON.stringify(data);
    const signature = crypto.HmacSHA256(message, apiSecret).toString();
    return { url: `https://api.kraken.com${path}`, headers: { 'API-Key': apiKey, 'API-Sign': signature } };
  };

  // Function to fetch withdrawal information
  const fetchWithdrawInfo = async () => {
    try {
      const response = await axios.get('/0/private/WithdrawInfo', { params: { asset: selectedAsset } });
      setWithdrawFee(response.data.fee);
    } catch (error) {
      console.error('Error fetching withdraw info:', error);
    }
  };

  // Function to fetch withdrawal requests
  const fetchWithdraws = async () => {
    try {
      const response = await axios.post('/0/private/WithdrawHistory', { asset: selectedAsset }, signRequest('/0/private/WithdrawHistory', { asset: selectedAsset }, Date.now()));
      setWithdraws(response.data);
    } catch (error) {
      console.error('Error fetching withdraws:', error);
    }
  };

  const handleInputChange = (text) => {
    setSelectedAsset(text);
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
      <Text style={{ fontSize: 16 }}>{item.amount}</Text>
      <Text style={{ fontSize: 12, color: COLORS.gray }}>{item.status}</Text>
    </View>
  );

  // Function to handle withdrawal
  const handleWithdraw = async () => {
    if (!selectedAsset) {
      Alert.alert('Error', 'Please select an asset.', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    if (!withdrawAddress) {
      Alert.alert('Error', 'Please enter a withdraw address.', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    const withdrawAmountNumber = parseFloat(withdrawAmount);
    if (isNaN(withdrawAmountNumber) || withdrawAmountNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid withdrawal amount.', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    if (withdrawAmountNumber > availableBalance[selectedAsset]) {
      Alert.alert('Error', `Insufficient balance. Available balance: ${availableBalance[selectedAsset]}`, [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    if (withdrawAmountNumber < withdrawalFee) {
      Alert.alert('Error', `Withdrawal amount must be greater than the withdrawal fee: ${withdrawalFee}`, [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    if (Date.now() - lastRequestTime < 1000 * 60 / maxRequestsPerMinute) {
      Alert.alert('Error', 'Please wait 1 second before submitting another request.', [{ text: 'OK', onPress: () => {} }]);
      return;
    }
  
    setIsWithdrawing(true);
    setLastRequestTime(Date.now());
  
    try {
      // Check user balance
      const balanceResponse = await axios.post('/0/private/Balance', {}, signRequest('/0/private/Balance', {}, Date.now()));
      const balance = balanceResponse.data.result[selectedAsset].free;
      if (withdrawAmountNumber > balance) {
        Alert.alert('Error', 'Insufficient balance.', [{ text: 'OK', onPress: () => {} }]);
        return;
      }
  
      setWithdrawInProgress(true);
      const nonce = new Date().getTime();
      const path = '/0/private/Withdraw';
      const data = {
        asset: selectedAsset,
        key: apiKey,
        amount: withdrawAmountNumber,
        fee,
        address: withdrawAddress,
        nonce,
      };
      const signedRequest = signRequest(path, data, nonce);
  
      const response = await fetch(signedRequest.url, {
        method: 'POST',
        headers: signedRequest.headers,
        body: JSON.stringify(signedRequest.data),
      });
      const jsonResponse = await response.json();
  
      if (jsonResponse.error && jsonResponse.error.length > 0) {
        setWithdrawInProgress(false);
        Alert.alert('Error', jsonResponse.error[0], [{ text: 'OK', onPress: () => {} }]);
        return;
      }
  
      setWithdrawAddress('');
      setWithdrawAmount('');
      setWithdrawalRequestId(jsonResponse.result.refid);
      fetchWithdraws();
      Alert.alert('Success', 'Withdrawal request submitted successfully.', [{ text: 'OK', onPress: () => {} }]);
    } catch (error) {
      setWithdrawInProgress(false);
      Alert.alert('Error', 'An error occurred while submitting the withdrawal request.', [{ text: 'OK', onPress: () => {} }]);
    }
  };

  // Function to check withdrawal status
  const checkWithdrawalStatus = async (txid) => {
    try {
      const response = await axios.post('/0/private/QueryOrders', { txid }, signRequest('/0/private/QueryOrders', { txid }, Date.now()));
      return response.data.result[0].status;
    } catch (error) {
      console.error('Error checking withdrawal status:', error);
      return 'error';
    }
  };

  // Function to cancel withdrawal
  const cancelWithdrawal = async () => {
    const status = await checkWithdrawalStatus(withdrawalRequestId);
    if (status === 'open') {
      try {
        // Check that the user is authorized to cancel the withdrawal request
        const userResponse = await axios.post('/0/private/Balance', {}, signRequest('/0/private/Balance', {}, Date.now()));
        const user = userResponse.data.result.XBT.free;
        if (user === 0) {
          Alert.alert('Error', 'You are not authorized to cancel this withdrawal request.', [{ text: 'OK', onPress: () => {} }]);
          return;
        }
  
        const nonce = Date.now();
        const path = '/0/private/Cancel';
        const data = {
          txid: withdrawalRequestId,
          key: apiKey,
          nonce,
        };
        const signedRequest = signRequest(path, data, nonce);
  
        const response = await fetch(signedRequest.url, {
          method: 'POST',
          headers: signedRequest.headers,
          body: JSON.stringify(signedRequest.data),
        });
        const jsonResponse = await response.json();
  
        if (jsonResponse.error && jsonResponse.error.length > 0) {
          Alert.alert('Error', jsonResponse.error[0], [{ text: 'OK', onPress: () => {} }]);
          return;
        }
  
        setWithdrawalRequestId('');
        fetchWithdraws();
        Alert.alert('Success', 'Withdrawal request cancelled successfully.', [{ text: 'OK', onPress: () => {} }]);
      } catch (error) {
        Alert.alert('Error', 'An error occurred while cancelling the withdrawal request.', [{ text: 'OK', onPress: () => {} }]);
      }
    } else {
      Alert.alert('Error', 'The withdrawal request is already processed or cancelled.', [{ text: 'OK', onPress: () => {} }]);
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
    fetchWithdrawInfo();
    fetchWithdraws();
  }, [selectedAsset]);

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
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Withdraw</Text>
        <TextInput
          style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.gray, paddingBottom: 10 }}
          placeholder="Enter asset (ex. 'BTC', 'ETH', 'LTC', 'BCH', etc...)"
          onChangeText={handleInputChange}
          value={selectedAsset}
        />
        <Combobox
          data={assets}
          value={selectedAsset}
          onChange={handleInputChange}
          placeholder="Select asset"
          style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.gray, paddingBottom: 10 }}
          accessibilityLabel="Asset selection input"
          accessibilityHint="Select an asset to fetch deposit methods and deposit address"
          accessibilityRole="combobox"
          accessibilityState={{ expanded: false }}/>
        <Text style={{ marginTop: 20, fontSize: 16 }}>Withdraw Address:</Text>
        <TextInput
          style={{ marginTop: 5, borderWidth: 1, borderColor: COLORS.gray, padding: 10, height: 40 }}
          placeholder="Enter withdraw address"
          onChangeText={setWithdrawAddress}
          value={withdrawAddress}
        />
        <Text style={{ marginTop: 5, fontSize: 16 }}>Withdraw Amount:</Text>
        <TextInput
          style={{ marginTop: 5, borderWidth: 1, borderColor: COLORS.gray, padding: 10, height: 40 }}
          placeholder="Enter withdraw amount"
          onChangeText={setWithdrawAmount}
          value={withdrawAmount}
        />
        <Text style={{ marginTop: 5, fontSize: 12, color: COLORS.gray }}>Withdraw Fee: {withdrawFee}</Text>
      </View>
      <TouchableOpacity onPress={handleWithdraw} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 }} disabled={isWithdrawing}>
        <Text style={{ color: COLORS.white, fontSize: 16 }}>Withdraw</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={cancelWithdrawal} style={{ backgroundColor: COLORS.red, padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: COLORS.white, fontSize: 16 }}>Cancel Withdrawal</Text>
      </TouchableOpacity>
      {withdraws.length > 0 ? (
        <FlatList
          data={withdraws}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ padding: 20, marginTop: 20 }}
        />
      ) : (
        <Text style={{ padding: 20, marginTop: 20 }}>No withdrawals found.</Text>
      )}
    </View>
  );

};

export default Withdraw;