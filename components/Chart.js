import React from "react";
import { View, Text, Dimensions } from 'react-native';
import { ChartDot, ChartPath, ChartPathProvider, ChartXLabel, ChartYLabel, monotoneCubicInterpolation } from "@rainbow-me/animated-charts";
import moment from "moment";
import { LineChart } from 'react-native-wagmi-charts';
import { SIZES, COLORS, FONTS } from "../constants";
import { TradingViewWidget } from "../screens/Currency";

/*const data = [
    {
      timestamp: 1625945400000,
      value: 33575.25,
    },
    {
      timestamp: 1625946300000,
      value: 33545.25,
    },
    {
      timestamp: 1625947200000,
      value: 33510.25,
    },
    {
      timestamp: 1625948100000,
      value: 33215.25,
    },
];*/

const Chart = ({containerStyle, chartPrices}) => {

    let data = [
        {
          timestamp: 1625945400000,
          value: 33575.25,
        },
        {
          timestamp: 1625946300000,
          value: 33545.25,
        },
        {
          timestamp: 1625947200000,
          value: 33510.25,
        },
        {
          timestamp: 1625948100000,
          value: 33215.25,
        },
    ];
    // Points
    /*let startUnixTimeStamp = moment().subtract(7, 'day').unix()
    let data = chartPrices ? chartPrices?.map((item, index) => {
        return {
            x: startUnixTimeStamp + (index + 1) * 3600,
            y: item
        }
    }) : []*/

    //let priceFinal = chartPrices ? chartPrices?.map(([timestamp, value]) => ({ timestamp, value }))

    return (
        <View 
            marginTop={40} 
            backgroundColor={COLORS.lightGray3} 
            borderRadius={25}
            height={200} 
            borderColor={COLORS.black}
            borderWidth={1}
        >
            {/* Y Axis Label */}
            <View 
                style={{
                    position: 'absolute',
                    left: SIZES.padding,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'space_between'
                }}
            >
                {/* getYAxisLabelvalues */}
            </View>

            {/* Chart */}
            {
                data.length > 0 &&
                <LineChart.Provider data={data}>
                    <LineChart 
                        width={SIZES.width} 
                        height={190}
                    >
                        {/* Line */}
                        <LineChart.Path 
                            color={COLORS.red} 
                            width={2}
                        >
                            {/* Gradient */}
                            <LineChart.Gradient color={COLORS.red}/>
                        </LineChart.Path>

                        {/* CursorCrosshair / Dot */}
                        <LineChart.CursorCrosshair color={COLORS.white}>
                            
                            {/* Tooltip Customization */}
                            <LineChart.Tooltip
                                textStyle={{
                                    backgroundColor: COLORS.black,
                                    borderRadius: 4,
                                    color: 'white',
                                    fontSize: 18,
                                    padding: 4,
                                }}
                            />
                            <LineChart.Tooltip position="bottom">
                                <LineChart.DatetimeText
                                    locale="en-AU"
                                    options={{
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric'
                                    }}
                                />
                            </LineChart.Tooltip>
                        </LineChart.CursorCrosshair>
                    </LineChart>
                </LineChart.Provider>
            }
        </View>
    )
}

export default Chart;