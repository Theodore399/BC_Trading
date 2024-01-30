import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, TextInput} from 'react-native';
import { connect } from 'react-redux';
import { setTradeModelVisibility } from "../stores/tab/tabActions";
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { Main } from './';
import { IconTextButton, Dropdown} from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';
import DropDownPicker from 'react-native-dropdown-picker';

const Currency = ({getHoldings, getCoinMarket, myHoldings, coins, navigation}) => {

    const [isVisible, setIsVisible] = React.useState(false);

    const handleOpenPopup = () => {
        setIsVisible(true);
    };

    const handleClosePopup = () => {
        setIsVisible(false);
    };

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
                    backgroundColor: COLORS.black
                }}
            >
                <Text 
                    style={{
                        marginTop: 60, 
                        color: COLORS.white,
                        ...FONTS.largeTitle
                    }}
                >Trade</Text>
            </View>
        )
    };

    function renderInterestCalculation() {

  const [number, setNumber] = useState(1);
  const interestRate = 0.97;
  
  const increaseNumber = () => {
    setNumber(number + 1);
  };

  const decreaseNumber = () => {
    if (number > 0) {
      setNumber(number - 1);
    }
  };

  const calculateInterest = () => {
    return number * interestRate;
  };

       return (
    <View>
      <Text>Stakes:</Text>
      <Button onPress={decreaseNumber} title=" - " />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={number.toString()}
        onChangeText={(value) => setNumber(Number(value))}
      />
      <Button onPress={increaseNumber} title=" + " />
      <Text>Interest at 97%: {calculateInterest()}</Text>
      <Button title="BUY" onPress={() => {}} />
      <Button title="SELL" onPress={() => {}} />
    </View>
  );
};
            
    function renderTradeDuration() {

        const options = [
            { id: 1, value: 'Seconds' },
            { id: 2, value: 'Minutes' },
            { id: 3, value: 'Hours' },
            { id: 4, value: 'Days' },
            { id: 5, value: 'Ticks' },
        ];
        const [tradeDuration, setTradeDuration] = React.useState(0);
        const [durationUnit, setDurationUnit] = React.useState(options[0]);
        const [selectedOption, setSelectedOption] = useState(null);
        const handleSelect = (value) => {
            setSelectedOption(value);
            // Handle selected option here
        };
        const handleTradeDurationChange = (event) => {
            setTradeDuration(event.target.value);
        };
        const handleDurationUnitChange = (event) => {
            setDurationUnit(event.target.value);
        };

        const initiateTrade = () => {
            alert(`Trade initiated for ${tradeDuration} ${durationUnit}!`);
        };

        return(
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',}}>
                <Text style={{color: COLORS.white, ...FONTS.h3,}}>DURATION:</Text>
                <TextInput
                    value={tradeDuration}
                    onChangeText={setTradeDuration}
                    placeholder="0"
                    style={{backgroundColor: COLORS.white, fontSize: 14, height: 35, width: 40, marginLeft: 5, marginRight: 5, borderRadius: 5,}}/>
                <Text style={{ color: COLORS.white, ...FONTS.h3, marginRight: 10,}}>UNIT:</Text>
                <View>
                    <Dropdown data={options} onSelect={handleSelect} initialValue={selectedOption}/>
                </View>
            </View>
        )
    }

    return (
        <Main>
            <View style={{flex: 1, backgroundColor: COLORS.black}}>

                {/* Header */}
                {renderHeader()}

                {/* Top Popular Cryptocurrency */}
                <View style={{marginBottom: SIZES.radius}}>
                    <Text style={{color:COLORS.white, ...FONTS.h3, marginTop: 30, marginLeft: 25, marginRight: 25, fontSize: 18}}>Please select the currency you want to trade with below:</Text>
                </View>
                <FlatList 
                data={coins}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{paddingHorizontal: SIZES.padding}}
                    renderItem={({item}) => {

                        let priceColor = (item.
                            price_change_percentage_7d_in_currency == 0)
                            ? COLORS.white : (item.
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
                                onPress={() => (
                                    (console.log('You have selected', (item.name))),
                                    handleOpenPopup()
                                )}
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
                                    <Text style={{color: COLORS.white, ...FONTS.h3}}>{item.name}</Text>
                                </View>

                                {/* Figures */}
                                <View>
                                    <Text style={{textAlign: 'right', color: COLORS.white, ...FONTS.h5, lineHeight: 15}}>$ {item.current_price}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                        {
                                            item.price_change_percentage_7d_in_currency != 0 &&
                                            <Image
                                                source={icons.upArrow}
                                                style={{height: 10, width: 10, tintColor: priceColor, transform: item.price_change_percentage_7d_in_currency > 0 ? [{rotate: '45deg'}] : [{rotate: '125deg'}]}}/>
                                        }
                                        <Text style={{ marginLeft: 5, color: priceColor, ...FONTS.body5, lineHeight: 15}}>{item.price_change_percentage_7d_in_currency.toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                        )
                    }}
                    ListFooterComponent={
                        <View style={{marginBottom: 50,}}/>
                    }
                />

                {/* Modal */}
                <Modal 
                    visible={isVisible}
                    transparent={true}
                    animationType={'slide'}
                    style={{borderWidth: 1, borderColor: COLORS.white}}
                >
                    <TouchableOpacity
                        style={{flex: 1, backgroundColor: COLORS.transparentBlack1, justifyContent: 'center', alignItems: 'center'}}
                        activeOpacity={1}
                        onPress={handleClosePopup}>
                            
                        {/* Popup Container */}
                        <View style={{borderWidth: 1, borderColor: COLORS.white ,backgroundColor: COLORS.transparentBlack, padding: 20, borderRadius: SIZES.radius, alignItems: 'center', width: '100%'}}>
                            
                            {/* Stake */}
                            {renderInterestCalculation()}

                            {/* Duration */}
                            {renderTradeDuration()}

                            {/* Title */}
                            <Text style={{color: COLORS.white, ...FONTS.h3, marginTop: 20,}}>Choose:</Text>

                            <View
                                style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10,}}>
                                {/* Buttons */}
                                <IconTextButton
                                    label='Buy'
                                    icon={icons.sell}
                                    containerStyle={{width: 100, marginRight: 5,}}
                                    onPress={() => ((console.log('Bought Successfully')), handleClosePopup())}/>
                                <IconTextButton
                                    label='Sell'
                                    icon={icons.buy}
                                    containerStyle={{width: 100, marginLeft: 5,}}
                                    onPress={() => ((console.log('Sold Successfully')), handleClosePopup())}/>
                            </View>
                            <View>
                                <IconTextButton
                                    label='Trade'
                                    icon={icons.trade}
                                    containerStyle={{width: 200, marginLeft: 5, marginTop: 60}}
                                    onPress={() => ((console.log('Trade Successfully')), handleClosePopup(), navigation.navigate('Portfolio'))}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </Main>
    )
};

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
