import axios from 'axios';

const BASE_URL = 'https://api.kraken.com';
const API_VERSION = '/0';
const API_PATH = '/private/Balance';
const API_PATH_MARGIN = '/private/TradeBalance';
const API_PATH_ORDERS = '/private/OpenOrders';
const API_PATH_CLOSED_ORDERS = '/private/ClosedOrders';
const API_PATH_GET_ORDER_INFO = '/private/QueryOrders';
const API_PATH_TRADES_HISTORY = '/private/TradesHistory';

const getKrakenAuthHeaders = (apiKey, apiSecret) => {
  const nonce = Date.now().toString();
  const message = `${nonce} ${API_PATH}`;
  const secretBuffer = Buffer.from(apiSecret, 'base64');
  const hmac = Buffer.from(require('crypto').createHmac('sha256', secretBuffer).update(message).digest(), 'base64');
  return {
    'API-Key': apiKey,
    'API-Sign': `${hmac}:${nonce}`,
  };
};

export const getBalances = async (apiKey, apiSecret) => {
  try {
    const headers = getKrakenAuthHeaders(apiKey, apiSecret);

    const response = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH}`, {}, { headers });

    const balances = response.data.result;

    // Calculate available balance for trading
    const availableBalances = Object.entries(balances).reduce((acc, [currency, { balance, credit, credit_used, hold_trade }]) => {
      const availableBalance = parseFloat(balance) + parseFloat(credit) - parseFloat(credit_used) - parseFloat(hold_trade);

      return {
        ...acc,
        [currency]: {
          total: balance,
          frozen: hold_trade,
          available: availableBalance,
        },
      };
    }, {});

    // Retrieve margin information
    const marginResponse = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_MARGIN}`, {}, { headers });

    const marginData = marginResponse.data.result;

    // Retrieve open orders
    const ordersResponse = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_ORDERS}`, { txid: marginData.open_txids.join(',') }, { headers });

    const orders = ordersResponse.data.result;

    // Retrieve closed orders
    const closedOrdersResponse = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_CLOSED_ORDERS}`, { type: 'all', ofs: 'desc', start: 0, count: 50 }, { headers });

    const closedOrders = closedOrdersResponse.data.result;

    // Retrieve closed orders
    const specificOrdersResponse = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_GET_ORDER_INFO}`, { type: 'all', ofs: 'desc', start: 0, count: 50 }, { headers });

    const specificOrders = specificOrdersResponse.data.result;

    // Retrieve trades/fills
    const tradesHistoryResponse = await axios.post(`${BASE_URL}${API_VERSION}${API_PATH_TRADES_HISTORY}`, { pair: 'XXBTZUSD', ofs: '0' }, { headers });

    const tradesHistory = tradesHistoryResponse.data.result;

    return {
      balances,
      availableBalances,
      marginData,
      orders,
      closedOrders,
      specificOrders,
      tradesHistory,
    };
  } catch (error) {
    console.error('Error fetching balances from Kraken API', error);

    throw error;
  }
};