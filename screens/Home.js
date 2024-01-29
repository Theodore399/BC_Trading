import React from 'react';
import { View, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { Main } from './';
import { Detail } from './';
import { BalanceInfo, IconTextButton } from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

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

      function handleView () {
        return (
            <WebView
                source={{uri: 'https://coinmarketcap.com/'}}
                style={{
                    flex: 1,
                    marginTop: 0,
                    marginBottom: -56
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

    const [setSelectedCoin] = React.useState(null)

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
                backgroundColor: COLORS.black
                }}
            >
                {/* Balance Info */}
                <Text 
                    style={{
                        marginTop: 60, 
                        color: COLORS.white,
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
                        icon={icons.deposit}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius
                        }}
                        onPress={() => console.log('Transaction Complete')}
                    />
                    <IconTextButton
                        label='Withdraw'
                        icon={icons.withdraw}
                        containerStyle={{
                            flex: 1,
                            height: 40
                        }}
                        onPress={() => console.log('Transaction Complete')}
                    />
                </View>
            </View>
        )
    }

    return (
        <Main>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.black
            }}>
                {/* Status Bar */}
                <StatusBar backgroundColor={"black"} style="light" />
                
                {/* Header - Wallet Info */}
                {renderWalletInfoSection()}

                {/* Trading View */}
                <View
                    style={{
                        marginTop: 30,
                        marginBottom: 80,
                        height: 367,
                        width: SIZES.width
                    }}
                >
                    {handleView()}
                </View>
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