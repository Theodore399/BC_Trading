import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Main } from './';
import { COLORS } from '../constants';
import { WebView } from 'react-native-webview';

{/* Deriv API */}
const APP_ID = 52558
const CONNETION = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);
const API_BASE_URL = 'https://oauth.deriv.com/oauth2/';
TOKEN = '';
USER = '';

const Login = ({ navigation }) => {

    // Function to check user token
    const checkUserToken = async () => {
        const userToken = this._retrieveToken();
        if (userToken) {
        console.log(`User is logged in with token: ${userToken}`);
        navigation.navigate('Home');

        } else {
        console.log('User is not logged in');
        }
    };

    useEffect(() => {
        checkUserToken();
    }, []);

    _storeToken = async (token) =>  {
        await AsyncStorage.setItem(
            '@UserToken:key',
            token,
        );

        return 1;
    };

    _storeUser = async (user) =>  {
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
        
        if (url.includes('&token1=')) {
            const token = url.split('&token1=')[1].split('&')[0];
            this.TOKEN = token;

            this._storeToken(token.toString());

            CONNETION.onopen = function (e) {
                console.log('[open] Connection established');
                console.log('Sending to server');
                const sendMessage = JSON.stringify({ "authorize": token });
                CONNETION.send(sendMessage);
            };
        
            CONNETION.onmessage = function (event) {
                // auth.setUser(event.data);
                this.USER = event.data;
                this._storeUser(JSON.stringify(event.data));
                console.log(`[message] Data received from server: ${event.data}`);
            };

            let yessir = this._retrieveToken();
            let yessir2 = this._retrieveUser();

            const timer = setTimeout(() => {
                console.log(yessir);
                console.log(yessir2);
                navigation.navigate('Home'); // Replace 'Profile' with your profile screen name
            }, 1000);
            
        
        } else if (url.includes('?error=')) {
            const errorMessage = url.split('?error=')[1]; // Extract the error message
            alert('Error: ' + errorMessage);
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
                
                {login()}
                
            </View>
        </Main>
    )
}

export default (Login);
