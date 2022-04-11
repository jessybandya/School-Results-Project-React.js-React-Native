import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,ActivityIndicator,TouchableOpacity, Alert  } from 'react-native'
import { auth,db } from '../../firebase';
import { Ionicons } from "@expo/vector-icons";
import Posts from '../Posts';
import { Feather } from '@expo/vector-icons'; 

const Home = ({navigation}) => {
  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState([])
  const [loading,setLoading] = useState(true)



useEffect(()=>{

  try{
      setLoading(true)

      const unsuscribe = db.collection('posts').where("allowed", "==", true).onSnapshot(snapshot =>{
          setPosts(snapshot.docs.map(doc =>({
              id:doc.id,
              data:doc.data()
          })))
       })   
       return unsuscribe

  }catch(error){
      Alert.alert("Error @Fetching: ",error.message)
  }finally{
      setLoading(false)
  }

},[])
  return (
    <View style={styles.container}>

<View style={styles.feedContainer}>
<ScrollView style={styles.container}>
{loading ?
<ActivityIndicator size="large" color="#0000ff" />

:
<>
{posts.length > 0 ?(
  <>
  {posts.map(({ id,data: {allowed,descriptions,onwerId,photo,read,timestamp,title}})=>(
<Posts key={id} allowed={allowed} descriptions={descriptions} onwerId={onwerId} photo={photo} read={read} timestamp={timestamp} title={title} postId={id} navigation={navigation}/>
))}
  </>
):(
  <View style={styles.container1}>
    <TouchableOpacity onPress={() => navigation.navigate('Addpost')} activeOpacity={0.5}>
    <Feather name="upload" size={50} color="black" />
  <Text>No Post!</Text>
    </TouchableOpacity>

  </View>
)}

</>     
}



{/* <PostCard /> */}
<View style={{paddingBottom:80}}/>
</ScrollView>
</View>
</View>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
      // flex:1,
      padding:3,
      marginBottom:-10
  },
  feedContainer:{
      borderBottomColor: "pink",
  },
  container1: {
    marginTop:"50%",
    alignItems: 'center',
    justifyContent: 'center',
  },
})