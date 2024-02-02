import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getHoldings } from '../stores/market/marketActions';
import { Main } from './';
import { BalanceInfo, Chart} from '../components';
import { IconTextButton, Dropdown} from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';

const Portfolio = ({getHoldings, myHoldings}) => {

    const [isVisible, setIsVisible] = React.useState(false);
    const handleOpenPopup = () => {
        setIsVisible(true);
    };
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
  
    const handleClosePopup = () => {
        setIsVisible(false);
    };
    useFocusEffect(
        React.useCallback(() => {getHoldings(holdings = dummyData.holdings)}, [])
    );

    let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
    let valueChange = myHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0);
    let percChange = valueChange / (totalWallet - valueChange) * 100;

    function renderCurrentBalanceSection() {
        return (
            <View style={{paddingHorizontal: SIZES.padding, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, backgroundColor: COLORS.black,}}>
                <Text style={{marginTop: 60, color: COLORS.white, ...FONTS.largeTitle,}}>Portfolio</Text>
                {/* Balance Info */}
                <BalanceInfo
                    title="Total Balance:"
                    displayAmount={totalWallet}
                    changePct={percChange}
                    containerStyle={{marginTop: SIZES.radius, marginBottom: SIZES.padding,}}/>
            </View>
        )
    }

    return (
        <Main>
            <View style={{flex: 1, backgroundColor: COLORS.black}}>
                {/* Header - Current balance */}
                {renderCurrentBalanceSection()}
                {/* Your Assets */}
                <FlatList 
                    data={myHoldings} 
                    keyExtractor={item => item.id} 
                    contentContainerStyle={{marginTop: -(SIZES.padding), paddingHorizontal: SIZES.padding}}
                    ListHeaderComponent={
                        <View>
                            {/* Section Title */}
                            <Text style={{color:COLORS.white, ...FONTS.h2, marginTop: 50,}}>Your Assets</Text>
                            {/* Header Label */}
                            <View style={{flexDirection: 'row', marginTop: SIZES.radius}}>
                                <Text style={{flex: 1, color: COLORS.white}}>Assets</Text>
                                <Text style={{flex: 1, color: COLORS.white, textAlign: 'right'}}>Price</Text>
                                <Text style={{flex: 1, color: COLORS.white, textAlign: 'right'}}>Holdings</Text>
                            </View>
                        </View>
                    }
                    renderItem={({item}) => {

                        let priceColor = (item.
                            price_change_percentage_7d_in_currency == 0)
                            ? COLORS.transparentWhite : (item.
                                price_change_percentage_7d_in_currency > 0)
                                ? COLORS.lightGreen : COLORS.red

                        return (
                            <TouchableOpacity 
                                style={{height: 55, flexDirection: 'row',}}
                                onPress={handleOpenPopup}>
                                {/* Asset */}
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                                    <Image
                                        source={{uri: item.image}}
                                        style={{height: 20, width: 20,}}/>
                                    <Text style={{marginLeft: SIZES.radius, color: COLORS.white, ...FONTS.h4}}>{item.name}</Text>
                                </View>
                                {/* Price */}
                                <View style={{flex: 1, justifyContent: 'center',}}>
                                    <Text style={{color: COLORS.white, ...FONTS.h5, textAlign: 'right', lineHeight: 15,}}>$ {item.current_price.toLocaleString()}</Text>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}>
                                        {
                                            item.price_change_percentage_7d_in_currency != 0 &&
                                            <Image
                                                source={icons.upArrow}
                                                style={{height: 10, width: 10, tintColor: priceColor, transform: item.price_change_percentage_7d_in_currency > 0 ? [{rotate: '45deg'}] : [{rotate: '125deg'}],}}/>
                                        }
                                        <Text style={{marginLeft: 5, color: priceColor, ...FONTS.body5, lineHeight: 15,}}>{item.price_change_percentage_7d_in_currency.toFixed(2)} %</Text>
                                    </View>
                                </View>
                                {/* Holdings */}
                                <View style={{flex: 1, justifyContent: 'center',}}>
                                    <Text style={{textAlign: 'right', color: COLORS.white, ...FONTS.h5, lineHeight: 15,}}>$ {item.total.toLocaleString()}</Text>
                                    <Text style={{textAlign: 'right', color: COLORS.lightGray3, ...FONTS.body5, lineHeight: 15,}}>{item.qty} {item.symbol.toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={
                        <View style={{marginBottom: 50,}}/>
                    }/>
                {/* Modal */}
                <Modal 
                    visible={isVisible}
                    transparent={true}
                    animationType={'slide'}
                    style={{borderWidth: 1, borderColor: COLORS.white}}>
                    <TouchableOpacity
                        style={{flex: 1, backgroundColor: COLORS.transparentBlack1, justifyContent: 'center', alignItems: 'center'}}
                        activeOpacity={1}
                        onPress={handleClosePopup}> 
                        {/* Popup Container */}
                        <View style={{borderWidth: 1, borderColor: COLORS.white ,backgroundColor: COLORS.transparentBlack, padding: 20, borderRadius: SIZES.radius, alignItems: 'center', width: '100%'}}>
                            {/* Title */}
                            <Text style={{color: COLORS.white, ...FONTS.h3, marginTop: 20,}}>Choose:</Text>

                            <View
                                style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10,}}>
                                {/* Buttons */}
                                <IconTextButton
                                    label='Copy Trade'
                                    icon={icons.doubleUp}
                                    containerStyle={{width: 130, marginRight: 5,}}
                                    onPress={() => ((console.log('Trade Closed')), handleClosePopup())}/>
                                <IconTextButton
                                    label='Close'
                                    icon={icons.close}
                                    containerStyle={{width: 130, marginLeft: 5,}}
                                    onPress={() => ((console.log('Previous Trade Copied')), handleClosePopup())}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </Main>
    )
}

// export default Portfolio;

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy,
            sparkline, priceChangePerc, perPage, page) => {return dispatch(getHoldings(holdings, currency, coinList, orderBy,
                sparkline, priceChangePerc, perPage, page))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
