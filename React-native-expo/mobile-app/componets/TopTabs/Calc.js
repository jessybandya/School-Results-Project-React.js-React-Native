import React from 'react';
import { View } from 'react-native';
import Calculator from 'react-native-scientific-calculator';

const Calc = () => {
    return (
        <View style={{flex: 1,marginBottom:60}}>
            <Calculator
                showLiveResult={true} 
                scientific={true}
                theme="light"
                customize={{
                    borderRadius: 5,
                    spacing: 2
                }}
            />
        </View>
    )
}

export default Calc;