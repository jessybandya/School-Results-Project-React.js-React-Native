import React,{useLayoutEffect,useState,useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    Alert,
    Image,
    Animated,
    ScrollView

} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {FontAwesome} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';

import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements'
import { auth,db } from '../firebase'
import {AntDesign, SimpleLineIcons, Entypo} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'; 
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../componets/BottomTabs/Home';
import SimpleCalc from '../componets/BottomTabs/SimpleCalc';
import Elibrary from '../componets/BottomTabs/Elibrary';
import Profile from '../componets/BottomTabs/Profile';
import Notifications from '../componets/BottomTabs/Notifications';


const HomeScreen = ({navigation}) => {
  if(!auth.currentUser?.uid){
    navigation.navigate("SignIn")
}


const Tab = createMaterialBottomTabNavigator();


const signOut = () =>{
  auth.signOut()
  .then(()=> {
      navigation.replace('SignIn')
  })
}



useLayoutEffect(() => {
  navigation.setOptions({
      title:"",
      headerStyle : {
          backgroundColor: "#0a7ff5",
      }, 
    headerTitleStyle: {
    color: "#fff",
    fontWeight:"800",
    fontSize:23
  },
    headerLeft: ()=>
       <View style={{alignItems:"center",flexDirection:"row"}}>
                   <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                       <View>
                       <Avatar rounded source={{ uri:auth?.currentUser?.photoURL}}/>  
                       </View>
                  </TouchableOpacity>         
       </View>,
       
      headerRight: ()=>
          <View style={{
              flexDirection:"row",
              justifyContent:"space-between",
              width: 80,
              
          }}>
           <TouchableOpacity activeOpacity={0.5}>
           </TouchableOpacity>
           <TouchableOpacity  activeOpacity={0.5} onPress={() => navigation.navigate('Addpost')}>
               <Entypo name="add-to-list" size={24} color="#fff" />
           </TouchableOpacity>
          </View>
    
  })

}, [])

var badgeCount = 12

  return (
    <>
        <StatusBar style='light'/>
    <Tab.Navigator
      initialRouteName="Feed"
      // activeColor="#fff"
      activeColor="#f0edf6"
      barStyle={{ 

        
        
        borderTopLeftRadius:21, 
        borderTopRightRadius:21,
        backgroundColor:"#0a7ff5",
        position:'absolute',
        bottom: 0,
        padding:6,
        // width: DEVICE_WIDTH,
        height: 60,
        zIndex: 8 
       }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="E-Library"
        component={Elibrary}
        options={{
          tabBarLabel: 'E-Library',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book" color={color} size={26} />
          ),
        }}
      />
            <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarBadge: badgeCount ? badgeCount : null,                         
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
            <Tab.Screen
        name="Calculator"
        component={SimpleCalc}
        options={{
          tabBarLabel: 'Calculator(s)',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calculator" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
    </>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });