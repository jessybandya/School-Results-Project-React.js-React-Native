import React,{useLayoutEffect,useState,useEffect} from 'react';
import { StyleSheet, Text, View,Modal,Alert,TouchableOpacity,SafeAreaView, Image, TextInput } from 'react-native'
import {Button} from "react-native-paper";
import { auth,db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'


const Addpost = ({navigation}) => {
    const [title,setTitle]= useState("")
    const [desc,setDesc]= useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [modal,setModal]= useState(false);
    const [profileUserData, setProfileUserData] = useState();

    useEffect(() => {
        db.collection('users').doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])

    
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
<SafeAreaView style={styles.container}>
<View style={styles.inputContainer}>
    <Image source={{uri: profileUserData?.photoURL}} style={styles.avatar}></Image>
    <TextInput
        autoFocus={true}
        multiline={true}
        numberOfLines={2}
        style={{ flex: 1,
            borderBottomWidth: 2,
            borderBottomColor: "#08d4c4",
         }}
        placeholder="Title..."
        value={title}
        onChangeText={(text)=> setTitle(text)}

    ></TextInput>
    <TouchableOpacity style={styles.photo}onPress={() => setModal(true)} >
    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
</TouchableOpacity>
</View>

<View style={styles.inputContainer1}>
    <TextInput
        autoFocus={true}
        multiline={true}
        numberOfLines={4}
        style={{ flex: 1,
            borderBottomWidth: 2,
            borderBottomColor: "#08d4c4",
            paddingRight:10,
            marginRight:50
         }}
        placeholder="Description..."
        value={desc}
        onChangeText={(text)=> setDesc(text)}
    ></TextInput>

</View>
{title !== '' && desc !== '' &&(
        <Button
        style={styles.button1}
         mode="contained"
         onPress={addPost} 
        >
            Add Post
        </Button>
    )}

<View style={{marginTop: 32, height: "50%",width:"100%" }}>
    {imageUrl ?(
    <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }}/>
    ):(
        <Text style={{margin:85}}>No image has been selected</Text>
    )}
</View>
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
    style={{backgroundColor:"#08d4c4"}}
     mode="contained" 
     onPress={() => pickFromCamera()} 
    >
        Camera
    </Button>
    <Button 
    icon="image-area"
    style={{backgroundColor:"#08d4c4"}}
    mode="contained" 
    onPress={() => pickFromGallery()} 
    >
        Gallery
    </Button>
       </View>
   <Button 
   
    onPress={() => setModal(false)} 
    >
        <Text style={{color:"#08d4c4",fontSize:15}}>Cancel</Text>
    </Button>
   </View>
    </Modal> 
</SafeAreaView>
)
}
export default Addpost

const styles = StyleSheet.create({
    container: {
        flex: 1,
     backgroundColor:"white",
      height:"100%"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        marginTop:50
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },inputContainer1: {
        marginTop: 0,
        marginLeft:100,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        marginHorizontal: 0
    },
    button:{
 width:300,
 marginTop:-15,
 backgroundColor:"#08d4c4",
},
button1:{
 width:300,
 margin:25,
 backgroundColor:"#08d4c4",
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
});