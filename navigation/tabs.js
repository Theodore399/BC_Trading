import React from "react";
import { TouchableOpacity} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { connect } from "react-redux";
import { setTradeModelVisibility } from "../stores/tab/tabActions";
import { Home, Portfolio, Market, Graph, Currency } from "../screens"
import { TabIcon } from '../components';
import { COLORS, icons } from "../constants"

const Tab = createBottomTabNavigator()

const TabBarCustomButton = ({children, onPress}) => {
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={onPress}
        >{children}</TouchableOpacity>
    )
}

const Tabs = ({setTradeModelVisibility, isTradeModelVisible}) => {

function tradeTabButtonOnClickHandler() {
    setTradeModelVisibility(!isTradeModelVisible)
}

    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    height: 80,
                    backgroundColor: COLORS.lightGray3,
                    borderTopColor: "transparent",
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <TabIcon 
                                focused={focused}
                                icon={icons.home}
                                label='Home'
                            />
                        )
                    } 
                }}
            />
            <Tab.Screen
                name="Portfolio"
                component={Portfolio}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <TabIcon 
                                focused={focused}
                                icon={icons.portfolio}
                                label='Portfolio'
                            />
                        )
                    } 
                }}
            />
            <Tab.Screen
                name="Currency"
                component={Currency}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <TabIcon 
                                focused={focused}
                                icon={icons.trade}
                                label='Trade'
                                isTrade={true}
                            />
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Market"
                component={Market}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <TabIcon 
                                focused={focused}
                                icon={icons.market}
                                label='Market'
                            />
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Graph"
                component={Graph}
                options={{
                    tabBarIcon: ({focused}) => {
                        return (
                            <TabIcon 
                                focused={focused}
                                icon={icons.chart}
                                label='Chart'
                            />
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

//export default Tabs;

function mapStateToProps(state) {
    return {
        isTradeModelVisible: state.tabReducer.isTradeModelVisible
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setTradeModelVisibility: (isVisible) => {return dispatch(setTradeModelVisibility(isVisible))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);