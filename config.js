//Configuracion de firebase

const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyCAS-e8H9GkToJJ5HpXX-3kAaLU9gsyrP8",
  authDomain: "backendcinemapedia.firebaseapp.com",
  projectId: "backendcinemapedia",
  storageBucket: "backendcinemapedia.appspot.com",
  messagingSenderId: "561183551435",
  appId: "1:561183551435:web:9ea9b354866e3cf177904e",
  measurementId: "G-XBZ5PDM1T7",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("Users");
module.exports = User;
