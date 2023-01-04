import firebase from "firebase"


const firebaseConfig = {
    apiKey: "AIzaSyD628TCwLOTZkFRd1awe0Qn44xBzW6qrxA",
    authDomain: "netflix-clone-3c593.firebaseapp.com",
    projectId: "netflix-clone-3c593",
    storageBucket: "netflix-clone-3c593.appspot.com",
    messagingSenderId: "236369037420",
    appId: "1:236369037420:web:0cc7f33838613699e47049",
    measurementId: "G-2R28RY7B0V"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db =firebaseApp.firestore();
  const auth =firebase.auth();

  export {auth};
  export default  db;