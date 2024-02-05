import React, { useEffect, useState } from 'react';
import { View, Text, } from 'react-native';
import { connect } from 'react-redux';
import { getHoldings, getCoinMarket, } from '../stores/market/marketActions';
import { BalanceInfo, IconTextButton, } from '../components';
import { SIZES, COLORS, FONTS, icons, } from '../constants';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({myHoldings, navigation}) => {

    const [isMounted, setIsMounted] = useState(false);
    const [systemStatus, setSystemStatus] = useState(null);

    useEffect(() => {
        const checkAccessToken = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                console.log(accessToken);
            } else {
                console.log('User is not logged in');
                //navigation.navigate('Login');
            }
        };
        checkAccessToken();
        setIsMounted(true); // Set isMounted to true after the component has finished mounting

        // Get system status
        const getSystemStatus = async () => {
            try {
                const response = await axios.get('https://api.kraken.com/0/public/SystemStatus');
                setSystemStatus(response.data.result.status);
                console.log(systemStatus);
            } catch (error) {
                console.log(error);
            }
        };
        getSystemStatus();
    }, []);

    if (!isMounted) {
        return null; // Return null while the component is mounting
    }

    function handleView() {
        return (
            <WebView
                source={{uri: 'https://coinmarketcap.com/'}}
                style={{flex: 1, marginTop: 0, marginBottom: -56,}}
                allowFileAccessFromFileURLs={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={() => true}/>
        )
    }

    let totalBalance = myHoldings.reduce((a, b) => a + (b.total || 0), 0)
    let valueChange = myHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0)
    let percChange = valueChange / (totalBalance - valueChange) * 100

    function renderWalletInfoSection() {
        return (
            <View style={{paddingHorizontal: SIZES.padding, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, backgroundColor: COLORS.black,}}>
                {/* Balance Info */}
                <Text style={{marginTop: 60, color: COLORS.white, ...FONTS.largeTitle,}}>Home</Text>
                {/* Balance Info */}
                <BalanceInfo
                    title="Total Balance:"
                    displayAmount={totalBalance}
                    changePct={percChange}
                    containerStyle={{marginTop: SIZES.radius, marginBottom: SIZES.padding,}}/>
                {/* Buttons */}
                <View style={{flexDirection: 'row', marginBottom: -25,}}>
                    <IconTextButton
                        label='Deposit'
                        icon={icons.deposit}
                        containerStyle={{flex: 1, height: 40, marginRight: SIZES.radius,}}
                        onPress={() => {
                            console.log('Deposit page...');
                            navigation.navigate('Deposit');
                        }}/>
                    <IconTextButton
                        label='Withdraw'
                        icon={icons.withdraw}
                        containerStyle={{flex: 1, height: 40,}}
                        onPress={() => {
                            console.log('Withdraw page...');
                            navigation.navigate('Withdraw');
                        }}/>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: COLORS.black,}}>
            {/* Status Bar */}
            <StatusBar backgroundColor={"black"} style="light"/>
            {/* Header - Wallet Info */}
            {renderWalletInfoSection()}
            {/* Trading View */}
            <View style={{marginTop: 30, marginBottom: 80, height: 367, width: SIZES.width,}}>
                {handleView()}
            </View>
        </View>
    )
}

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        coins: state.marketReducer.coins
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy,
            sparkline, priceChangePerc, perPage, page) => {return dispatch(getHoldings(holdings, currency, coinList, orderBy,
                sparkline, priceChangePerc, perPage, page))},
        getCoinMarket: (currency, coinList, orderBy, sparkline,
            priceChangePerc, perPage, page) => {return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline,
                priceChangePerc, perPage, page))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
