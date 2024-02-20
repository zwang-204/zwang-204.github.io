import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, onValue, increment, update, onDisconnect} from "firebase/database";

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
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    updateCanvasWithDatabaseData();
  }
});

const presenceRef = ref(db, "scream");
const disconnectUpdate = {};
disconnectUpdate[`userNumber`] = increment(-1);
onDisconnect(presenceRef).update(disconnectUpdate);


const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const hoverText = document.getElementById('hoverText');
const textInput = document.getElementById('textInput');
const enterButton = document.getElementById('enterButton');

// Initialize an array to store texts for each pixel, empty by default
let pixelTexts = new Array(10000).fill('');

canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width; // Scale factor between physical and logical canvas size
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);
  const pixelIndex = y * 100 + x;

  hoverText.style.visibility = 'visible';
  hoverText.style.left = `${e.clientX - 0.85 * rect.left}px`;
  hoverText.style.top = `${e.clientY - rect.top}px`;
  hoverText.textContent = pixelTexts[pixelIndex];
});

canvas.addEventListener('mouseout', function() {
  hoverText.style.visibility = 'hidden';
});

enterButton.addEventListener('click', function() {
  const text = textInput.value.trim();
  if (text) {
    const hashs = normalizeAndHash(text);
    const pixelIndex = hashs[0] % 10000; // Calculate the pixel position
    pixelTexts[pixelIndex] = text; // Assign the text to a pixel
    textInput.value = ''; // Clear the text input

    // Calculate the x and y positions based on the index
    const x = pixelIndex % 100;
    const y = Math.floor(pixelIndex / 100);

    ctx.fillStyle = `rgb(${hashs[1]}, ${hashs[2]}, ${hashs[3]})`; // Original color from the hash
    ctx.fillRect(x, y, 1, 1);

    const updates = {};
    updates['pixels/' + pixelIndex.toString() + '/rgb/'] = [hashs[1], hashs[2], hashs[3]];
    updates['/pixels/' + pixelIndex.toString() + '/words/'] = text;
    update(dbRef, updates);

  }
});

function updateCanvasWithDatabaseData() {
  const pixelsRef = ref(db, 'pixels'); // Assuming your data is stored under 'pixels'
  onValue(pixelsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      pixelTexts = data.map(pixel => pixel.words || "");
      // Iterate through the pixel data and update the canvas
      data.forEach((pixel, index) => {
        // Calculate the x and y positions based on the index
        const x = index % 100;
        const y = Math.floor(index / 100);
        // Set the fill style based on the pixel's RGB values
        ctx.fillStyle = `rgb(${pixel.rgb[0]}, ${pixel.rgb[1]}, ${pixel.rgb[2]})`;
        // Draw the pixel on the canvas
        ctx.fillRect(x, y, 1, 1); // Assuming ctx is your canvas context
      });
    }
  });
}

function normalizeAndHash(words) {
  // Normalize: Convert to lowercase and remove punctuation
  const normalized = words.toLowerCase().replace(/[^\w\s]|_/g, "");
  
  // Simple hash function: Sum the char codes of the normalized string
  let posHash = 0;
  for (let i = 0; i < normalized.length; i++) {
    posHash = posHash + normalized.charCodeAt(i);
  }

  // Hash function: Create a larger hash to derive RGB values
  let rgbHash = 0;
  for (let i = 0; i < normalized.length; i++) {
    rgbHash = (rgbHash * 31 + normalized.charCodeAt(i)) % 16777216; // Modulo 2^24 to fit RGB
  }
  const red = (rgbHash >> 16) & 255; // Extract the first 8 bits
  const green = (rgbHash >> 8) & 255; // Extract the next 8 bits
  const blue = rgbHash & 255; // Extract the last 8 bits

  return [posHash, red, green, blue];
}