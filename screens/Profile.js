import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { Main } from './';
import { HeaderBar } from '../components';
import { FONTS, COLORS, SIZES, dummyData, icons } from '../constants';

const SectionTitle = ({title}) => {
    return (
        <View
            style={{
                marginTop: SIZES.padding
            }}
        >
            <Text
                style={{
                    color: COLORS.lightGray3,
                    ...FONTS.h4
                }}
            >{title}</Text>
        </View>
    )
}

const Setting = ({title, value, type, onPress}) => {
    if (type == 'button') {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center'
                }}
                onPress={onPress}
            >
                <Text
                    style={{
                        flex: 1,
                        color: COLORS.black,
                        ...FONTS.h3
                    }}
                >{title}</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            marginRight: SIZES.radius, 
                            color: COLORS.black, 
                            ...FONTS.h3
                        }}
                    >{value}</Text>
                    <Image
                        source={icons.rightArrow}
                        style={{
                            height: 15,
                            width: 15,
                            tintColor: COLORS.black
                        }}/>
                </View>
            </TouchableOpacity>
        )
    } else {
        return (
            <View></View>
        )
    }
}

const Profile = () => {
    return (
        <Main>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: SIZES.padding,
                    backgroundColor: COLORS.white
                }}
            >
                {/* Header */}
                <View
                style={{
                    height: 100,
                    paddingHorizontal: SIZES.radius,
                    justifyContent: 'flex-end',
                    marginTop: 13,
                    marginLeft: -12
                    }}
                >
                    <Text
                        style={{
                        color: COLORS.black,
                        ...FONTS.largeTitle
                        }}
                    >Profile</Text>
                </View>

                {/* Details */}
                <ScrollView>
                    {/* Email & User ID */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: SIZES.radius
                        }}
                    >
                        {/* Email & ID */}

                        {/* Status */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                source={icons.verified}
                                style={{
                                    height: 25,
                                    width: 25
                                }}
                            />
                            <Text
                                style={{
                                    color: COLORS.lightGreen,
                                    ...FONTS.body4
                                }}
                            >Verified</Text>
                        </View>
                    </View>

                    {/* APP */}
                    <SectionTitle
                        title={'APP'}
                    />

                    <Setting
                        title={'Launch Screen'}
                        value={'Home'}
                        type={'button'}
                        onPress={() => console.log('Pressed')}
                    />

                    <Setting
                        title={'Appearnace'}
                        value={'Dark'}
                        type={'button'}
                        onPress={() => console.log('Pressed')}
                    />

                    {/* ACCOUNT */}
                    <SectionTitle
                        title={'ACCOUNT'}
                    />

                    <Setting
                        title={'Payment'}
                        value={'USD'}
                        type={'button'}
                        onPress={() => console.log('Pressed')}
                    />

                    <Setting
                        title={'Language'}
                        value={'English'}
                        type={'button'}
                        onPress={() => console.log('Pressed')}
                    />

                    {/* OTHER */}
                    <SectionTitle
                        title={'OTHER'}
                    />

                    <Setting
                        title={'Logout'}
                        type={'button'}
                        onPress={() => console.log('Logged out successfully')}
                    />
                </ScrollView>
            </View>
        </Main>
    )
}

export default Profile;