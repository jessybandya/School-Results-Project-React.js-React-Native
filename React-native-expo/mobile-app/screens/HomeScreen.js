import React,{useLayoutEffect,useState,useEffect} from 'react';
import { 
    View, 
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import {Entypo} from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../componets/BottomTabs/Home';
import SimpleCalc from '../componets/BottomTabs/SimpleCalc';
import Elibrary from '../componets/BottomTabs/Elibrary';
import Profile from '../componets/BottomTabs/Profile';
import Notifications from '../componets/BottomTabs/Notifications';
import { AntDesign } from '@expo/vector-icons'; 

const HomeScreen = ({navigation}) => {
  const Tab = createMaterialBottomTabNavigator();
  const [profileUserData, setProfileUserData] = useState();
  const [badgeCount,setBadgeCount] = useState(0)
  const [see,setSee] = useState()

  useEffect(() => {
    db.collection('posts').where("onwerId","==",auth?.currentUser?.uid).where("allowed","==",true)
     .onSnapshot(snapshot => (
      setBadgeCount(snapshot.docs.length)
     ))
  }, []);

  useEffect(() => {
    db.collection('users').doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
        setProfileUserData(doc.data());
    });
}, [])

  if(!auth.currentUser?.uid){
    navigation.navigate("SignIn")
}

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
                       {/* <Avatar rounded source={{ uri:profileUserData?.photoURL}}/>   */}
                       <AntDesign name="logout" size={24} color="#fff" />
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


  return (
    <>
        <StatusBar style='light'/>
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#f0edf6"
      barStyle={{ 

        
        
        borderTopLeftRadius:21, 
        borderTopRightRadius:21,
        backgroundColor:"#0a7ff5",
        position:'absolute',
        bottom: 0,
        padding:6,
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