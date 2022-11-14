import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import {
    getFirestore, collection, query,
    getDocs, where, orderBy, setDoc, doc,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

const config = new Config();

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

console.log('firebaseApp: ', firebaseApp);
console.log('db: ', db);
window.firebasedb = db;

const collectionChats = collection(db, 'chats');
getDocs(collectionChats)
  .then((snapshot) => {
    console.log(snapshot.docs);
  });