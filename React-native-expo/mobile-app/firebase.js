import  firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-TGH8uC_fJ8uqWqZA2uvxgC4VBWeiWI0",

    authDomain: "linkd1.firebaseapp.com",
  
    projectId: "linkd1",
  
    storageBucket: "linkd1.appspot.com",
  
    messagingSenderId: "722321134963",
  
    appId: "1:722321134963:web:e5b5e2068db5bc6e76e106",
  
    measurementId: "G-TPF0D27YBZ"
  
};

  let app;
  if(firebase.apps.length === 0){
      app = firebase.initializeApp(firebaseConfig)
  }else{
    app = firebase.app();
  }

const db = app.firestore();
const auth = firebase.auth();

export {db, auth }