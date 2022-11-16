import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import {
    getFirestore, collection, query,
    getDocs, where, orderBy, setDoc, doc,
    deleteDoc, addDoc
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

const config = new Config();
const chatMsgInpt = document.getElementById('message');

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

const chatsRef = collection(db, 'chats');
window.addEventListener('DOMContentLoaded', (e) => {
  getDocs(chatsRef)
    .then((snapshot) => {
      let chats = [];
      snapshot.docs.forEach((doc) => {
        chats.push({...doc.data(), id: doc.id});
      });
    })
    .catch(error => {
      console.log('error: ', error.message);
    });
});

const addMsgForm = document.querySelector('.new-chat');
addMsgForm.addEventListener('submit', e => {
  e.preventDefault();

  addDoc(chatsRef, {
    message: chatMsgInpt.value
  })
  .then(() => {
    addMsgForm.reset();
  });
});