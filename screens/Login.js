import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Main } from './';
import { COLORS } from '../constants';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

{/* Deriv API */}
// import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import DerivAPI from '@deriv/deriv-api';
// import derivDerivApi from 'https://cdn.skypack.dev/@deriv/deriv-api';

const APP_ID = 52558
const API_BASE_URL = 'https://oauth.deriv.com/oauth2/';
const CONNETION = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);

        // const api = new DerivAPI({ CONNETION });



// const tickStream = () => api.subscribe({ ticks: 'R_100' });


TOKEN = '';
USER = '';

const Login = ({ navigation }) => {
    const [url, setUrl] = useState();

    const isFocused = useIsFocused(); // Determine if the component is focused

    // Add state to manage the WebView URL
    const [webViewUrl, setWebViewUrl] = useState(''); // Initialize with an empty string

    const socket = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);

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
          setUrl(`https://api.kraken.com/0/oauth2/authorize?client_id=${krakenClientId}&response_type=code&redirect_uri=${krakenRedirectUri}&scope=public%20private`);
        }
      };

    // Function to reset the WebView URL
    const resetWebViewUrl = () => {
        const params = new URLSearchParams();
        params.append('app_id', APP_ID);

        const authorizeUrl = `${API_BASE_URL}/authorize?${params.toString()}`;
        setUrl(authorizeUrl);
        setWebViewUrl(authorizeUrl); // Set the WebView URL to the initial login URL
    };

    // Function to check user token
    const checkUserToken = async () => {
        const userToken = await AsyncStorage.getItem('@UserToken:key');
        if (userToken) {
            console.log(userToken);
            navigation.navigate('Home');
        } else {
            console.log('User is not logged in');
        }
    };

    const _connectionDerivApi = async (token) => {
        const CONNETION = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);

        CONNETION.onopen = function (e) {
            console.log('[open] Connection established');
            console.log('Sending to server');
            const sendMessage = JSON.stringify({ "authorize": token });
            CONNETION.send(sendMessage);
        };

        let user_data ;
    
        CONNETION.onmessage = function (event) {
            user_data = JSON.stringify(event.data);
        };

        await this._storeUser(user_data);
        console.log(`[message] Data received from server: ${user_data}`);

    };

    const _openConnectionDerivApi = async () => {
        socket.onopen = function (e) {
          console.log('[open] Connection established');
          console.log('Sending to server');
          const sendMessage = JSON.stringify({ ping: 1 });
          socket.send(sendMessage);
        };
    };

    const _closeConnectionDerivApi = async () => {
        socket.onclose = function (event) {
          if (event.wasClean) {
            consloe.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            console.log('[close] Connection died');
          }
        };
    };

    _storeToken = async (token) =>  {
        await AsyncStorage.setItem(
            '@UserToken:key',
            token,
        );

        return 1;
    };

    _storeUser = async (user) =>  {
        alert(user);
        await AsyncStorage.setItem(
            '@UserData:key',
            user,
        );

        return 1;
    };

    _retrieveToken = async () => {
        const value = await AsyncStorage.getItem('@UserToken:key');
        return value;
    };

    _retrieveUser = async () => {
        const value = await AsyncStorage.getItem('@UserData:key');
        return value;
    };

    const handleWebViewNavigationStateChange = (navState) => {
        const { url } = navState;
        const url_string = navState.url;
        
        if (url.includes('&token1=')) {
            console.log(url_string);
            const token = url_string.split('&token1=')[1].split('&')[0];
            console.log(token);
            this._storeToken(token);

            

            _connectionDerivApi(token);

            // const params = new URLSearchParams();
            // params.append('app_id', APP_ID);
        
            // setWebViewUrl(url); // Reset the WebView URL to the initial login URL

            // resetWebViewUrl();
            // setUrl(`${API_BASE_URL}/authorize?${params.toString()}`);

            setTimeout(() => {
                // console.log(3,user_data);
                navigation.navigate('Home');
            }, 1000);

            // navigation.navigate('Home'); 
        } 
    };

    function login () {
        const params = new URLSearchParams();
        params.append('app_id', APP_ID);
    
        const authorizeUrl = `${API_BASE_URL}/authorize?${params.toString()}`;
        
        return (
                <WebView
                        source={{ uri: authorizeUrl }}
                        style={{
                            flex: 1,
                            marginTop: 0,
                            marginBottom: -2170
                        }}
                        allowFileAccessFromFileURLs={true}
                        domStorageEnabled={true}
                        allowFileAccess={true}
                        allowUniversalAccessFromFileURLs={true}
                        originWhitelist={['*']}
                        onShouldStartLoadWithRequest={() => true}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                />
            )
        
    }

    return (
        <Main>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}>

                {/* Login */}
                {webViewUrl ? ( // Only render the WebView if webViewUrl is not empty
                    <WebView
                        source={{ uri: url }}
                        style={{
                            flex: 1,
                            marginTop: 0,
                            marginBottom: -2170
                        }}
                        allowFileAccessFromFileURLs={true}
                        domStorageEnabled={true}
                        allowFileAccess={true}
                        allowUniversalAccessFromFileURLs={true}
                        originWhitelist={['*']}
                        onShouldStartLoadWithRequest={() => true}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                    />
                ) : null}
                
                {/* {login()} */}
                
            </View>
        </Main>
    )
}

export default (Login);
