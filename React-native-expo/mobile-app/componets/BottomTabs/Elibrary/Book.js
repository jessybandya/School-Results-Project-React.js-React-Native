import { Image, StyleSheet, Text, View,Alert,TouchableOpacity, ScrollView } from 'react-native'
import {PayWithFlutterwave} from 'flutterwave-react-native';
import { auth, db } from '../../../firebase';
import { MaterialIcons } from '@expo/vector-icons'; 
import React from 'react'

const Book = ({ title,image,author,publisher,year,type,page,reviews,price,bookId,navigation}) => {


    const handleRedirect = (data) => {
        if (data.status === "successful") {
          havePaid()
          Alert.alert("Congrats!",`You have successfully purchased ${title} book!`)
        }else{
            Alert.alert("Sorry!",`Transaction failed!`)
        }
      };

      const havePaid = () => {


        db.collection("paidBooks").add({
          paid:true,
          bookId,
          personId:auth?.currentUser?.uid,
          timestamp: Date.now(),
      })    
  }

  var price = parseFloat(price);
      
  return (
    <View style={styles.container}>

        <View>
          <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
          <View>
          <Image style={styles.image} source={{uri: image}} />
          </View>
          <View style={{marginLeft:5}}>
               <View>
                   <View style={{flexDirection:'row'}}>
                   <Text style={{color:"#666",fontSize:14}}>Publisher: </Text><Text style={{fontWeight:"bold",color:"#0a7ff5"}}>{publisher}</Text>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <Text style={{color:"#666",fontSize:14}}>Year Of Publish: </Text><Text style={{fontWeight:"bold",color:"#0a7ff5"}}>{year}</Text>
                   </View>

                  <View style={{flexDirection:'row'}}>
                   <Text style={{color:"#666",fontSize:14}}>Type Of Book: </Text><Text style={{fontWeight:"bold",color:"#0a7ff5"}}>{type}</Text>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <Text style={{color:"#666",fontSize:14}}>No. Of Pages: </Text><Text style={{fontWeight:"bold",color:"#0a7ff5"}}>{page}</Text>
                   </View>
               </View>
               <View>
                   <Text style={{fontWeight:'bold'}}>Reviews</Text>
               </View>
               <View>
               </View>
               <View style={{marginTop:45}}>
    <PayWithFlutterwave
  onRedirect={handleRedirect}
  options={{
    tx_ref: Date.now(),
    authorization: 'FLWPUBK-cdcdf33bafedf13c157a3d4ac1999332-X',
    customer: {
      email: `${auth?.currentUser?.email}`
    },
    amount: price,
    currency: 'KES',
    payment_options: 'mobilemoney'
  }}
  customButton={(props) => (
    <TouchableOpacity
      style={styles.paymentButton}
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:5}}>
              <View>
              <Text style={styles.paymentButtonText}>Ksh.{price}</Text>
              </View>
              <View>
              <MaterialIcons name="pending-actions" size={18} color="#fff" />  
            </View>
          </View>
    </TouchableOpacity>
  )}
/>
               </View>
          </View>
      </View>
      
    </View>
  )
}

export default Book

const styles = StyleSheet.create({
    container:{
    padding:8,
    borderWidth:1,
    borderColor:"#08d4c4",
    margin:5,
    borderRadius:10,
    },
    paymentButton:{
        height:35,
        width:150,
        backgroundColor:"#0a7ff5",
        padding:2,
        marginLeft:50,
        borderRadius:8
    },
    paymentButtonText:{
        fontWeight:"bold",
        color:"#fff",
        marginLeft:10
    },
    title:{
        fontSize:15,
        fontWeight:'bold',
        textAlign:'center',
        borderBottomWidth:1,
        borderBottomColor:"#08d4c4",
        marginBottom:8
    },
    image:{
        height:130,
        width:130,
        borderRadius:15
    }
})