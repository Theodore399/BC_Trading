import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { Main } from './';
import { Detail } from './';
import { BalanceInfo, IconTextButton, Chart } from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';

{/* Deriv API */}
const API_BASE_URL = 'https://oauth.deriv.com/oauth2/';

const REDIRECT_URI = 'localhost:3000/callback'; // Replace with your actual redirect URI

const APP_ID = 52558;

const Home = ({getHoldings, getCoinMarket, myHoldings, coins}) => {

    {/* AuthService */}
    login = () => {
        const params = new URLSearchParams();
        params.append('app_id', APP_ID);
        params.append('redirect_uri', REDIRECT_URI);
    
        const authorizeUrl = `${API_BASE_URL}/authorize?${params.toString()}`;
    
        console.log(authorizeUrl);
        Linking.openURL(authorizeUrl);
      }

      handle = ({item}) => {
        setSelectedCoin(item);
        console.log('Hello there');
      }

      function handleImage () {
        return (
            <WebView
                source={{uri: 'https://www.tradingview.com/?utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=advanced-chart#main-market-summary'}}
                style={{
                    flex: 1,
                    marginTop: 0,
                    marginBottom: -3170
                }}
                allowFileAccessFromFileURLs={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={() => true}/>
        )
      }
    
    // Handle the callback from Deriv's authorization server
    handleCallback = async () => {
        const { code } = new URLSearchParams(window.location.search);
    
        try {
            const response = await axios.post(`${API_BASE_URL}/token`, {
                code,
                client_id: 'your_app_id', // Replace with your app ID
                client_secret: 'your_app_secret', // Replace with your app secret
                redirect_uri: REDIRECT_URI,
            });
    
            const authService = new Auth();
            Auth.setToken(response.data);
            Auth.setUser(response.data);
    
            return response.data;
        } catch (error) {
            throw new Error(error?.message || "Error fetching access token");
        }
    }

    {/* Detail Page */}
    handleDetail = () => {
        Detail()
        console.log('Detail Page')
    }

    const [selectedCoin, setSelectedCoin] = React.useState(null)

    useFocusEffect(
        React.useCallback(() => {
            getHoldings(holdings = dummyData.holdings)
            getCoinMarket()
        }, [])
    )

    let totalBalance = myHoldings.reduce((a, b) => a + (b.total || 0), 0)
    let valueChange = myHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0)
    let percChange = valueChange / (totalBalance - valueChange) * 100

    function renderWalletInfoSection() {
        return (
            <View style={{
                paddingHorizontal: SIZES.padding,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: COLORS.white
                }}
            >
                {/* Balance Info */}
                <Text 
                    style={{
                        marginTop: 60, 
                        color: COLORS.black,
                        ...FONTS.largeTitle
                    }}
                >Home</Text>

                {/* Balance Info */}
                <BalanceInfo
                    title="Total Balance:"
                    displayAmount={totalBalance}
                    changePct={percChange}
                    containerStyle={{
                        marginTop: SIZES.radius,
                        marginBottom: SIZES.padding
                    }}
                />
                {/* Buttons */}
                <View style={{
                    flexDirection: 'row',
                    marginBottom: -25
                    }}
                >
                    <IconTextButton
                        label='Deposit'
                        icon={icons.send}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius
                        }}
                        onPress={() => console.log('Deposit')}
                    />
                    <IconTextButton
                        label='Withdraw'
                        icon={icons.withdraw}
                        containerStyle={{
                            flex: 1,
                            height: 40
                        }}
                        onPress={() => console.log('Withdraw')}
                    />
                </View>
            </View>
        )
    }

    return (
        <Main>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}>
                {/* Testing login button */}

                {/*<TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.white,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    marginTop: 50
                }}
                
                onPress={this.login}
                >
                        
                </TouchableOpacity>*/}

                {/*<WebView
                source={{uri: 'https://www.tradingview.com/widget/advanced-chart/'}}
                style={{
                    flex: 1
                }}
                allowFileAccessFromFileURLs={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={() => true}/>*/}
                
                {/* Header - Wallet Info */}
                {renderWalletInfoSection()}

                {/* Chart */}
                <View
                    style={{
                        marginTop: 30,
                        marginBottom: 80,
                        height: 367,
                        width: SIZES.width
                    }}
                >
                    {handleImage()}
                </View>

                {/* Top Popular Cryptocurrency */}
                
            </View>
        </Main>
    )
}

// export default Home;

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