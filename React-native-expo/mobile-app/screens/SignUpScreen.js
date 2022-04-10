import React,{useLayoutEffect,useState,useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    Alert,
    Image,
    Animated,
    ScrollView,
    ActivityIndicator 
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {FontAwesome} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';

import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements'
import { auth,db } from '../firebase'
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'; 

const SignInScreen = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const { colors } = useTheme();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const [loading,setLoading] = useState(false)


    useLayoutEffect(() => {
        navigation.setOptions({
            title:"SignUp",
            headerStyle : {
                backgroundColor: "#08d4c4",
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
            //          {/* <AntDesign name="camerao" size={24} onPress={() => alert("Still under development mode!!!")} color="#FF1493" /> */}
            //          <Image style={{height:28,width:28,color:"#FF1493"}} source={{uri: "data:image/webp;base64,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"}}/>
            //      </TouchableOpacity>
            //      <TouchableOpacity  activeOpacity={0.5}>
            //          <SimpleLineIcons name="pencil" size={24} color="#FF1493" />
            //      </TouchableOpacity>
            //     </View>
          
        })

    }, [])

 

    const [data, setData] = React.useState({
      email:'',
      firstName:'',
      lastName:'',
      username: '',
      password: '',
      check_textInputChange1: false,
      check_textInputChange2: false,
      check_textInputChange3: false,
      check_textInputChange: false,
      secureTextEntry: true,
      confirm_secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
  });

  const textFirstName = (val) => {
      if( val.length !== 0 ) {
          setData({
              ...data,
              firstName: val,
              check_textInputChange1: true
          });
      } else {
          setData({
              ...data,
              firstName: val,
              check_textInputChange1: false
          });
      }
  }

  const textLastName = (val) => {
    if( val.length !== 0 ) {
        setData({
            ...data,
            lastName: val,
            check_textInputChange2: true
        });
    } else {
        setData({
            ...data,
            lastName: val,
            check_textInputChange2: false
        });
    }
}

const textUsername = (val) => {
  if( val.length !== 0 ) {
      setData({
          ...data,
          username: val,
          check_textInputChange3: true
      });
  } else {
      setData({
          ...data,
          username: val,
          check_textInputChange3: false
      });
  }
}

const textInputChange = (val) => {
  if( reg.test(val) === true) {
      setData({
          ...data,
          email: val,
          check_textInputChange: true,
          isValidUser: true
      });
  } else {
      setData({
          ...data,
          email: val,
          check_textInputChange: false,
          isValidUser: false
      });
  }
}


const handlePasswordChange = (val) => {
  if( val.trim().length >= 8 ) {
      setData({
          ...data,
          password: val,
          isValidPassword: true
      });
  } else {
      setData({
          ...data,
          password: val,
          isValidPassword: false
      });
  }
}


  const updateSecureTextEntry = () => {
      setData({
          ...data,
          secureTextEntry: !data.secureTextEntry
      });
  }

  const handleValidUser = (val) => {
    if( reg.test(val) === true) {
        setData({
            ...data,
            isValidUser: true
        });
    } else {
        setData({
            ...data,
            isValidUser: false
        });
    }
}



  const signUp = (firstName,lastName,email,username,password) => {
    setLoading(true)
     if(data.firstName.length == 0){
      Alert.alert('Wrong Input!', 'first Name field cannot be empty.', [
        {text: 'Okay'}
    ]);
     }else if(data.lastName.length == 0){
      Alert.alert('Wrong Input!', 'last Name field cannot be empty.', [
        {text: 'Okay'}
    ]);
     }else if(data.email.length == 0){
      Alert.alert('Wrong Input!', 'email field cannot be empty.', [
        {text: 'Okay'}
    ]);
     }else if(data.username.length == 0){
      Alert.alert('Wrong Input!', 'username field cannot be empty.', [
        {text: 'Okay'}
    ]);
     }else if(data.password.length == 0){
      Alert.alert('Wrong Input!', 'password field cannot be empty.', [
        {text: 'Okay'}
    ]);
     }else{
        setLoading(true)
      db.collection('users').where('username','==',username).where('email','==',email).get().then((resultSnapShot) =>{

        if(resultSnapShot.size == 0){
            auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                    auth.user.updateProfile({
                        displayName: data.username,
                        photoURL: "https://cdn2.vectorstock.com/i/1000x1000/23/81/default-avatar-profile-icon-vector-18942381.jpg",
                    }).then((s) =>{
                      db.collection('users').doc(auth.user.uid).set({
                        firstName,
                        lastName,
                        email,
                        username,
                        year:'',
                        course:'',
                        school:'',
                        photoURL: "https://cdn2.vectorstock.com/i/1000x1000/23/81/default-avatar-profile-icon-vector-18942381.jpg",
                        timestamp:Date.now()
                      }).then((r) =>{
                        navigation.navigate("Home")
                      })
                    });
                }).catch((error)=> Alert.alert("Alert!",error.message), setLoading(false))
        }else{
            Alert.alert("Alert!","The username you enterd already in use")
            setLoading(false)
        }
    })     


}

}

    return (
      <View style={styles.container}>
      <StatusBar style='dark'/>

    <LinearGradient
        // Background Linear Gradient
        colors={['#08d4c4', '#0a7ff5']}
        style={styles.header}
        >
<Text style={styles.text_header}>Register Now!</Text>
      </LinearGradient>
    <Animated.View 
        animation="fadeInUpBig"
        style={styles.footer}
    >
        <ScrollView>

        <Text style={styles.text_footer}>First Name</Text>
        <View style={styles.action}>
            <FontAwesome 
                name="user-o"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Your First Name"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => textFirstName(val)}
            />
            {data.check_textInputChange1 ? 
            <Animated.View
                animation="bounceIn"
            >
                <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                />
            </Animated.View>
            : null}
        </View>
        <Text style={styles.text_footer}>Last Name</Text>
        <View style={styles.action}>
            <FontAwesome 
                name="user-o"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Your Last Name"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => textLastName(val)}
            />
            {data.check_textInputChange2 ? 
            <Animated.View
                animation="bounceIn"
            >
                <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                />
            </Animated.View>
            : null}
        </View>

        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <Animated.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animated.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animated.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Email is Invalid!</Text>
            </Animated.View>
            }
            

        <Text style={styles.text_footer}>Username</Text>
        <View style={styles.action}>
            <FontAwesome 
                name="user-o"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Your Username"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => textUsername(val)}
            />
            {data.check_textInputChange3 ? 
            <Animated.View
                animation="bounceIn"
            >
                <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                />
            </Animated.View>
            : null}
        </View>

        <Text style={[styles.text_footer, {
            marginTop: 15
        }]}>Password</Text>
        <View style={styles.action}>
            <Feather 
                name="lock"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Your Password"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => handlePasswordChange(val)}
            />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
        </View>
        { data.isValidPassword ? null : 
            <Animated.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animated.View>
            }



        <View style={styles.button}>

            <TouchableOpacity
                    style={styles.signIn}
                onPress={() => {signUp( data.firstName, data.lastName, data.email, data.username, data.password )}}
                >
                <LinearGradient
                    colors={['#08d4c4', '#0a7ff5']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>
                             {loading === true ?(
                    <ActivityIndicator size="large" color="#fff" />
          ):(<Text>Sign Up</Text>)}
                        </Text>
                </LinearGradient>
                </TouchableOpacity>



            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.signIn, {
                    borderColor: '#0a7ff5',
                    borderWidth: 1,
                    marginTop: 10
                }]}
            >
                <Text style={[styles.textSign, {
                    color: '#0a7ff5'
                }]}>Sign In</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    </Animated.View>
  </View>
      );
  };
  
  export default SignInScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#0a7ff5'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 12,
        paddingTop:10
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop:15
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 15
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });