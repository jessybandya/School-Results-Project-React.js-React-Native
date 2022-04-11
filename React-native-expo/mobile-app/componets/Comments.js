import React, { useState,useEffect,useContext } from 'react'
import { StyleSheet,View, Text,Image,SafeAreaView,ScrollView,Modal,TouchableOpacity,Alert } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import { Card } from 'react-native-paper'
import { auth, db } from "../firebase"
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
// import moment from "moment";
import { EvilIcons } from '@expo/vector-icons'; 
import {TextInput,Button} from "react-native-paper";
import {  Input } from 'react-native-elements';

const Comments = ({fromId,read,count,timestamp,comment,toId,navigation,commentId,postId}) => {
  const [posts,setPosts]= useState([])
  const [modal,setModal]= useState(false);
  const [input,setInput] = useState("")
  const [profileUserData, setProfileUserData] = useState();
  const [comments,setComments] = useState([])
  const [countComment,setCountComment] = useState(0)
  const [countLikes, setCountLikes] = useState(0)
  const [show, setShow] = useState('like2');
  const [show2, setShow2] = useState('textforlike');
  const [see,setSee] = useState()
  useEffect(() => {
    db.collection('posts').doc(postId).collection("comments").doc(commentId).collection("likes").where("liked","==", true)
   .onSnapshot(snapshot => (
    setCountLikes(snapshot.docs.length)
   ))
}, []);

  useEffect(() => {
    db.collection('posts').doc(`${postId}`).collection("comments").doc(commentId).collection("likes").doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
        setSee(doc.data());
    });
}, [])

  const likePost = () =>{
    // Alert.alert("Be Aware", "You liked the post!") 
    db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("likes").where("fromId", "==", auth?.currentUser?.uid).where("commentId", "==",commentId ).get().then(
        snap => {
          if (snap.docs.length > 0) {
            db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("likes").doc(auth?.currentUser?.uid).delete().then(function() {
            }).catch(function(error) {
                Alert.alert("Error removing post: ", error);
            });                
        
          } else {
            db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("likes").doc(auth?.currentUser?.uid).set({
                  fromId: auth?.currentUser?.uid,
                  onwerId:toId,
                  commentId,
                  timestamp:Date.now(),  
                  liked:true,          
              })
          }
        }
      )
}

  useEffect(() => {
    db.collection('users').doc(`${fromId}`).onSnapshot((doc) => {
        setProfileUserData(doc.data());
    });
}, [])

  useEffect(() => {
    db.collection('posts').doc(postId).collection("comments").doc(commentId).collection("replies").where("count", "==",false)
   .onSnapshot(snapshot => (
    setCountComment(snapshot.docs.length)
   ))
}, []);

var t = new Date(timestamp);
var hours = t.getHours();
var minutes = t.getMinutes();
var newformat = t.getHours() >= 12 ? 'PM' : 'AM';  

// Find current hour in AM-PM Format 
hours = hours % 12;  

// To display "0" as "12" 
hours = hours ? hours : 12;  
minutes = minutes < 10 ? '0' + minutes : minutes; 
var formatted = 
    (t.toString().split(' ')[0]) 
    + ', ' +('0' + t.getDate()).slice(-2) 
    + '/' + ('0' + (t.getMonth() + 1) ).slice(-2)
    + '/' + (t.getFullYear())
    + ' - ' + ('0' + t.getHours()).slice(-2)
    + ':' + ('0' + t.getMinutes()).slice(-2)
    + ' ' + newformat;

  return (
    <View style={styles.container}>
    <Card key={commentId} 
style={[styles.containerImage,{marginTop:10}]}
// onPress={()=> commentReply({ownerId:fromId,commentId:commentId,postId:postId})}
>
<View style={styles.feedItem} >


<Image source={{uri: profileUserData?.photoURL}} style={styles.avatar} />



<View style={{ flex: 1 }}>
<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
<View>

  <>
 <View>
<Text style={styles.name1}>{profileUserData?.firstName} {profileUserData?.lastName}</Text>
</View> 
<View>
<Text style={styles.name}>@{profileUserData?.username}</Text>
</View> 
  </>




<Text style={[styles.post,{maxWidth:250}]}>{comment}</Text>
</View>

{/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => setModal(true)} /> */}
</View>
<Text style={[styles.timestamp,{marginTop:10}]}>{formatted}</Text>
<View style={{ flexDirection: "row" }}>
{see?.liked === true &&(
    <AntDesign name="like1" size={15} color="#08d4c4" onPress={likePost} />

    )}
    {see?.liked !== true &&(
    <AntDesign name="like2" size={15} color="#08d4c4" onPress={likePost} />
    
    )}
<Text style={{ marginRight: 16,marginTop:0 }}>{countLikes}</Text>
{/* <Ionicons name="ios-chatbox-outline" onPress={()=> commentReply({ownerId:fromId,commentId:commentId,postId:postId})} size={24} color="#73788B" /> */}
{/* <Text>{countComment}</Text> */}
</View>
</View>
</View>

</Card>

</View>
  )
}

export default Comments


const styles = StyleSheet.create({
    
    feed: {
        marginHorizontal: 16,

    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        // marginVertical: 8,
        paddingBottom:0,
        borderWidth: 1,
        borderColor: "#08d4c4",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    name1: {
      fontSize: 15,
      fontWeight: "500",
      color: "#454D65",
      fontWeight: 'bold'
  },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 300,
        borderRadius: 5,
        marginVertical: 16
    },
    footer:{
      flexDirection:"row",
      alignItems: "center",
      width: "100%",
      padding: 15
    },
    textInput:{
    //    bottom:0,
       height:80,
       flex:1,
    //    marginRight:15,
    //    borderColor: "transparent",
       backgroundColor: "#ECECEC",
       padding:10,
       color: "grey",
       borderRadius: 15,
    }
    ,
    modalView:{
    //  position: "absolute",
     top:50,
    //  width:"100%",
     backgroundColor:"#D3D3D3",
     padding:10,
     margin:20
 },
 modalButtonView:{
     flexDirection:"row",
     justifyContent:"space-around",
     padding:10
 },
 textInput:{
 //    bottom:0,
    height:80,
    flex:1,
 //    marginRight:15,
 //    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding:10,
    color: "grey",
    borderRadius: 15,
 },
 footer:{
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    padding: 15
  },
})