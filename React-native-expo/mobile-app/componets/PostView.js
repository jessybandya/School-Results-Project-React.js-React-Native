import { View, StyleSheet, TextInput, Text,SafeAreaView,Image,ScrollView, Alert, TouchableOpacity, Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView,Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import React,{useEffect,useState,useLayoutEffect,useCallback } from 'react'
import { db,auth } from '../firebase';
import Comments from './Comments';

const PostView = ({navigation,route}) => {
    const { onwerId, postId } = route.params;
    const [profileUserData, setProfileUserData] = useState();
    const [profileUserData1, setProfileUserData1] = useState();
    const [post, setPost] = useState();
    const [countLikes, setCountLikes] = useState(0)
    const [see,setSee] = useState()
    const [comment, setComment] = useState('')
    const [countComment,setCountComment] = useState(0)


    const [posts1, setPosts1] = useState([])

    useEffect(()=>{
      const unsuscribe = db.collection('posts').doc(postId).collection("comments").orderBy("timestamp","desc").onSnapshot(snapshot =>{
         setPosts1(snapshot.docs.map(doc =>({
             id:doc.id,
             data:doc.data()
         })))
      })
      return unsuscribe
    },[])


                 

    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => { //To toggle the show text or hide it
        setTextShown(!textShown);
    }
    
    const onTextLayout = useCallback(e =>{
        setLengthMore(e.nativeEvent.lines.length >=2); //to check the text is more than 4 lines or not
        // console.log(e.nativeEvent);
    },[]);

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

    useEffect(() => {
        db.collection('users').doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
            setProfileUserData1(doc.data());
        });
    }, [])

    useEffect(() => {
        db.collection('posts').doc(`${postId}`).onSnapshot((doc) => {
            setPost(doc.data());
        });
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title:`Post`,
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
                 <TouchableOpacity onPress={navigation.goBack}  activeOpacity={0.5}>
                     <Ionicons name="chevron-back-outline" size={36} color="#fff" />
                </TouchableOpacity>    
                <TouchableOpacity onPress={navigation.goBack}  activeOpacity={0.5}>
                     <Text style={{color:"#fff",fontSize:19,marginLeft:-8,fontWeight:"800"}}>Back</Text>
                </TouchableOpacity>          
             </View>     
        })
    }, []) 


    var t = new Date(post?.timestamp);
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

          const postComment = (event) => {
            event.preventDefault();
            Keyboard.dismiss()
            let errors = {};
    
            if(!comment.trim()){
                errors.comment = Alert.alert('Pardon!',`Comment Field is empty!!!`);
            }else{
                db.collection("comments").add({
                    comment,
                    read: false,
                    count:false,
                    postId:postId,
                    toId:onwerId,
                    fromId: auth?.currentUser?.uid,
                    timestamp: Date.now(),
                })
                db.collection("posts").doc(`${postId}`).collection("comments").add({
                    comment,
                    read: false,
                    count:false,
                    postId:postId,
                    toId:onwerId,
                    fromId: auth?.currentUser?.uid,
                    timestamp: Date.now(),
                });
                setComment('');
            }
    
    
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
            <View>
             <Text style={{marginTop:12,fontWeight:"bold", textAlign:"center",textTransform:"uppercase",color:"#4F4F4F"}}>{post?.title}</Text>
         </View>
         
         <View
  style={{
    borderBottomColor: '#08d4c4',
    borderBottomWidth: 1,
    marginBottom:5
  }}
/>
          {post?.photo === '' ?(
                
              <View>
                  <Text>{post?.descriptions}</Text>
              </View>
              
          ):(
              <>
                      
                     <View>
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 2}
              style={{ lineHeight: 21 }}>{post?.descriptions}</Text>

              {
                  lengthMore ? <Text
                  onPress={toggleNumberOfLines}
                  style={{ lineHeight: 21, marginTop: 6,fontWeight:'bold',color:"#88888888" }}>{textShown ? 'Read less...' : 'Read more...'}</Text>
                  :null
              }
                 </View>
                    
        
        <View style={styles.postImage}>
                <Image  style={{height:290,width:"100%",objectFit: "contain",marginRight:10,borderRadius:8}} source={{uri: post?.photo}} />
                </View>    
         
   
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
          <Text style={{marginLeft:2,fontSize:16,fontWeight:"500",marginTop:3}}>{abbrNum(countLikes,1)}</Text>
         </View>
                  <View style={{flexDirection: "row",alignItems: "center"}}>
          <FontAwesome  name="comment-o" size={24} color="#08d4c4" />
          <Text style={{marginLeft:2,fontSize:16,fontWeight:"500",marginTop:3}}>{abbrNum(countComment,1)}</Text>
         </View>
         <AntDesign name="sharealt" size={24} color="#08d4c4" />
         </View>
         </View>

         {
      posts1.map(({ id,data: {fromId,read,count,timestamp,comment,toId}})=>(
                     <Comments  key={id}  postId={postId} navigation={navigation} commentId={id}  fromId={fromId}   read={read} count={count} comment={comment} toId={toId} timestamp={timestamp} />
                 ))
                 }
        </ScrollView> 

                                <View style={styles.footer}>
                        <Image source={{uri: profileUserData1?.photoURL}} style={styles.avatar} />

               <TextInput 
                                       multiline={true}
               placeholder="comment here..."
               style={styles.textInput}
               value={comment}
               onChangeText={(text)=> setComment(text)}
               />
               <TouchableOpacity  activeOpacity={0.5}>
                 <Ionicons name="send" style ={{marginLeft:8}} size={24} color="#08d4c4" onPress={postComment}/>
               </TouchableOpacity>
            </View>    
    </SafeAreaView>
  )
}

export default PostView

const styles = StyleSheet.create({
    post:{
       marginTop:0,
       borderWidth: 1,
       borderColor: "#08d4c4",
       borderRadius: 10,
       padding:10,
    },
    footer:{
        flexDirection:"row",
        alignItems: "center",
        width: "100%",
        padding: 15
      },
      avatar: {
        width: 45,
        height: 45,
        borderRadius: 45/2,
        marginRight: 5
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
    textInput:{
        //    bottom:0,
           height:50,
           flex:1,
           backgroundColor: "#ECECEC",
           padding:10,
           color: "grey",
           borderRadius: 20,
        },
  });