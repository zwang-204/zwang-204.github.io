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

const redRef = ref(db, 'data/red');
onValue(redRef, (_red) => {
  const red = _red.val();
  updateColor(0, red);
});

const greenRef = ref(db, 'data/green');
onValue(greenRef, (_green) => {
  const green = _green.val();
  updateColor(1, green);
});

const blueRef = ref(db, 'data/blue');
onValue(blueRef, (_blue) => {
  const blue = _blue.val();
  updateColor(2, blue);
});

let origR, origG, origB = 0;

const compRef = ref(db, 'data/completed');
onValue(compRef, (_comp) => {
  const comp = _comp.val();
  const completedText = document.getElementById("completedText");
  completedText.textContent = `Match the left color. Completed: ${_comp.val()}`;
  get(child(dbRef, `colorList/color/${comp+1}/` )).then((origColor) => {
    if (origColor.exists()) {
      origR = origColor.val().red;
      origG = origColor.val().green;
      origB = origColor.val().blue;
      let colorBox = document.getElementById("colorBox1");
      colorBox.style.backgroundColor = `rgb(${origR}, ${origG}, ${origB})`;
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
});

const dbRef = ref(db);

document.addEventListener('DOMContentLoaded', () => {
  
  const redPlus = document.getElementById('redPlus');
  const redMinus = document.getElementById('redMinus');
  const greenPlus = document.getElementById('greenPlus');
  const greenMinus = document.getElementById('greenMinus');
  const bluePlus = document.getElementById('bluePlus');
  const blueMinus = document.getElementById('blueMinus');
  redPlus.addEventListener('click', () => {
    writeData(0, 1);
  });
  redMinus.addEventListener('click', () => {
    writeData(0, -1);
  });
  greenPlus.addEventListener('click', () => {
    writeData(1, 1);
  });
  greenMinus.addEventListener('click', () => {
    writeData(1, -1);
  });
  bluePlus.addEventListener('click', () => {
    writeData(2, 1);
  });
  blueMinus.addEventListener('click', () => {
    writeData(2, -1);
  });

});

function updateColor(index, num) {
  // Find the HTML element by ID
  const colorBox = document.getElementById("colorBox2");
  var currentColor = window.getComputedStyle(colorBox).backgroundColor;
  var [r, g, b] = currentColor.replace(/rgba?\((\d+), (\d+), (\d+).*\)/i, '$1,$2,$3').split(',').map(Number);
  if(index == 0){
    r = Math.min(Math.max(0, num), 255);
    const redText = document.getElementById("redText");
    redText.textContent = num;
  }
  else if(index == 1){
    g = Math.min(Math.max(0, num), 255);
    const greenText = document.getElementById("greenText");
    greenText.textContent = num;
  }
  else if(index == 2){
    b = Math.min(Math.max(0, num), 255);
    const blueText = document.getElementById("blueText");
    blueText.textContent = num;
  }

  checkColor(r, g, b);

  colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function checkColor(r, g, b){
  if(r == origR && g == origG && b == origB){
    origR = -1;
    const dbRef = ref(getDatabase());
    const updates = {};
    updates[`data/completed`] = increment(1);
    update(dbRef, updates);
  }
}

function writeData(index, num){
  const dbRef = ref(getDatabase());
  const updates = {};
  if(index == 0){
    updates[`data/red`] = increment(num);
  }
  else if(index == 1){
    updates[`data/green`] = increment(num);
  }
  else if(index == 2){
    updates[`data/blue`] = increment(num);
  }
  update(dbRef, updates);
}

