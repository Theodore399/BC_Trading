import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { connect } from 'react-redux';
import { setTradeModelVisibility } from "../stores/tab/tabActions";
import { getHoldings, getCoinMarket } from '../stores/market/marketActions';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { Main } from '.';
import { IconTextButton } from '../components';
import { SIZES, COLORS, FONTS, dummyData, icons } from '../constants';
import { WebView } from 'react-native-webview';

const Graph = () => {

    function handleView () {
        return (
            <WebView
                source={{uri: 'https://www.tradingview.com/chart/'}}
                style={{
                    flex: 1,
                    marginTop: 0,
                    marginBottom: 0
                }}
                allowFileAccessFromFileURLs={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={() => true}/>
        )
      };

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
                >SuperChart</Text>
            </View>
        )
    };

    return (
        <Main>
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLORS.black
                }}
            >
                {/* Header */}
                {renderHeader()}

                {/* Chart */}
                <View
                    style={{
                        marginTop: 10,
                        marginBottom: 80,
                        height: 505,
                        width: SIZES.width
                    }}
                >
                    {handleView()}
                </View>
            </View>
        </Main>
    )
}

export default Graph;
