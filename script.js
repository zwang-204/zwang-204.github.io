import { getDatabase, ref, set, child, get } from "firebase/database";

const dbRef = ref(getDatabase());
get(child(dbRef, `counts`)).then((counts) => {
  if (counts.exists()) {
    console.log(counts.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

// function readCounterAndUpdateUI() {
//   const countRef = firebase.database().ref('counter/count');
//   countRef.on('value', (snapshot) => {
//     const count = snapshot.val();
//     document.getElementById('counter').innerText = count;
//   });
// }

// document.getElementById('counterButton').addEventListener('click', () => {
//   const currentCount = parseInt(document.getElementById('counter').innerText);
//   writeCounterData(currentCount + 1);
// });

// // Initial read to update UI
// readCounterAndUpdateUI();
