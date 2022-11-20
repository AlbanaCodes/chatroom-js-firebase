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
const usernameInput = document.getElementById('username');
const chatList = document.querySelector('.chat-list');

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

const sub = () => {
  // queries 
  let q = query(chatsRef, where("room" ,"==", selectedRoom), orderBy("created_at"));

  //const unsubRoom = 
  onSnapshot(q, 
    (snapshot) => {      
      // snapshot.docs.forEach((doc) => {
      //   console.log('doctype: ', doc.type);
      //   console.log('snapload');
      //   chats.push({...doc.data()});
      // });
      //console.log('chats: ', chats); // we get the added chat twice in the log. this happens because of the timestamp
      // created_at. becaue we add the document in the addMsgForm submit event, and when it gets the server time
      // it has a difference and considers it as edited. and it returns it as such (edit). that's why in shows the log twice

      snapshot.docChanges().forEach(change => {
        if(change.doc.data().created_at !== null){
          renderChat(change.doc.data());
          //chats.push({...change.doc.data()});
        }
      });
    },
    (error) => {
      console.log('error: ', error.message);
    }
  );
};
sub();

const renderChat = (chatObj) => {
  const when = dateFns.distanceInWordsToNow(
    chatObj.created_at.toDate(),
    {addSuffix: true}
  )
  const html = `
  <li class='list-group-item'>
    <span class='username'>${chatObj.username}:</span>
    <span class='message'>${chatObj.message}</span>
    <div class='time'>${when}</div>
  </li>
  `;
  chatList.innerHTML += html;
};

const addMsgForm = document.querySelector('.new-chat');
addMsgForm.addEventListener('submit', e => {
  e.preventDefault();
  
  addDoc(chatsRef, {
    username: usernameStrong.innerHTML,
    message: chatMsgInpt.value,
    room: selectedRoom,
    created_at: serverTimestamp ()
  })
  .then(() => {
    addMsgForm.reset();
  })
  .catch(err => console.log('error while adding document: ', err.message));
});

const updateUsername = (username) => {
  usernameStrong.innerHTML = username;
};

const editUsernameForm = document.querySelector('.my-name');
editUsernameForm.addEventListener('submit', e => {
  e.preventDefault();
  updateUsername(usernameInput.value);
  editUsernameForm.reset();
});

const updateRoom = (room) => {
  chatList.innerHTML = '';
  selectedRoom = room;
  sub();
};

selectedRoomBtn.addEventListener('click', e => {
  e.preventDefault();
  updateRoom('gaming');
});