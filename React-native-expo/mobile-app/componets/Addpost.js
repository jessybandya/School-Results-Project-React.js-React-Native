import React,{useLayoutEffect,useState} from 'react';
import { StyleSheet, Text, View,Modal,Alert,TouchableOpacity } from 'react-native'
import { Input } from 'react-native-elements'
import {Button} from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import { auth,db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'


const Addpost = ({navigation}) => {
    const [title,setTitle]= useState("")
    const [desc,setDesc]= useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [modal,setModal]= useState(false);

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
         </View>      
    })
}, [])


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
        />        
     <Input 
        placeholder="Enter description"
        value={desc}
        onChangeText={(text)=> setDesc(text)}
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