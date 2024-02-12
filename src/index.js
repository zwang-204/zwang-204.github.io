import { initializeApp } from "firebase/app";
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

const db = getDatabase();
const dbRef = ref(db);
let totalRescue = 0;

// get(child(dbRef, `cat/total` )).then((total) => {
//   if (total.exists()) {
//     totalRescue = total.val();
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });

const totalCount = ref(db, 'cat/total');
onValue(totalCount, (_total) => {
  totalRescue = _total.val();
})

const saveCount = ref(db, 'cat/save');
onValue(saveCount, (_save) => {
  const save = _save.val();
  updatePage(save);
});


document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    writeData(1);
  });
});

function updatePage(numOfSaves) {
  // Find the HTML element by ID
  const button = document.getElementById("saveButton");
  const cat = document.getElementById("image1");
  const dirt = document.getElementById("dirt");
  button.textContent = `Save the cat\r\n`;
  button.textContent += `${numOfSaves}/${totalRescue}`;
  let percentage = numOfSaves / totalRescue;
  let catPercent = 100 * ((1-percentage) * 0.85);
  let dirtPercent = 100 * (percentage * 0.85);

  cat.style.top = catPercent + "%";
  dirt.style.height = dirtPercent + "%";
}

function writeData(num){
  const dbRef = ref(getDatabase());
  const updates = {};
  updates[`cat/save`] = increment(num);
  update(dbRef, updates);
}

