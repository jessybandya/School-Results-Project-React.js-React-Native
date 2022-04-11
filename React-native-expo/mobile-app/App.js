import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from "./screens/HomeScreen"
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Addpost from './componets/Addpost';
import PostView from './componets/PostView';

const Stack = createNativeStackNavigator();
// const myOptions ={
//   title:"Home",
//   headerTintColor:"white",
//   headerStyle:{
//     backgroundColor:"#1ecbe1",
//   }
  
// }
const globalScreenOptions = {
  headerStyle:{
    backgroundColor:"#0a7ff5",
  },
  headerTitleStyle: {color: "white",
  
},
  headerTintColor: "white",
  headerTitleAlign: 'center'
}


export default function App() {
  return (
    <NavigationContainer >
    <Stack.Navigator 
    initialRouteName="Home"
    screenOptions={globalScreenOptions}>
    <Stack.Screen name="SignIn" component={SignInScreen}/>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Addpost" component={Addpost} />
    <Stack.Screen name="Postview" component={PostView} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
