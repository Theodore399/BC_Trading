import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './stores/rootReducer';

import Tabs from './navigation/tabs';
import Home from './screens/Home';
import Portfolio from './screens/Portfolio';
import Trade from './screens/Currency';
import Chart from './screens/Graph';
import Profile from './screens/Profile';

const Stack = createStackNavigator();

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'Main'}>
                    <Stack.Screen name="Main" component={Tabs}/>
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Portfolio" component={Portfolio}/>
                    <Stack.Screen name="Trade" component={Trade}/>
                    <Stack.Screen name="Chart" component={Chart}/>
                    <Stack.Screen name="Profile" component={Profile}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default App;