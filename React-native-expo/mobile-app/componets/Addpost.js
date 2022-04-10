import React,{useLayoutEffect,useState,useEffect} from 'react';
import { StyleSheet, Text, View,Modal,Alert,TouchableOpacity } from 'react-native'
import { Input } from 'react-native-elements'
import Icon from "react-native-vector-icons/FontAwesome"
import {LinearGradient} from 'expo-linear-gradient';
import {Button} from "react-native-paper";
import {FontAwesome} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';

import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements'
import { auth,db } from '../firebase'
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'


const Addpost = ({navigation}) => {
    
useLayoutEffect(() => {
    navigation.setOptions({
        title:"POST",
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
         </View>,
         
        // headerRight: ()=>
        //     <View style={{
        //         flexDirection:"row",
        //         justifyContent:"space-between",
        //         width: 80,
        //         marginRight:20
        //     }}>
        //      <TouchableOpacity activeOpacity={0.5}>
        //          {/* <AntDesign name="camerao" size={24} onPress={() => alert("Still under development mode!!!")} color="#0a7ff5" /> */}
        //          <Image style={{height:28,width:28,color:"#0a7ff5"}} source={{uri: "data:image/webp;base64,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"}}/>
        //      </TouchableOpacity>
        //      <TouchableOpacity  activeOpacity={0.5}>
        //          <SimpleLineIcons name="pencil" size={24} color="#0a7ff5" />
        //      </TouchableOpacity>
        //     </View>
      
    })

}, [])


const [title,setTitle]= useState("")
const [desc,setDesc]= useState("")
const [imageUrl,setImageUrl]=useState("")
const [modal,setModal]= useState(false);


const addPost = async(event) =>{
    event.preventDefault();
    let errors = {};
    if(!title.trim()){
        errors.input=alert(`You can't add a post with out a title`);
    }else{
        await db.collection('posts').add({
            title,
            descriptions:desc,
            photo:imageUrl,
            timestamp:Date.now(),
            allowed:false,
            read:false,
            onwerId:auth?.currentUser?.uid
        }).then(()=>{
            navigation.navigate("Home")
            Alert.alert('Thank you!', "Your post has been sent to the admin for verification. You'll will get feed back in the next 5 mins.")
        }).catch((error)=> alert(error))
    }

}


const pickFromGallery = async ()=>{
    const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
     if(granted){
    let data = await ImagePicker.launchImageLibraryAsync({
         mediaTypes:ImagePicker.MediaTypeOptions.Images,
         allowsEditing:true,
         aspect:[1,1],
         quality:0.5
     })
     if(!data.cancelled){
      let newFile = {uri:data.uri,
      type:`test/${data.uri.split(".")[1]}`,
      name:`test.${data.uri.split(".")[1]}`}
     handleUpload(newFile) 
  }
     }else{
     Alert.alert("You need to give us permission to your phone")
     }
    }
  
    const pickFromCamera = async ()=>{
      const {granted} = await Permissions.askAsync(Permissions.CAMERA)
       if(granted){
      let data = await ImagePicker.launchCameraAsync({
           mediaTypes:ImagePicker.MediaTypeOptions.Images,
           allowsEditing:true,
           aspect:[1,1],
           quality:0.5
       })
       if(!data.cancelled){
           let newFile = {uri:data.uri,
           type:`test/${data.uri.split(".")[1]}`,
           name:`test.${data.uri.split(".")[1]}`}
          handleUpload(newFile) 
       }
       }else{
       Alert.alert("You need to give us permission to your phone")
       }
      }
  
      const handleUpload = (image)=>{
          const data = new FormData()
          data.append('file',image)
          data.append('upload_preset','employeeApp')
          data.append("cloud_name","dtmddq4dw")
  
          fetch("https://api.cloudinary.com/v1_1/dtmddq4dw/image/upload",{
              method:"post",
              body:data,
  
          }).then(res=>res.json())
          .then(data=>{
              setImageUrl(data.url)
              setModal(false)
          }).catch(err=>{
              Alert.alert("Something went wrong")
          })
      }



   return (
    <View style={styles.container}>
         <StatusBar  style="light"/>

        <Input 
        placeholder="Enter title"
        value={title}
        onChangeText={(text)=> setTitle(text)}
        // onSubmitEditing={createChat}


        />

        
     <Input 
        placeholder="Enter description"
        value={desc}
        onChangeText={(text)=> setDesc(text)}
        // onSubmitEditing={createChat}


        />

        <Button 
    icon={imageUrl==""?"upload":"check"}
    style={styles.button}
     mode="contained"
     onPress={() => setModal(true)} 
    >
        Add Image
    </Button>

    {title !== '' && (
        <Button
        style={styles.button1}
         mode="contained"
         onPress={addPost} 
        >
            Add Post
        </Button>
    )}

    <Modal
    animationType="slide"
    transparent={true}
    visible={modal}
    onRequestClose={()=>{
        setModal(false)
    }}
    >
   <View style={styles.modalView}>
       <View style={styles.modalButtonView}>
       <Button 
    icon="camera"
    style={{backgroundColor:"#0a7ff5"}}
     mode="contained" 
     onPress={() => pickFromCamera()} 
    >
        Camera
    </Button>
    <Button 
    icon="image-area"
    style={{backgroundColor:"#0a7ff5"}}
    mode="contained" 
    onPress={() => pickFromGallery()} 
    >
        Gallery
    </Button>
       </View>
   <Button 
   
    onPress={() => setModal(false)} 
    >
        <Text style={{color:"#0a7ff5",fontSize:15}}>Cancel</Text>
    </Button>
   </View>
    </Modal>       
    </View>
)
}

export default Addpost

const styles = StyleSheet.create({
container:{
    backgroundColor:"white",
    padding:30,
    height:"100%"
},
button:{
 width:300,
 marginTop:-15,
 backgroundColor:"#0a7ff5",
},
button1:{
 width:300,
 marginTop:50,
 backgroundColor:"#0a7ff5",
},
modalView:{
 position: "absolute",
 bottom:2,
 width:"100%",
 backgroundColor:"#fff"
},
modalButtonView:{
 flexDirection:"row",
 justifyContent:"space-around",
 padding:10
},
})