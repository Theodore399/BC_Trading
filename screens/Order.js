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
  
      // Generate a nonce value
      const nonce = Date.now();
  
      // Create the request body schema
      const requestBody = {
        nonce,
        userref: 12345, // replace with a user reference value
        orderType: 'limit',
        type: type,
        volume: volume,
        displayvol: volume, // replace with the display volume value
        pair: pair,
        price: price,
        price2: null, // replace with the value for price2 if applicable
        trigger: null, // replace with the value for trigger if applicable
        leverage: null, // replace with the value for leverage if applicable
        reduce_only: false, // replace with the value for reduce_only if applicable
        stptype: null, // replace with the value for stptype if applicable
        oflags: null, // replace with the value for oflags if applicable
        timeinforce: null, // replace with the value for timeinforce if applicable
        starttm: null, // replace with the value for starttm if applicable
        expiretm: null, // replace with the value for expiretm if applicable
        close: {
          ordertype: null, // replace with the value for close order type if applicable
          price: null, // replace with the value for close price if applicable
          price2: null, // replace with the value for close price2 if applicable
        },
        deadline: null, // replace with the value for deadline if applicable
        validate: true,
      };
  
      // Generate the API signature
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + JSON.stringify(requestBody))
        .digest('hex');
  
      // Send the request to the Kraken API
      const response = await axios.post('https://api.kraken.com/0/private/AddOrder', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
  
      // Process the response from the Kraken API
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order placed successfully');
    } catch (error) {
      // Handle any errors that occur during the request
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
    setLoading(true);
    try {
      // Validate the orderId input
      if (!/^[0-9]+$/.test(orderId)) {
        setOrderIdError('Invalid order ID');
        return;
      }
  
      // Validate the input
      validateInput();
  
      // Generate a nonce value
      const nonce = Date.now();
  
      // Create the request body schema
      const requestBody = {
        nonce,
        userref: 12345, // replace with a user reference value
        txid: orderId,
        volume: volume,
        displayvol: volume, // replace with the display volume value
        pair: pair,
        price: price,
        price2: null, // replace with the value for price2 if applicable
        oflags: null, // replace with the value for oflags if applicable
        deadline: null, // replace with the value for deadline if applicable
        cancel_response: null, // replace with the value for cancel_response if applicable
        validate: true,
      };
  
      // Generate the API signature
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + JSON.stringify(requestBody))
        .digest('hex');
  
      // Send the request to the Kraken API
      const response = await axios.post('https://api.kraken.com/0/private/EditOrder', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
  
      // Process the response from the Kraken API
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order edited successfully');
    } catch (error) {
      // Handle any errors that occur during the request
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
      setFailure('Failed to edit the order');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setLoading(true);
    try {
      // Validate the orderId input
      if (!/^[0-9]+$/.test(orderId)) {
        setOrderIdError('Invalid order ID');
        return;
      }
  
      // Generate a nonce value
      const nonce = Date.now();
  
      // Create the request body schema
      const requestBody = new URLSearchParams();
      requestBody.append('nonce', nonce);
      requestBody.append('txid', orderId);
  
      // Generate the API signature
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce + orderId)
        .digest('hex');
  
      // Send the request to the Kraken API
      const response = await axios.post('https://api.kraken.com/0/private/CancelOrder', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
  
      // Process the response from the Kraken API
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('Order cancelled successfully');
    } catch (error) {
      // Handle any errors that occur during the request
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
      setFailure('Failed to cancel the order');
    } finally {
      setLoading(false);
    }
  };

  const cancelAllOrders = async () => {
    setLoading(true);
    try {
      // Generate a nonce value
      const nonce = Date.now();
  
      // Create the request body schema
      const requestBody = new URLSearchParams();
      requestBody.append('nonce', nonce);
  
      // Generate the API signature
      const signature = crypto
        .createHmac('sha512', krakenApiSecret)
        .update(nonce)
        .digest('hex');
  
      // Send the request to the Kraken API
      const response = await axios.post('https://api.kraken.com/0/private/CancelAllOrders', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'API-Key': krakenApiKey,
          'API-Sign': signature,
        },
      });
  
      // Process the response from the Kraken API
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess('All orders cancelled successfully');
    } catch (error) {
      // Handle any errors that occur during the request
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
      setFailure('Failed to cancel all orders');
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