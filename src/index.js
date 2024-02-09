import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, child, get, set, onValue, increment, update} from "firebase/database";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDbYBRtDCAOXHz62fP4Y9q8XP0KHmG5jdY",
  authDomain: "datastorage-a264b.firebaseapp.com",
  databaseURL: "https://datastorage-a264b-default-rtdb.firebaseio.com",
  projectId: "datastorage-a264b",
  storageBucket: "datastorage-a264b.appspot.com",
  messagingSenderId: "701497650292",
  appId: "1:701497650292:web:3625c9052977c88b513521",
  measurementId: "G-1YCHF24PYJ"
});

document.addEventListener('DOMContentLoaded', () => {
  const counter = document.getElementById('counter');
  const button = document.getElementById('counterButton');

  button.addEventListener('click', () => {
      writeData();
  });
});

function updateCount(_count) {
  // Find the HTML element by ID
  const countElement = document.getElementById("counter");
  
  // Update the text content of the element with the new star count
  if (countElement) {
    countElement.textContent = _count;
  }
}

function writeData(_count){
  const dbRef = ref(getDatabase());
  const updates = {};
  updates[`data/counts`] = increment(1);
  update(dbRef, updates);
}

function readData(){
  const dbRef = ref(getDatabase());

  get(child(dbRef, "data/counts/")).then((count) => {
    if (count.exists()) {
      console.log("data Got!");
      console.log(count.val());
      return count.val();
    } else {
      console.log("No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
  });
}

const db = getDatabase();
const clickCountRef = ref(db, 'data/counts');
onValue(clickCountRef, (count) => {
  const data = count.val();
  updateCount(data);
});
