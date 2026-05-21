window.firebaseConfig = {
  apiKey: "AIzaSyDgMV79LTyiQerEOZvtuszH6ONaOAset5c",
  authDomain: "programming-cc297.firebaseapp.com",
  databaseURL: "https://programming-cc297-default-rtdb.firebaseio.com",
  projectId: "programming-cc297",
  storageBucket: "programming-cc297.firebasestorage.app",
  messagingSenderId: "131761323515",
  appId: "1:131761323515:web:9a0b1f3fcb7e49ec9b91c4"
};
try{ if(window.firebase && !firebase.apps.length) firebase.initializeApp(window.firebaseConfig); }catch(e){ console.warn(e); }
