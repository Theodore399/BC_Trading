import React, { useEffect, useState } from 'react';
import { Text, View, } from 'react-native';
import { IconTextButton } from '../components';
import { getBalances } from '../api/KrakenApi';

const API_PATH_GET_ORDER_INFO = '/private/GetOrderInfo';
const API_PATH_TRADES_HISTORY = '/private/TradesHistory';

const App = () => {
    const [balances, setBalances] = useState(null);
    const [availableBalances, setAvailableBalances] = useState(null);
    const [marginData, setMarginData] = useState(null);
    const [orders, setOrders] = useState(null);
    const [closedOrders, setClosedOrders] = useState(null);
    const [specificOrder, setSpecificOrder] = useState(null);
    const [specificTrade, setSpecificTrade] = useState(null);
    const [orderTxid, setOrderTxid] = useState('');
    const [tradesHistory, setTradesHistory] = useState(null);

    const apiKey = 'iLcCZOjlamfdVmtD8uVlD18u9aE293fxODh2cSEXZxYSs0bGSvhC47NU';
    const apiSecret = 'nG4oJPIcw1D/T+jcNw6j2tljTfVZnvNjCMs6H1shrJDdUaIrHNC2nQunGc34pgoKEMl3E6LJewa7cLKvq2xq0g==';

    const fetchBalances = async () => {
        try {
            const { 
                balances, 
                availableBalances, 
                marginData, 
                orders, 
                closedOrders,
                tradesHistory
            } = await getBalances(apiKey, apiSecret);
    
            setBalances(balances);
            setAvailableBalances(availableBalances);
            setMarginData(marginData);
            setOrders(orders);
            setClosedOrders(closedOrders);
            setTradesHistory(tradesHistory);
        } catch (error) {
            console.error('Error fetching balances', error);
        }
    };

    const fetchSpecificOrder = async () => {
        try {
            const headers = getKrakenAuthHeaders(apiKey, apiSecret);
    
            const response = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_GET_ORDER_INFO}`, { txid: orderTxid }, { headers });
    
            setSpecificOrder(response.data.result);
        } catch (error) {
            console.error('Error fetching specific order', error);
        }
    };

    const getSpecificTrades = async (apiKey, apiSecret, txids) => {
        try {
          const headers = getKrakenAuthHeaders(apiKey, apiSecret);
      
          const response = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_TRADES_HISTORY}`, { txid: txids.join(',') }, { headers });
      
          const tradesHistory = response.data.result;
      
          return tradesHistory;
        } catch (error) {
          console.error('Error fetching specific trades from Kraken API', error);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, []);

    if (!balances || !availableBalances || !marginData || !orders || !closedOrders || !tradesHistory) {
        return <View><Text>Loading...</Text></View>;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 32, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', }}>Account Balances</Text>
                <Text style={{ fontSize: 18, color: '#666', }}>Total: {Object.values(availableBalances).reduce((acc, { available }) => acc + parseFloat(available), 0).toFixed(2)}</Text>
            </View>
      
            <View style={{ flex: 1, }}>
                {Object.entries(availableBalances).map(([currency, { available }]) => (
                    <View key={currency} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>{currency}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Available: {available.toFixed(2)}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#666', }}>{balances[currency].refid}</Text>
                    </View>
                ))}
            </View>
      
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Margin Summary</Text>
                <Text style={{ fontSize: 14, color: '#666', }}>Equity: {marginData.equity.toFixed(2)}</Text>
                <Text style={{ fontSize: 14, color: '#666', }}>Margin Level: {marginData.margin.toFixed(2)}%</Text>
            </View>
      
            <View style={{ flex: 1, marginTop: 12, }}>
                {marginData.open_positions.map((position) => (
                <View key={position.txid} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', }}>{position.pair}</Text>
                        <Text style={{ fontSize: 14, color: '#666', }}>Amount: {position.volume.toFixed(2)}</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#666', }}>Margin: {position.margin.toFixed(2)}</Text>
                </View>
                ))}
            </View>

            <View style={{ flex: 1, marginTop: 12, }}>
                {orders.map((order) => (
                    <View key={order.txid} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>{order.descr.pair}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Order Type: {order.descr.ordertype}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#666', }}>Volume: {order.vol.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={{ flex: 1, marginTop: 12, }}>
                {closedOrders.map((order) => (
                    <View key={order.txid} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>{order.descr.pair}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Order Type: {order.descr.ordertype}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Status: {order.status}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Price: {order.price.toFixed(2)}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Volume: {order.vol.toFixed(2)}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#666', }}>{order.status === 'closed' ? 'Closed' : 'Cancelled'}</Text>
                    </View>
                ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, }}>
                <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8 }}
                    onChangeText={setOrderTxid}
                    placeholder="Enter order transaction ID"
                />
                <IconTextButton
                    label='Fetch Specific Order'
                    icon={icons.logout}
                    containerStyle={{flex: 1, height: 50, backgroundColor: 'red', color: 'white',}}
                    onPress={() => {
                        fetchSpecificOrder();
                    }}/>
            </View>

            {specificOrder && (
                <View style={{ marginTop: 12, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Specific Order</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Transaction ID: {specificOrder.txid}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Status: {specificOrder.status}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Pair: {specificOrder.descr.pair}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Order Type: {specificOrder.descr.ordertype}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Volume: {specificOrder.vol.toFixed(2)}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Price: {specificOrder.price.toFixed(2)}</Text>
                </View>
            )}

            <View style={{ marginTop: 12, }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Trades/Fills</Text>
                {tradesHistory.map((trade) => (
                    <View key={trade.txid} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>{trade.pair}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Type: {trade.type}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Order Type: {trade.ordertype}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Volume: {trade.vol.toFixed(2)}</Text>
                            <Text style={{ fontSize: 14, color: '#666', }}>Price: {trade.price.toFixed(2)}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#666', }}>{trade.time}</Text>
                    </View>
                ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, }}>
                <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8 }}
                    onChangeText={setOrderTxid}
                    placeholder="Enter trade/fill transaction ID"
                />
                <IconTextButton
                    label='Fetch Specific Trade/Fill'
                    icon={icons.logout}
                    containerStyle={{flex: 1, height: 50, backgroundColor: 'red', color: 'white',}}
                    onPress={() => {
                        fetchSpecificTrade();
                    }}/>
            </View>

            {specificTrade && (
                <View style={{ marginTop: 12, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Specific Trade/Fill</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Transaction ID: {specificTrade.txid}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Type: {specificTrade.type}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Pair: {specificTrade.pair}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Order Type: {specificTrade.ordertype}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Volume: {specificTrade.vol.toFixed(2)}</Text>
                    <Text style={{ fontSize: 14, color: '#666', }}>Price: {specificTrade.price.toFixed(2)}</Text>
                </View>
            )}
        </View>
    );
};

export default App;