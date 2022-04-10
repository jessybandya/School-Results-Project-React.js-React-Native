import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Elibrary = () => {
  return (
    <View style={styles.container}>
      <Text>E-Library</Text>
    </View>
  )
}

export default Elibrary

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
}
})