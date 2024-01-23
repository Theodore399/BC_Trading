import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { connect } from 'react-redux';
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { Main } from './';
import { BalanceInfo, IconTextButton, Chart } from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';

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
                
                {/* Header - Wallet Info */}
                {renderWalletInfoSection()}

                {/* Chart */}
                <View
                    style={{
                        marginTop: 50,
                    }}
                />

                <View style={{marginBottom: SIZES.radius}}>
                    <Text style={{
                        color:COLORS.black, 
                        ...FONTS.h3, 
                        fontSize: 18,
                        marginTop: -5,
                        marginLeft: 25
                    }}
                    >Popular Cryptocurrencies</Text>
                </View>

                {/* Top Popular Cryptocurrency */}
                <FlatList
                    data={coins}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: SIZES.padding
                    }}
                    renderItem={({item}) => {

                        let priceColor = (item.
                            price_change_percentage_7d_in_currency == 0)
                            ? COLORS.black : (item.
                                price_change_percentage_7d_in_currency > 0)
                                ? COLORS.lightGreen : COLORS.red

                        return (
                            <TouchableOpacity 
                                style={{
                                    height: 55,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => setSelectedCoin(item)}
                            >
                                {/* Logo */}
                                <View style={{width: 35}}>
                                    <Image
                                        source={{uri: item.image}}
                                        style={{
                                            height: 20,
                                            width: 20
                                        }}/>
                                </View>

                                {/* Name */}
                                <View style={{flex: 1}}>
                                    <Text 
                                        style={{
                                            color: COLORS.black,
                                            ...FONTS.h3
                                        }}>{item.name}
                                    </Text>
                                </View>

                                {/* Figures */}
                                <View>
                                    <Text style={{
                                        textAlign: 'right',
                                        color: COLORS.black,
                                        ...FONTS.h5,
                                        lineHeight: 15
                                        }}
                                    >$ {item.current_price}</Text>
                                    <View 
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        {
                                            item.price_change_percentage_7d_in_currency != 0 &&
                                            <Image
                                                source={icons.upArrow}
                                                style={{
                                                    height: 10,
                                                    width: 10,
                                                    tintColor: priceColor,
                                                    transform: item.price_change_percentage_7d_in_currency > 0 ? [{rotate: '45deg'}] : [{rotate: '125deg'}]
                                                }}
                                            />
                                        }
                                        <Text
                                            style={{
                                                marginLeft: 5,
                                                color: priceColor,
                                                ...FONTS.body5,
                                                lineHeight: 15
                                            }}
                                        >{item.price_change_percentage_7d_in_currency.toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={
                        <View
                            style={{
                                marginBottom: 50
                            }}
                        />
                    }
                />
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