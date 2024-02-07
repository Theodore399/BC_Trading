import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, Linking } from 'react-native';
import { LineChart, } from 'react-native-svg-charts';
import axios from 'axios';

const Asset = () => {
  const screenWidth = Dimensions.get('window').width;
  const [ohlcData, setOhlcData] = useState([]);
  const [assets, setAssets] = useState([]);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState('');
  const [assetPair, setAssetPair] = useState('XXBTZUSD');
  const [page, setPage] = useState(1);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  // Fetch last 1000 trades for a given asset pair
  const fetchLast1000Trades = async (assetPair) => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/Trades?pair=${assetPair}`
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
          borderColor: '#ccc',}, { backgroundColor: assetPair === item ? '#ccc' : '#fff' }]}
        onPress={() => setAssetPair(item)}
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
    const response = await axios.get(`https://api.kraken.com/0/public/${assetPair}`);
    const tradableAssetPairs = Object.keys(response.data.result).filter(
      (assetPair) => response.data.result[assetPair].tradable
    );
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
      const response = await axios.get(
        `https://api.kraken.com/0/public/Ticker?pair=${assetPair}`
      );

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
  const fetchOHLCData = async (assetPair) => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/OHLC?pair=${assetPair}`
      );

      const ohlcData = response.data.result[assetPair].map((ohlc) => {
        const [time, open, high, low, close, vwap, volume, count] = ohlc;
        return {
          time,
          open,
          high,
          low,
          close,
          vwap,
          volume,
          count,
        };
      });

      setOhlcData(ohlcData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch order book details for a given asset pair
  const fetchOrderBook = async (assetPair) => {
    try {
      const response = await axios.get(
        `https://api.kraken.com/0/public/Depth?pair=${assetPair}`
      );

      const orderBook = response.data.result[assetPair];
      const asks = orderBook.asks.map((ask) => {
        const [price, volume, timestamp] = ask;
        return { price, volume, timestamp };
      });
      const bids = orderBook.bids.map((bid) => {
        const [price, volume, timestamp] = bid;
        return { price, volume, timestamp };
      });

      setOrderBook({ asks, bids });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
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
  
    // Fetch the list of tradable asset pairs from the Kraken API
    fetchTradableAssetPairs();
  
    // Fetch ticker information for a given list of asset pairs
    fetchTickerInfo();
  
    // Fetch OHLC data for the selected asset pair
    fetchOHLCData(assetPair);
  
    // Fetch the order book for the selected asset pair
    fetchOrderBook(assetPair);
  
    // Fetch the last 1000 trades for the selected asset pair
    fetchLast1000Trades(assetPair, page);
  
    // Fetch the system status from the Kraken API
    getSystemStatus();
  
    // Update the selected asset pair and page number in the URL
    Linking.addEventListener('url', (event) => {
      const url = event.url;
      const params = new URLSearchParams(url.search);
      const assetPairParam = params.get('pair');
      const pageParam = params.get('page');
      if (assetPairParam) {
        setAssetPair(assetPairParam);
      }
      if (pageParam) {
        setPage(parseInt(pageParam, 10));
      }
    });

  }, [assetPair, page]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kraken Asset Tracker</Text>
        <Text style={styles.systemStatus}>{systemStatus}</Text>
      </View>
      <View style={styles.content}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <View style={styles.tradableAssetPairs}>
          <Text style={styles.subtitle}>Tradable Asset Pairs</Text>
          <FlatList
            data={assets}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.assetPair,
                  assetPair === item && styles.assetPair,
                ]}
                onPress={() => setAssetPair(item)}
              >
                <Text style={styles.assetPairText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={styles.chart}>
          <Text style={styles.subtitle}>OHLC Data</Text>
          <LineChart
            data={ohlcData}
            width={screenWidth - 40}
            height={250}
            yAxisLabel="$"
            gridMin={0}
            yAxisSuffix="k"
            formatYLabel={(y) => `${y}k`}
            style={{ marginVertical: 10 }}
          />
        </View>
        <View style={styles.trades}>
          <Text style={styles.subtitle}>Last 1000 Trades</Text>
          <FlatList
            data={trades}
            renderItem={({ item }) => (
              <View style={styles.trade}>
                <Text style={styles.tradeText}>
                  {item.price} {item.volume} {item.time} {item.side} {item.type} {item.misc}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            onEndReached={() => handleEndReached()}
            onEndReachedThreshold={0.5}
          />
        </View>
        <View style={styles.orderBook}>
          <Text style={styles.subtitle}>Order Book</Text>
          <View style={styles.orderBookBids}>
            <Text style={styles.orderBookLabel}>Bids</Text>
            <FlatList
              data={orderBook.bids}
              renderItem={({ item }) => (
                <View style={styles.orderBookItem}>
                  <Text style={styles.orderBookText}>
                    {item.price} {item.volume}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.price.toString()}
            />
          </View>
          <View style={styles.orderBookAsks}>
            <Text style={styles.orderBookLabel}>Asks</Text>
            <FlatList
              data={orderBook.asks}
              renderItem={({ item }) => (
                <View style={styles.orderBookItem}>
                  <Text style={styles.orderBookText}>
                    {item.price} {item.volume}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.price.toString()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  systemStatus: {
    fontSize: 14,
    color: '#888',
  },
  content: {
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tradableAssetPairs: {
    marginBottom: 10,
  },
  assetPair: {
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  assetPairText: {
    fontSize: 14,
    textAlign: 'center',
  },
  chart: {
    marginBottom: 10,
  },
  trades: {
    marginBottom: 10,
  },
  trade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tradeText: {
    fontSize: 14,
  },
  orderBook: {
    marginBottom: 10,
  },
  orderBookBids: {
    marginBottom: 5,
  },
  orderBookAsks: {
    marginBottom: 5,
  },
  orderBookLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderBookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  orderBookText: {
    fontSize: 12,
  },
});

export default Asset;