import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, } from 'react-native';
import { Main } from './';
import { IconTextButton, } from '../components';
import { HeaderBar, } from '../components';
import { SIZES, COLORS, FONTS,  icons } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';


const Withdraw = ({ navigation }) => {


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

    const [amount, setAmount] = useState('');

    const handleWithdrawSubmit = async () => {
        const updatedProposeData = {
            mt5_deposit: 1,
            from_mt5: "MTR1000",
            to_binary: "CR100001",
            amount: amount,
        };
    };

    return (
        <Main>
            <ScrollView
                style={{ backgroundColor: COLORS.black }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.black
                    }}
                >

                    {/* Home Button */}
                    <View 
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginLeft: 100,
                        marginRight: 100,
                    }}
                    >
                        <IconTextButton
                            label='Back to home'
                            onPress={() => navigation.navigate('Home')}
                            icon={icons.home}
                            containerStyle={{
                                flex: 1,
                                height: 40
                            }}
                        />
                    </View>  

                    {/* Header */}
                    <HeaderBar
                        title={'Withdraw'}
                    />

                    {/* Image */}
                    <View 
                        style={{
                            marginTop: 80,
                            marginBottom: SIZES.radius,
                            marginLeft: 25,
                            marginRight: 25,
                        }}>
                        <Text 
                            style={{
                                color:COLORS.white, 
                                ...FONTS.h3, 
                                fontSize: 18
                            }}>You may enter your desired Withdraw below:</Text>
                    </View>

                    {/* Status Bar */}
                <StatusBar backgroundColor={"black"} style="light" />

                {/* Input */}
                <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter Amount to Withdraw"
                        style={{
                            backgroundColor: COLORS.white,
                            height: 40,
                            marginTop: 20,
                            marginLeft: 25,
                            marginRight: 25,
                            borderRadius: 5,
                        }}
                    />

                {/* Button */}
                <View 
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginLeft: 100,
                        marginRight: 100,
                    }}
                >
                    <IconTextButton
                        label='Submit Withdraw'
                        icon={icons.update}
                        containerStyle={{
                            flex: 1,
                            height: 40
                        }}
                        onPress={handleWithdrawSubmit}
                    />
                </View>            


                </View>
            </ScrollView>
        </Main>
    )
}

export default Withdraw;
