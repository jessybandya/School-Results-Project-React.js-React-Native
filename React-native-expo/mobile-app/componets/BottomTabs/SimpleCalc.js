import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SimpleCalc = () => {
  return (
    <View style={styles.container}>
      <Text>E-Calclulator</Text>
    </View>
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