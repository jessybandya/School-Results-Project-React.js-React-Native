import { View, StyleSheet, TextInput, Text,SafeAreaView,Image,ScrollView, Alert, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import React,{useState, useEffect} from 'react'
import { auth, db } from '../firebase';

const Posts = ({allowed,descriptions,onwerId,photo,read,timestamp,title,postId,navigation}) => {
    const [profileUserData, setProfileUserData] = useState();
    const [countLikes, setCountLikes] = useState(0)
    const [countComment,setCountComment] = useState(0)
    const [see,setSee] = useState()

    useEffect(() => {
        db.collection('posts').doc(postId).collection("comments").where("count", "==",false)
       .onSnapshot(snapshot => (
        setCountComment(snapshot.docs.length)
       ))
    }, []);


    const likePost = () =>{
        // Alert.alert("Be Aware", "You liked the post!") 
        db.collection("posts").doc(postId).collection("likes").where("fromId", "==", auth?.currentUser?.uid).where("postId", "==",postId ).get().then(
            snap => {
              if (snap.docs.length > 0) {
                db.collection("posts").doc(postId).collection("likes").doc(auth?.currentUser?.uid).delete().then(function() {
                }).catch(function(error) {
                    Alert.alert("Error removing post: ", error);
                });                
            
              } else {
                db.collection("posts").doc(postId).collection("likes").doc(auth?.currentUser?.uid).set({
                      fromId: auth?.currentUser?.uid,
                      onwerId,
                      postId,
                      timestamp:Date.now(),  
                      liked:true,          
                  })
              }
            }
          )
    }

    useEffect(() => {
        db.collection('posts').doc(postId).collection("likes").where("liked","==", true)
       .onSnapshot(snapshot => (
        setCountLikes(snapshot.docs.length)
       ))
    }, []);

      useEffect(() => {
        db.collection('posts').doc(`${postId}`).collection("likes").doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
            setSee(doc.data());
        });
    }, [])



    useEffect(() => {
        db.collection('users').doc(`${onwerId}`).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])

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


        function abbrNum(number, decPlaces) {
            // 2 decimal places => 100, 3 => 1000, etc
            decPlaces = Math.pow(10,decPlaces);
          
            // Enumerate number abbreviations
            var abbrev = [ "K", "M", "B", "T" ];
          
            // Go through the array backwards, so we do the largest first
            for (var i=abbrev.length-1; i>=0; i--) {
          
                // Convert array index to "1000", "1000000", etc
                var size = Math.pow(10,(i+1)*3);
          
                // If the number is bigger or equal do the abbreviation
                if(size <= number) {
                     // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                     // This gives us nice rounding to a particular decimal place.
                     number = Math.round(number*decPlaces/size)/decPlaces;
          
                     // Add the letter for the abbreviation
                     number += abbrev[i];
          
                     // We are done... stop
                     break;
                }
            }
          
            return number;
          }

        const viewPost = (onwerId,postId) =>{
            navigation.navigate("Postview",{
                onwerId,
                postId
            })
         }

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.main}>
        <View style={styles.post} >
            <View style={styles.postHeader}>
              <View style={{flexDirection: "row",justifyContent: "space-between"}}>
              <View>
          <Image  style={{height:60,width:60,borderRadius:60/2}} source={{uri:profileUserData?.photoURL}} />
         </View>
         <View>
             <View>
             <Text style={{fontSize:18,fontWeight:"bold",marginLeft:5}}>{profileUserData?.firstName} {profileUserData?.lastName}          
             </Text>
             </View>
             <View>
         <Text style={{marginLeft:5,color:"#666"}}>@{profileUserData?.username}         
                    </Text>
         </View>
         <View>
         <Text style={{marginLeft:10,marginTop:2,color: "#AEAEAE"}}>{formatted}</Text>
         </View>
             </View>                
              </View>
              <View>
              <Feather  name="more-horizontal" size={24} color="#08d4c4" />    
              </View>
            </View>
            <View
  style={{
    borderBottomColor: '#08d4c4',
    borderBottomWidth: 1,
    marginBottom:-10,
    marginTop:15
  }}
/>
            <TouchableWithoutFeedback onPress={() => viewPost(onwerId,postId)}>
            <View>
             <Text style={{marginTop:12,fontWeight:"bold", textAlign:"center",textTransform:"uppercase",color:"#4F4F4F"}}>{title}</Text>
         </View>
         </TouchableWithoutFeedback>
         <View
  style={{
    borderBottomColor: '#08d4c4',
    borderBottomWidth: 1,
    marginBottom:5
  }}
/>
          {photo === '' ?(
                <TouchableWithoutFeedback onPress={() => viewPost(onwerId,postId)}>
              <View>
                  {/* <Text>{descriptions}</Text> */}
              </View>
              </TouchableWithoutFeedback>
          ):(
              <>
                      <TouchableWithoutFeedback onPress={() => viewPost(onwerId,postId)}>
                     <View>
            {/* <Text>{descriptions}</Text> */}
                 </View>
                    </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => viewPost(onwerId,postId)}>
        <View style={styles.postImage}>
                <Image  style={{height:350,width:"100%",objectFit: "contain",marginRight:10,borderRadius:8}} source={{uri: photo}} />
                </View>     
        </TouchableWithoutFeedback> 
   
              </>

          )}

         <View style={styles.postFooter}>
         <View style={{flexDirection: "row",alignItems: "center",alignContent:"center"}}>
          {/* <AntDesign name="like2" size={24} color="#08d4c4" /> */}
          {see?.liked === true &&(
    <AntDesign name="like1" size={24} color="#08d4c4" onPress={likePost} />

    )}
    {see?.liked !== true &&(
    <AntDesign name="like2" size={24} color="#08d4c4" onPress={likePost} />
    )}
          <Text style={{marginLeft:2,fontSize:16,fontWeight:"500",marginTop:3}}>{abbrNum(countLikes,0)}</Text>
         </View>
                  <View style={{flexDirection: "row",alignItems: "center"}}>
          <FontAwesome onPress={() => navigation.navigate("Postview")} name="comment-o" size={24} color="#08d4c4" />
          <Text style={{marginLeft:2,fontSize:16,fontWeight:"500",marginTop:3}}>{abbrNum(countComment,0)}</Text>
         </View>
         <AntDesign name="sharealt" size={24} color="#08d4c4" />
         </View>
         </View>
        </ScrollView>     
    </SafeAreaView>
  )
}

export default Posts

const styles = StyleSheet.create({
    post:{
       marginTop:5,
       borderWidth: 1,
       borderColor: "#08d4c4",
       borderRadius: 10,
       padding:5
    },
    postFooter:{
      flexDirection: "row",
      justifyContent:"space-between",
      padding:15,
      height: 55,
      backgroundColor: "#ecf0f1",
      alignItems: "center",
      borderRadius:15,
      marginTop:5
    },
    postImage:{
    },
    postHeader:{
     flexDirection: "row",
     justifyContent: "space-between"
    },
    main:{
      backgroundColor: "#fff"
    },
    headerRight:{
      flexDirection: "row",
      alignItems: "center",
    },
    headerCenter:{
      flexDirection: "row",
      alignItems: "center",
      height:30,
      backgroundColor:"#ecf0f1",
      width:180,
      borderRadius: 20,
      padding:5
    },
    headerText:{
      color:"blue",
      fontSize:18,
      fontWeight: "400"
    },
    header:{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 5
    },
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: '#fff',
    },
  });