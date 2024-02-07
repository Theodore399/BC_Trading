import React, { useEffect, useState, } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconTextButton, } from '../components';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SIZES } from '../constants';
import { makeRedirectUri, } from 'expo-auth-session';

{/* Kraken API */}
const krakenApiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
const krakenApiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';
const krakenOAuthUrl = 'https://api.kraken.com/0/oauth2/token';
const krakenClientId = 'AA18%N84G%FLCP%BIUY';
const krakenRedirectUri = makeRedirectUri({ native: 'trading://' });
const krakenGrantType = 'authorization_code';

// Generate API-Sign
const generateApiSign = (apiSecret, apiKey, payload) => {
  const message = `${apiKey}${JSON.stringify(payload)}`;
  const secretBuffer = Buffer.from(apiSecret, 'base64');
  const hash = crypto.createHmac('sha512', secretBuffer);
  hash.update(message);
  const apiSign = hash.digest('base64');
  return apiSign;
};

// Fetch with Kraken Auth
const fetchWithKrakenAuth = async (endpoint, payload, method = 'POST') => {
  const apiKey = krakenApiKey; // Replace with your Kraken API key
  const apiSecret = krakenApiSecret; // Replace with your Kraken API secret

  const nonce = Date.now();
  const payloadWithNonce = { ...payload, nonce };
  const apiSign = generateApiSign(apiSecret, apiKey, payloadWithNonce);

  const headers = {
    'API-Key': apiKey,
    'API-Sign': apiSign,
  };

  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn('Access token not found in AsyncStorage');
      throw new Error('Access token not found in AsyncStorage');
    }
  } catch (error) {
    console.error('Error retrieving access token from AsyncStorage:', error);
    // Handle the case where the access token is not present in AsyncStorage
    setError('Access token not found in AsyncStorage. Please log in again.');
    navigation.navigate('Login');
  }

  const url = `https://api.kraken.com/0/${endpoint}`;

  try {
    const response = await axios({
      method,
      url,
      data: payloadWithNonce,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
};

// Fetch data with Kraken Auth
const fetchDataWithKrakenAuth = async () => {
  const endpoint = 'private/Balance';
  const payload = {};

  try {
    const data = await fetchWithKrakenAuth(endpoint, payload);
    console.log('Fetched data with Kraken auth:', data);
  } catch (error) {
    console.error('Error fetching data with Kraken auth:', error);
  }
};

const Login = ({ navigation }) => {
  const [url, setUrl] = useState('https://www.kraken.com/sign-in');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;

    if (url.includes('?error=')) {
      const errorMessage = url.split('?error=')[1];
      setError(`An error occurred: ${errorMessage}`);
      setLoading(false);
    } else if (url.includes('?code=')) {
      const authorizationCode = url.split('?code=')[1];
      setLoading(true);

      try {
        const response = await fetch(krakenOAuthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: krakenGrantType,
            code: authorizationCode,
            redirect_uri: krakenRedirectUri,
            client_id: krakenClientId,
            client_secret: krakenApiSecret,
          }),
        });

        if (!response.ok) {
          throw new Error('An error occurred while retrieving the access token.');
        }

        const data = await response.json();
        AsyncStorage.setItem('accessToken', data.access_token);
        fetchDataWithKrakenAuth()
        setLoading(false);
        navigation.navigate('Home');
      } catch (error) {
        console.log('Error:', error);
        setError(`An error occurred: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const retryAuthentication = () => {
    setError(null);
    setUrl(`https://api.kraken.com/0/oauth2/authorize?client_id=${krakenClientId}&response_type=code&redirect_uri=${krakenRedirectUri}&scope=public%20private`);
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        console.log('User logged in successfully');
        console.log(accessToken);
        navigation.navigate('Home');
      } else {
        console.log('User is not logged in');
        navigation.navigate('Home');
        //setUrl(`https://api.kraken.com/0/oauth2/authorize?client_id=${krakenClientId}&response_type=code&redirect_uri=${krakenRedirectUri}&scope=public%20private`);
      }
    };

    getAccessToken();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor={'transparent'} style={'dark'} />
      <View style={{ marginTop: 40, height: 700, width: SIZES.width }}>
        {error && (
          <View style={{ backgroundColor: 'red', padding: 10, marginBottom: 10 }}>
            <Text style={{ color: 'black' }}>{error}</Text>
            <IconTextButton
              label='Retry'
              icon={icons.retry}
              containerStyle={{flex: 1, height: 50, backgroundColor: 'red', color: 'white',}}
              onPress={() => {
                console.log('Clicked on Retry');
                retryAuthentication();
              }}/>
          </View>
        )}
        {loading && <ActivityIndicator size="large" color="blue" />}
        <WebView
          source={{ uri: url }}
          style={{ flex: 1, marginTop: 0 }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      </View>
    </View>
  );
};

export default Login;
