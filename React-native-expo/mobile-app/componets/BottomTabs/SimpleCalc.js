import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calc from '../TopTabs/Calc';
import Bmi from '../TopTabs/Bmi';

const SimpleCalc = () => {
  
const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Calc" component={Calc} />
      <Tab.Screen name="Bmi" component={Bmi} />
    </Tab.Navigator>
  )
}

export default SimpleCalc

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
}
})