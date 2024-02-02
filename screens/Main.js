import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { connect } from "react-redux";
import { IconTextButton } from "../components";
import { COLORS, SIZES, icons } from "../constants";

const Main = ({children, isTradeModelVisible}) => {

    const modelAnimatedValue = React.useRef(new Animated.Value(0))
    .current;
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
  

    React.useEffect(() => {
        if (isTradeModelVisible) {
            Animated.timing(modelAnimatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(modelAnimatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start();
        }
    }, [isTradeModelVisible])

    const modelY = modelAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height - 200]
    })

    //const navigation = useNavigation();

    {/*handleBuy = () => {
        navigation.navigate('Currency');
        console.log('Selected (Buy)');
    }*/}

    return (
        <View
            style={{
                flex: 1
            }}
        >{children}
            {isTradeModelVisible && <Animated.View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: COLORS.transparentBlack
            }}
            opacity={modelAnimatedValue}
            />
            }
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: modelY,
                    width: '100%',
                    padding: SIZES.padding,
                    backgroundColor: COLORS.transparentBlack
                }}
            >
                <IconTextButton
                    label='Buy'
                    icon={icons.send}
                    onPress={() => console.log('Deposit')}
                />
                <IconTextButton
                    label='Sell'
                    icon={icons.withdraw}
                    containerStyle={{
                        marginTop: SIZES.base
                    }}
                    onPress={() => console.log('Withdraw')}
                />
            </Animated.View>
        </View>
    )
}

//export default Main;

function mapStateToProps(state) {
    return {
        isTradeModelVisible: state.tabReducer.isTradeModelVisible
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
