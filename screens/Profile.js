import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, } from 'react-native';
import { Main } from './';
import { IconTextButton, } from '../components';
import { HeaderBar, } from '../components';
import { SIZES, COLORS, FONTS,  icons } from '../constants';

const Profile = ({ containerStyle }) => {

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');

  const handleUpdate = async () => {
    console.log('Updating user details:', { fullname, email, id });
    alert('Profile updated successfully!');
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
            </View>
        </ScrollView>
    </Main>
  );
};

export default Profile;
