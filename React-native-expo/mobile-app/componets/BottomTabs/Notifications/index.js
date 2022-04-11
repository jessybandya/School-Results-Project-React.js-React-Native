import { View, StyleSheet, TextInput, Text,SafeAreaView,Image,ScrollView, Alert, TouchableOpacity, Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView,Platform } from 'react-native';
import { db,auth } from "../../../firebase"
import React,{useState, useEffect, useLayoutEffect} from 'react'
import Book from './Book';

const Notifications = ({navigation}) => {
    const [notifications, setNotifications] = useState([])



    useEffect(()=>{
        const unsuscribe = db.collection('posts').where("onwerId","==",auth?.currentUser?.uid).where("allowed","==",true).onSnapshot(snapshot =>{
            setNotifications(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
            <ScrollView>
                {notifications.length > 0 ?(
                    <>
              {notifications.map(({ id,data:{allowed,onwerId,descriptions,title}})=>(
                //   <CommentsN1  key={id}  postId={postId} navigation={navigation} fromId={fromId} read={read}  timestamp={timestamp}/>
                <Book key={id} postId={id} navigation={navigation} allowed={allowed} onwerId={onwerId} descriptions={descriptions} title={title}/>
              ))}  
              </>                
                ):(
                    <View>
                        <Text style={{textAlign:"center"}}>No Notifications</Text>
                    </View>
                )}

            </ScrollView>
             
        </View>
    )
}

export default Notifications 
const styles = StyleSheet.create({
    container:{
     paddingBottom:100
    }
})