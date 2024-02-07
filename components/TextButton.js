import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from "../constants";

const TextButton = ({label, containerStyle, onPress}) => {
    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderRadius: 15,
                backgroundColor: COLORS.white,
                borderWidth: 1,
                ...containerStyle
            }}
        >
            <Text
                style={{
                    color: COLORS.black,
                    ...FONTS.h3,
                    marginTop: 3
                }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default TextButton;