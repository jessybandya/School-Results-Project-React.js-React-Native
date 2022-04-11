import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Constants from 'expo-constants';

export default function Bmi() {
  const [weight, setweight] = useState(0)
  const [height, setheight] = useState('')
  const [result, setResult] = useState(0)
  const [resultText, setResultText] = useState('')

  function calcular() {
    const result = weight / (Math.pow(height, 2))
    setResult(result)

    if (result < 17) {
      setResultText('Underweight (Severe thinness)')
    } else if (result < 18.5) {
      setResultText('Underweight (Moderate thinness)')
    } else if (result < 25) {
      setResultText('Underweight (Mild thinness) ')
    } else if (result < 30) {
      setResultText('Overweight (Pre-obese)')
    } else if (result < 35) {
      setResultText('Obese (Class I)')
    } else if (result < 40) {
      setResultText('Obese (Class II) ')
    } else if (result >= 40) {
      setResultText('Obese (Class III) ')
    } else {
      setResultText('')
      setResult(0)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inputs} >
        <TextInput
          placeholder="Weight"
          placeholderTextColor={'gray'}
          keyboardType="numeric"
          returnKeyType="done"
          style={styles.input}
          onChangeText={(weight) => setweight(weight)}
        />
        <TextInputMask
          placeholder="Height"
          placeholderTextColor={'gray'}
          keyboardType="numeric"
          returnKeyType="done"
          style={styles.input}
          type={'money'}
          options={{
            precision: 2,
            separator: '.',
            delimiter: '.',
            unit: '',
            suffixUnit: ''
          }}
          value={height}
          onChangeText={(height) => {setheight(height)}}
        />
      </View>
      <TouchableOpacity onPress={calcular} style={styles.button} activeOpacity={0.6}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      <Text style={styles.result}>{result.toFixed(2)}</Text>
      <Text style={[styles.result, { fontSize: 35 }]}>{resultText}</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  inputs: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  input: {
    height: 80,
    width: '46.6%',
    textAlign: 'center',
    fontSize: 50,
    color: 'gray',
    borderWidth:1,
    borderColor:"#08d4c4",
    padding:5,
    margin:5,
    borderRadius:8
  },
  button: {
    backgroundColor: '#0a7ff5',
    marginHorizontal: 80,
    borderRadius: 8,
  },
  buttonText: {
    padding: 30,
    alignSelf: 'center',
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold'
  },
  result: {
    alignSelf: 'center',
    color: 'gray',
    fontSize: 65,
    padding: 15,
  },
});