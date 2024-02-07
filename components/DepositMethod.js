import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DepositMethod = ({ asset }) => {
  const [depositMethods, setDepositMethods] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepositMethods = async () => {
      try {
        const response = await fetch('https://api.kraken.com/0/public/DepositMethods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `asset=${asset}`,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch deposit methods');
        }

        const data = await response.json();
        setDepositMethods(data.result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDepositMethods();
  }, [asset]);

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!depositMethods.length) {
    return <Text style={styles.loading}>Loading deposit methods...</Text>;
  }

  return (
    <View style={styles.container}>
      {depositMethods.map((method, index) => (
        <Text key={index} style={styles.method}>
          {method.method}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  method: {
    fontSize: 16,
    marginBottom: 10,
  },
  loading: {
    fontSize: 16,
    color: 'white',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
});

export default DepositMethod;