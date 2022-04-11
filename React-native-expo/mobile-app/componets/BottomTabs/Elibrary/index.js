import { View, StyleSheet, TextInput, Text,SafeAreaView,Image,ScrollView, Alert, TouchableOpacity, Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView,Platform } from 'react-native';
import { db,auth } from "../../../firebase"
import React,{useState, useEffect, useLayoutEffect} from 'react'
import Book from './Book';

const Elibrary = ({navigation}) => {
    const [books, setBooks] = useState([])



    useEffect(()=>{
        const unsuscribe = db.collection('books').onSnapshot(snapshot =>{
            setBooks(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
            <ScrollView>
            {books.map(({ id,data:{title,image,author,publisher,year,type,page,reviews,price}})=>(
    //   <CommentsN1  key={id}  postId={postId} navigation={navigation} fromId={fromId} read={read}  timestamp={timestamp}/>
    <Book key={id} bookId={id} navigation={navigation} title={title} image={image} author={author} publisher={publisher} year={year} type={type} page={page} reviews={reviews} price={price}/>
  ))}
            </ScrollView>
             
        </View>
    )
}

export default Elibrary 
const styles = StyleSheet.create({
    container:{
     paddingBottom:100
    }
})