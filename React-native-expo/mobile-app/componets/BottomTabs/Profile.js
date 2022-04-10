import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image,SafeAreaView,ScrollView,Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { auth, db } from "../../firebase"
import { MaterialIcons } from '@expo/vector-icons'; 

const Profile = ({navigation,route}) => {
     const [profileUserData, setProfileUserData] = useState();
     const [modal,setModal] = useState(false)
     const [countPosts,setCountPosts] = useState(0)
     const [countFollowers,setCountFollowers] = useState(0)
     const [countFollowing,setCountFollowing] = useState(0)


     useEffect(() => {
      db.collection('follows').where("followerId", "==", auth?.currentUser?.uid)
     .onSnapshot(snapshot => (
      setCountFollowing(snapshot.docs.length)
     ))
  }, []);

  useEffect(() => {
    db.collection('users').doc(auth?.currentUser?.uid).collection("followers").where("followedId", "==", auth?.currentUser?.uid)
   .onSnapshot(snapshot => (
    setCountFollowers(snapshot.docs.length)
   ))
  }, []);

     useEffect(() => {
      db.collection('posts').where("ownerId", "==", auth?.currentUser?.uid)
     .onSnapshot(snapshot => (
      setCountPosts(snapshot.docs.length)
     ))
  }, []);

     useEffect(() => {
      db.collection('users').doc(`${auth?.currentUser?.uid}`).onSnapshot((doc) => {
          setProfileUserData(doc.data());
      });
  }, [])


  const logOut = () =>{
    auth.signOut()
    .then(()=> {
        navigation.replace('SignIn')
    })
  }
  
    return (      
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.header}>

                  <View>
                  <TouchableOpacity style={{textAlign:"center"}}>
                        <Text style={styles.names}>{profileUserData?.firstName} {profileUserData?.lastName}</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
      <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
      showsVerticalScrollIndicator={false}>
       <TouchableOpacity activeOpacity={0.5} onPress={()=> setModal(true)}>
       <Image source={{uri: profileUserData?.photoURL}} style={styles.userImg}/>

       </TouchableOpacity>

      <Text style={styles.userName}>@{profileUserData?.username}</Text>
      <Text style={styles.aboutUser}>
      {profileUserData ? profileUserData?.email || 'No email added.' : ''}
      </Text>


      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>Year</Text>
          <Text style={styles.userInfoSubTitle}>4</Text>
        </View>

        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>Course</Text>
          <Text style={styles.userInfoSubTitle}>Bsc. Civil Engineering</Text>
        </View> 

        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>School</Text>
          <Text style={styles.userInfoSubTitle}>UoN</Text>
        </View>
      </View>

      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countPosts}</Text>
          <Text style={styles.userInfoSubTitle}>Post(s)</Text>
        </View>

        

        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countFollowing}</Text>
          <Text style={styles.userInfoSubTitle}>Book(s)</Text>
        </View>
      </View>

      <View style={styles.userBtnWrapper}>
    
    <TouchableOpacity
      style={styles.userBtn}
      onPress={() => {
        navigation.navigate('Profileedit');
      }}>
      <Text style={styles.userBtnTxt}>Edit</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.userBtn} onPress={logOut}>
      <Text style={styles.userBtnTxt}>Logout</Text>
    </TouchableOpacity>

</View>
    </ScrollView>

    <Modal
    animationType="slide"
    transparent={true}
    visible={modal}
    onRequestClose={()=>{
        setModal(false)
    }}
    >
      <View style={styles.modalView}>
      <MaterialIcons name="cancel" size={36} style={{marginLeft: 300,marginTop:50}} onPress={() => setModal(false)} color="#0a7ff5" />
      <Image source={ {uri: profileUserData?.photoURL}} style={{width:"100%",height:"100%"}}/>
      </View>
    </Modal>
    </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop:25
      },
      userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
      },
      names:{
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
      },
      aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
      },
      userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
      },
      userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
      },
      userBtnTxt: {
        color: '#2e64e5',
      },
      userInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
      },
      userInfoItem: {
        justifyContent: 'center',
      },
      userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
      },
      userInfoSubTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
      },  modalView:{
         top:50,
         width:"100%",
         backgroundColor:"#D3D3D3",
         padding:0,
         height:"70%",
         justifyContent:"center",
         alignItems:"center"
     },
     header: {
       flexDirection: "row",
       justifyContent: "center",
       paddingHorizontal: 32,
       paddingVertical: 12,
       borderBottomWidth: 1,
       borderBottomColor: "#08d4c4",
       marginTop:0,
   },
})