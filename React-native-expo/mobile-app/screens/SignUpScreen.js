import React,{useLayoutEffect,useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    Alert,
    Animated,
    ScrollView,
    ActivityIndicator 
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {FontAwesome} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { auth,db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'; 



const SignInScreen = ({navigation}) => {
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
             </View>     
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