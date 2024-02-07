import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import { COLORS, FONTS,  icons } from '../constants';
import { IconTextButton, } from '../components';
import { HeaderBar, } from '../components';

const krakenApiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
const krakenApiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';

const Order = () => {
  const [pair, setPair] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [volume, setVolume] = useState('');
  const [response, setResponse] = useState('');
  const [orderId, setOrderId] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [orderIdError, setOrderIdError] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [apiError, setApiError] = useState('');
  const [paramError, setParamError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);

  const validateInput = () => {
    if (isNaN(parseFloat(price)) || isNaN(parseFloat(volume))) {
      throw new Error('Price and volume must be valid numbers.');
    }
    if (parseFloat(price) <= 0 || parseFloat(volume) <= 0) {
      throw new Error('Price and volume must be positive numbers.');
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      // Validate the input
      validateInput();
      const nonce = Date.now();
      const postData = `pair=${pair}&type=${type}&ordertype=limit&price=${price}&volume=${volume}`;
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + postData)
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/AddOrder', `nonce=${nonce}&${postData}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order placed successfully');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Network error or timeout
        setNetworkError('Network error or timeout');
      } else if (error.response && error.response.status === 401) {
        // Invalid or missing API key or secret
        setApiError('Invalid or missing API key or secret');
      } else if (error.response && error.response.status === 400) {
        // Invalid or missing parameters
        setParamError('Invalid or missing parameters');
      } else if (error.request) {
        // The request was made but no response was received
        setResponse('Error: No response received from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setResponse(`Error: ${error.message}`);
      }
      setFailure('Failed to place the order');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setNetworkError('');
    setApiError('');
    setParamError('');
    setFailure('');
    // Call the function that failed again
    placeOrder();
  };

  const editOrder = async (orderId) => {
    // Validate the orderId input
    if (!/^[0-9]+$/.test(orderId)) {
      setOrderIdError('Invalid order ID');
      return;
    }

    setLoading(true);
    try {
      // Validate the input
      validateInput();
      const nonce = Date.now();
      const postData = `pair=${pair}&type=${type}&ordertype=limit&price=${price}&volume=${volume}`;
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + postData)
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/EditOrder', `nonce=${nonce}&${postData}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order placed successfully');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Network error or timeout
        setNetworkError('Network error or timeout');
      } else if (error.response && error.response.status === 401) {
        // Invalid or missing API key or secret
        setApiError('Invalid or missing API key or secret');
      } else if (error.response && error.response.status === 400) {
        // Invalid or missing parameters
        setParamError('Invalid or missing parameters');
      } else if (error.request) {
        // The request was made but no response was received
        setResponse('Error: No response received from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setResponse(`Error: ${error.message}`);
      }
      setFailure('Failed to place the order');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    // Validate the orderId input
    if (!/^[0-9]+$/.test(orderId)) {
      setOrderIdError('Invalid order ID');
      return;
    }

    setLoading(true);
    try {
      // Validate the input
      validateInput();
      const nonce = Date.now();
      const postData = `pair=${pair}&type=${type}&ordertype=limit&price=${price}&volume=${volume}`;
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + postData)
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/CancelOrder', `nonce=${nonce}&${postData}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order placed successfully');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Network error or timeout
        setNetworkError('Network error or timeout');
      } else if (error.response && error.response.status === 401) {
        // Invalid or missing API key or secret
        setApiError('Invalid or missing API key or secret');
      } else if (error.response && error.response.status === 400) {
        // Invalid or missing parameters
        setParamError('Invalid or missing parameters');
      } else if (error.request) {
        // The request was made but no response was received
        setResponse('Error: No response received from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setResponse(`Error: ${error.message}`);
      }
      setFailure('Failed to place the order');
    } finally {
      setLoading(false);
    }
  };

  const cancelAllOrders = async () => {
    setLoading(true);
    try {
      // Validate the input
      validateInput();
      const nonce = Date.now();
      const postData = `pair=${pair}&type=${type}&ordertype=limit&price=${price}&volume=${volume}`;
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + postData)
        .digest('hex');

      const response = await axios.post('https://api.kraken.com/0/private/CancelAll', `nonce=${nonce}&${postData}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order placed successfully');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Network error or timeout
        setNetworkError('Network error or timeout');
      } else if (error.response && error.response.status === 401) {
        // Invalid or missing API key or secret
        setApiError('Invalid or missing API key or secret');
      } else if (error.response && error.response.status === 400) {
        // Invalid or missing parameters
        setParamError('Invalid or missing parameters');
      } else if (error.request) {
        // The request was made but no response was received
        setResponse('Error: No response received from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setResponse(`Error: ${error.message}`);
      }
      setFailure('Failed to place the order');
    } finally {
      setLoading(false);
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
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.black,}}>
      <View style={{flex: 1, backgroundColor: COLORS.black, marginLeft: 25, marginRight: 25,}}>
      {/* Header */}
      <HeaderBar title={'Trade'}/>
      <TextInput
          placeholder="Order ID (Used for Edit & Cancel Order)"
          onChangeText={setOrderId}
          value={orderId}
          style={{backgroundColor: COLORS.white, height: 40, marginTop: 20, borderRadius: 5,}}
          error={orderIdError}/>
      {orderIdError && <Text style={{color: 'red', ...FONTS.h3, fontSize: 12,}}>{orderIdError}</Text>} 
      <TextInput 
        placeholder="Pair" 
        onChangeText={text => setPair(text.toUpperCase())} 
        value={pair} 
        style={{backgroundColor: COLORS.white, height: 40, marginTop: 10, borderRadius: 5,}}/> 
      <TextInput 
        placeholder="Type (buy/sell)" 
        onChangeText={setType} 
        value={type} 
        style={{backgroundColor: COLORS.white, height: 40, marginTop: 10, borderRadius: 5,}}/> 
      <TextInput 
        placeholder="Price" 
        onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))} 
        value={price} 
        style={{backgroundColor: COLORS.white, height: 40, marginTop: 10, borderRadius: 5,}}/> 
      <TextInput 
        placeholder="Volume" 
        onChangeText={text => setVolume(text.replace(/[^0-9.]/g, ''))} 
        value={volume} 
        style={{backgroundColor: COLORS.white, height: 40, marginTop: 10, borderRadius: 5,}}/> 
      <ScrollView style={{ backgroundColor: COLORS.black, height: 110, marginTop: 10, }}>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 75, marginRight: 75,}}>
          <IconTextButton 
            label="Place Order" 
            icon={icons.placeOrder} 
            containerStyle={{flex: 1, height: 50,}} 
            onPress={async () => { 
              try { 
                await placeOrder(); 
                setResponse('Order placed successfully.'); 
              } catch (error) { 
                setResponse(error.message); 
              } 
            }}/> 
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 75, marginRight: 75,}}> 
          <IconTextButton 
            label="Edit Order" 
            icon={icons.editOrder} 
            containerStyle={{flex: 1, height: 50,}} 
            onPress={async () => { 
              try { 
                await editOrder(orderId); 
                setResponse('Order edited successfully.'); 
              } catch (error) { 
                setResponse(error.message); 
              } 
            }}/> 
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 75, marginRight: 75,}}>
          <IconTextButton 
            label="Cancel Order" 
            icon={icons.cancelOrder} 
            containerStyle={{flex: 1, height: 50,}} 
            onPress={async () => { 
              try { 
                await cancelOrder(orderId); 
                setResponse('Order cancelled successfully.'); 
              } catch (error) { 
                setResponse(error.message); 
              } 
            }}/> 
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 75, marginRight: 75,}}>
          <IconTextButton 
            label="Cancel All Orders" 
            icon={icons.cancelOrder} 
            containerStyle={{flex: 1, height: 50,}} 
            onPress={async () => { 
              try { 
                await cancelAllOrders(); 
                setResponse('All orders cancelled successfully.'); 
              } catch (error) { 
                setResponse(error.message); 
              } 
            }}/> 
        </View>
      </ScrollView>
      <Text style={{color: 'green', ...FONTS.h3, fontSize: 14, textAlign: 'center'}}>{response}</Text> 
    </View>
    </View>
  );
};

export default Order;