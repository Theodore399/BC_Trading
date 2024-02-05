import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import axios from 'axios';

const Asset = () => {
  const [ohlcData, setOhlcData] = useState([]);
  const [assets, setAssets] = useState([]);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState('');
  const [selectedAssetPair, setSelectedAssetPair] = useState('XXBTZUSD');
  const [page, setPage] = useState(1);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  // Fetch last 1000 trades for a given asset pair
  const fetchLast1000Trades = async (assetPair, page = 1) => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/TradesHistory?pair=${assetPair}&count=1000&page=${page}`,
        { headers: { 'User-Agent': 'KrakenDemoApp' } }
      );

      setTrades((prevTrades) => {
        const newTrades = [...prevTrades, ...response.data.result[assetPair].trades];
        return newTrades;
      });

      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate limiting
        setError('Rate limiting exceeded.');
      } else {
        // Handle other errors
        setError(error.message);
      }
      setLoading(false);
    }
  };

  // Retrieve the next page of trades
  const handleEndReached = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  // Extract the unique list of asset pairs from the API response
  const keyExtractor = (item) => item;

  // Render each asset pair in the FlatList component
  const renderAsset = ({ item }) => {
    return (
      <TouchableOpacity
        style={[{
          padding: 10,
          margin: 5,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#ccc',}, { backgroundColor: selectedAssetPair === item ? '#ccc' : '#fff' }]}
        onPress={() => setSelectedAssetPair(item)}
      >
        <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center',}}>{item}</Text>
      </TouchableOpacity>
    );
  };

  // Render each trade in the FlatList component
  const renderTrade = ({item}) => {
    const {price, volume, time, side, orderType, misc} = item;
    const tradeTime = new Date(time * 1000).toLocaleString();
    const tradeSide = side === 'b' ? 'Buy' : 'Sell';
    const tradeOrderType = orderType === 'l' ? 'Limit' : 'Market';
    const tradeMisc = misc === 'i' ? 'Ignore' : 'Adjust';
  
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,}}>
        <Text style={{fontSize: 14,}}>{`${tradeTime} - ${tradeSide} - ${tradeOrderType} - ${tradeMisc}`}</Text>
        <Text style={{fontSize: 14,}}>{`Price: ${price} - Volume: ${volume}`}</Text>
      </View>
    );
  };

  // Render each order book in the FlatList component
  const renderOrder = ({item}) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,}}>
        <Text style={{fontSize: 12,}}>{item[0]}</Text>
        <Text style={{fontSize: 12,}}>{item[1]}</Text>
      </View>
    );
  };

  // Fetch the list of tradable asset pairs from the Kraken API
  const fetchTradableAssetPairs = async () => {
    try {
      const response = await axios.get(`https://api.kraken.com/0/public/AssetPairs?_=${Date.now()}`, { headers: { 'User-Agent': 'KrakenDemoApp' } });
      const tradableAssetPairs = Object.keys(response.data.result).filter((assetPair) => response.data.result[assetPair].tradable);
      setAssets(tradableAssetPairs);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch ticker information for a given list of asset pairs
  const fetchTickerInfo = async () => {
    try {
      const response = await axios.get(`https://api.kraken.com/0/public/Ticker?pair=${assets.join(',')}&_=${Date.now()}`, { headers: { 'User-Agent': 'KrakenDemoApp' } });
  
      const tickerInfo = assets.map((assetPair) => {
        const tickerData = response.data.result[assetPair];
        return {
          assetPair,
          ask: tickerData.a[0],
          bid: tickerData.b[0],
          lastTrade: tickerData.c[0],
          volume: tickerData.v,
        };
      });
  
      setAssets(tickerInfo);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch OHLC data for a given asset pair
  const fetchOHLCData = async () => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/OHLC?pair=${selectedAssetPair}&interval=1`
      );
  
      if (response.data.result) {
        const ohlcData = response.data.result[selectedAssetPair].map(ohlc => ({
          time: ohlc[0],
          open: ohlc[1],
          high: ohlc[2],
          low: ohlc[3],
          close: ohlc[4],
          vwap: ohlc[5],
          volume: ohlc[6],
          count: ohlc[7],
        }));
  
        setOhlcData(ohlcData);
      } else {
        console.error('Error fetching OHLC data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
    }
  };

  // Fetch order book details for a given asset pair
  const fetchOrderBook = async () => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/Depth?pair=${selectedAssetPair}`
      );
      const orderBook = response.data.result[selectedAssetPair];
      const asks = orderBook.asks.map(([price, volume, timestamp]) => ({
        price,
        volume,
        timestamp,
      }));
      const bids = orderBook.bids.map(([price, volume, timestamp]) => ({
        price,
        volume,
        timestamp,
      }));
      setOrderBook({ asks, bids });
    } catch (error) {
      setError(error.message);
    }
  };
  
  useEffect(() => {
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
    fetchTradableAssetPairs();
    fetchTickerInfo(assets);
    fetchOHLCData(selectedAssetPair);
    fetchLast1000Trades(selectedAssetPair, page);
    fetchOrderBook();
  }, [assets, selectedAssetPair, page]);
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{fontSize: 14,}}>{error}</Text>
      ) : (
        <View style={{flex: 1, width: '100%'}}>
          <FlatList
            data={assets}
            renderItem={renderAsset}
            keyExtractor={keyExtractor}
            style={{width: '100%',}}
          />
          <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20,}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 10,}}>OHLC Data:</Text>
            <LineChart
              style={{height: 200, width: '90%',}}
              data={ohlcData}
              contentInset={{top: 20, bottom: 20,}}
              svg={{stroke: 'rgb(134, 65, 244)', strokeWidth: 2,}}
              curve={shape.curveNatural}
              gridMin={0}
            >
              <Grid/>
            </LineChart>
          </View>
          <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20,}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 10,}}>Last 1000 Trades:</Text>
            <FlatList
              data={trades}
              renderItem={renderTrade}
              keyExtractor={keyExtractor}
              style={{width: '90%',}}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
            />
          </View>
          <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20,}}>
          <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 10,}}>Order Book:</Text>
          <View style={{width: '90%',}}>
            <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5,}}>Asks:</Text>
            <FlatList
              data={orderBook.asks}
              renderItem={renderOrder}
              keyExtractor={keyExtractor}
              style={{width: '100%',}}
            />
            <Text style={{fontSize: 12, fontWeight: 'bold', marginTop: 20,}}>Bids:</Text>
            <FlatList
              data={orderBook.bids}
              renderItem={renderOrder}
              keyExtractor={keyExtractor}
              style={{width: '100%',}}
            />
          </View>
        </View>
        </View>
      )}
    </View>
  );
};

export default Asset;