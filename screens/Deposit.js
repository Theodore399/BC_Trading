import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, } from 'react-native';
import { Main } from './';
import { IconTextButton, } from '../components';
import { HeaderBar, } from '../components';
import { SIZES, COLORS, FONTS,  icons } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';


const Deposit = ({ navigation }) => {
    // Function to check user token
    const checkUserToken = async () => {
        const userToken = await AsyncStorage.getItem('@UserToken:key');
        if (userToken) {
        console.log(`User is logged in with token: ${userToken}`);
        } else {
        console.log('User is not logged in');
        // Navigate to Login screen
        navigation.navigate('Login');
        }
    };

    useEffect(() => {
        checkUserToken();
    }, []);

    const [amount, setAmount] = useState('');

    const handleDepositSubmit = async () => {
        const updatedProposeData = {
            mt5_deposit: 1,
            from_mt5: "MTR1000",
            to_binary: "CR100001",//This will be users details
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
                        title={'Deposit'}
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
                            }}>You may enter your desired Deposit below:</Text>
                    </View>

                    {/* Status Bar */}
                <StatusBar backgroundColor={"black"} style="light" />

                {/* Input */}
                <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter Amount to Deposit"
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
                        label='Submit Deposit'
                        icon={icons.update}
                        containerStyle={{
                            flex: 1,
                            height: 40
                        }}
                        onPress={handleDepositSubmit}
                    />
                </View>            


                </View>
            </ScrollView>


                

                {/* Trading View */}
                {/* <View
                    style={{
                        marginTop: 30,
                        marginBottom: 80,
                        height: 367,
                        width: SIZES.width
                    }}
                >

                </View> */}
            {/* </View> */}
        </Main>
    )
}

export default Deposit;
