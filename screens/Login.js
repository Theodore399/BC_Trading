import React, { useEffect, useState, } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconTextButton, } from '../components';
import { StatusBar } from 'expo-status-bar';
import { SIZES } from '../constants';
import { makeRedirectUri, } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

{/* Redirect Url */}
const useProxy = Platform.select({ default: true, ios: false });
const redirectUri = makeRedirectUri({ useProxy, native: 'trading://' });

{/* Kraken oauth2 authentication API */}
const krakenOAuthUrl = 'https://api.kraken.com/0/oauth2/token';
const krakenClientId = 'AA18%N84G%FLCP%BIUY';
const krakenRedirectUri = redirectUri;
const krakenGrantType = 'authorization_code';

{/* Kraken API */}
const krakenApiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
const krakenApiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';

const Login = ({ navigation }) => {
    {/* Kraken initial sign in page */}
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
          console.log(data.access_token);
          AsyncStorage.setItem('accessToken', data.access_token);
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
      {/* Retrieve access token */}
      const getAccessToken = async () => {
        {/* Retrieving token from AsyncStorage */}
        const accessToken = await AsyncStorage.getItem('accessToken');
        {/* Checking whether the token is valid */}
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
