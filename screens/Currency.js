import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { setTradeModelVisibility } from "../stores/tab/tabActions";
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { Main } from './';
import { BalanceInfo, Chart} from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';

const Currency = ({getHoldings, getCoinMarket, myHoldings, coins, setTradeModelVisibility, isTradeModelVisible}) => {

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

    function renderHeader() {
        return (
            <View 
                style={{
                    paddingHorizontal: SIZES.padding,
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25,
                    backgroundColor: COLORS.white
                }}
            >
                <Text 
                    style={{
                        marginTop: 60, 
                        color: COLORS.black,
                        ...FONTS.largeTitle
                    }}
                >Trade</Text>
            </View>
        )
    }

    function tradeTabButtonOnClickHandler() {
        setTradeModelVisibility(!isTradeModelVisible)
    }

    return (
        <Main>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}>
                {/* Header */}
                {renderHeader()}

                {/* Chart */}
                {/*<Chart 
                    containerStyle={{
                        marginTop:  SIZES.padding * 2
                    }}
                    chartPrices={selectedCoin ? selectedCoin?.sparkline_in_7d?.price : coins[0]?.sparkline_in_7d?.price}
                />*/}

                {/* Top Popular Cryptocurrency */}
                <FlatList
                    data={coins}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        marginTop: 30,
                        paddingHorizontal: SIZES.padding
                    }}
                    ListHeaderComponent={
                        <View style={{marginBottom: SIZES.radius}}>
                            <Text style={{
                                color:COLORS.black, 
                                ...FONTS.h3, 
                                fontSize: 18
                                }}
                            >Please select the currency you want to trade with below:</Text>
                        </View>
                    }
                    renderItem={({item}) => {

                        let priceColor = (item.
                            price_change_percentage_7d_in_currency == 0)
                            ? COLORS.lightGray3 : (item.
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
                                onPress={() => tradeTabButtonOnClickHandler()}
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



// export default Currency;

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        coins: state.marketReducer.coins,
        isTradeModelVisible: state.tabReducer.isTradeModelVisible
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy,
            sparkline, priceChangePerc, perPage, page) => {return dispatch(getHoldings(holdings, currency, coinList, orderBy,
                sparkline, priceChangePerc, perPage, page))},
        getCoinMarket: (currency, coinList, orderBy, sparkline,
            priceChangePerc, perPage, page) => {return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline,
                priceChangePerc, perPage, page))},
        setTradeModelVisibility: (isVisible) => {return dispatch(setTradeModelVisibility(isVisible))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency);