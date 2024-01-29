import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, } from 'react-native';
import { Main } from './';
import { IconTextButton, } from '../components';
import { HeaderBar, } from '../components';
import { SIZES, COLORS, FONTS,  icons } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ containerStyle, navigation }) => {

  // Function to check user token
    const checkUserToken = async () => {
        const userToken = await AsyncStorage.getItem('@UserToken:key');
        const userData = await AsyncStorage.getItem('@UserData:key');
        if (userToken) {
        console.log(`User is logged in with token: ${userToken}`);
        console.log(1, userData);

        // User is logged in, you can put additional logic here if needed
        } else {
        console.log('User is not logged in');
        // Navigate to Login screen
        navigation.navigate('Login');
        }
    };

    useEffect(() => {
        checkUserToken();
    }, []);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');

    const handleUpdate = async () => {
        console.log('Updating user details:', { fullname, email, id });
        alert('Profile updated successfully!');
    };

    _removeToken = async () => {
        try {
            await AsyncStorage.removeItem('@UserToken:key');
            console.log('Token removed');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

    const handleLogout = async () => {
        console.log('Updating user details:', { fullname, email, id });
        this._removeToken();
        checkUserToken();
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
                {/* Header */}
                <HeaderBar
                    title={'Profile'}
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
                        }}>You may update your profile account below:</Text>
                </View>

                {/* Username */}
                <TextInput
                    value={fullname}
                    onChangeText={setFullname}
                    placeholder="Enter Fullname"
                    style={{
                        backgroundColor: COLORS.white,
                        height: 40,
                        marginTop: 20,
                        marginLeft: 25,
                        marginRight: 25,
                        borderRadius: 5,
                    }}
                />

                {/* Email */}
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter Email"
                    style={{
                        backgroundColor: COLORS.white,
                        height: 40,
                        marginTop: 10,
                        marginLeft: 25,
                        marginRight: 25,
                        borderRadius: 5,
                    }}
                />

                {/* ID */}
                <TextInput
                    value={id}
                    onChangeText={setId}
                    placeholder="Enter ID"
                    style={{
                        backgroundColor: COLORS.white,
                        height: 40,
                        marginTop: 10,
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
                        label='Update'
                        icon={icons.update}
                        containerStyle={{
                            flex: 1,
                            height: 40
                        }}
                        onPress={handleUpdate}
                    />
                </View>
                <View 
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginLeft: 100,
                        marginRight: 100,
                    }}
                >
                    <IconTextButton
                        label='Logout'
                        containerStyle={{
                            flex: 1,
                            height: 50,
                            backgroundColor: 'red',
                            color: 'white'
                        }}
                        onPress={handleLogout}
                    />
                </View>
            </View>
        </ScrollView>
    </Main>
  );
};

export default Profile;
