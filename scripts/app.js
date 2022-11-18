import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getFirestore, collection, query, getDocs, where, orderBy, setDoc, doc, deleteDoc, addDoc, serverTimestamp, 
         onSnapshot } 
  from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

const config = new Config();
const chatMsgInpt = document.getElementById('message');
const usernameStrong = document.getElementById('usernameStrong');
let selectedRoomBtn = document.querySelector('.btn_active');
let selectedRoom = selectedRoomBtn.innerText.slice(1);
console.log('selectedRoomBtn: ', selectedRoomBtn);
console.log('selectedRoom: ', selectedRoom);

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

// queries 
const q = query(chatsRef, where("room" ,"==", selectedRoom), orderBy("created_at"));

window.addEventListener('DOMContentLoaded', (e) => {
  onSnapshot(q, (snapshot) => {
    let chats = [];
    snapshot.docs.forEach((doc) => {
      chats.push({...doc.data()});
    });
    console.log('chats: ', chats);
  });
});

const addMsgForm = document.querySelector('.new-chat');
addMsgForm.addEventListener('submit', e => {
  e.preventDefault();
  
  addDoc(chatsRef, {
    username: usernameStrong.textContent,
    message: chatMsgInpt.value,
    room: selectedRoom,
    created_at: serverTimestamp ()
  })
  .then(() => {
    addMsgForm.reset();
  })
  .catch(err => console.log('error while adding document: ', err.message));
});