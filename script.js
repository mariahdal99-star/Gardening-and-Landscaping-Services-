import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbkpCjUX-ePA07d_WyswDCcPC9h23u4O4",
  authDomain: "gardeninglandscape-7f981.firebaseapp.com",
  projectId: "gardeninglandscape-7f981",
  storageBucket: "gardeninglandscape-7f981.firebasestorage.app",
  messagingSenderId: "721680518429",
  appId: "1:721680518429:web:63134f52306b829b28e5f4",
  measurementId: "G-BBVQZEHQ7D"
   }; 
//nitialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const guestbookCol = collection(db, "guestbook");

// --- NAVIGATION LOGIC ---
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
};

// --- GUESTBOOK LOGIC ---
const nameInput = document.getElementById('guestName');
const msgInput = document.getElementById('guestMessage');
const submitBtn = document.getElementById('submitComment');
const entriesDiv = document.getElementById('guestbook-entries');

// Save a new message
submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (!name || !msg) return; // Ignore empty
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Planting...";

    try {
        await addDoc(guestbookCol, {
            name: name,
            message: msg,
            timestamp: serverTimestamp()
        });
        nameInput.value = "";
        msgInput.value = "";
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("The soil is too hard! Try again later.");
    }
    
    submitBtn.disabled = false;
    submitBtn.innerText = "Plant a Message";
});

// Load messages in real-time
const q = query(guestbookCol, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
        entriesDiv.innerHTML = "<p><i>No comments yet. Be the first flower in the garden.</i></p>";
        return;
    }

    entriesDiv.innerHTML = ""; // Clear loader
    snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : "Just now";
        
        // Create the comment box
        const div = document.createElement('div');
        div.className = 'guest-entry';
        
        // Escape HTML to prevent code injection
        const safeName = document.createTextNode(data.name);
        const safeMsg = document.createTextNode(data.message);
        
        div.innerHTML = `
            <div class="entry-header">
                <span class="entry-name"></span>
                <span class="entry-date">${date}</span>
            </div>
            <div class="entry-msg"></div>
        `;
        
        // Put the safe text back in
        div.querySelector('.entry-name').appendChild(safeName);
        div.querySelector('.entry-msg').appendChild(safeMsg);
        
        entriesDiv.appendChild(div);
    });
});

// --- MISC DECORATIONS ---
const quotes = [
    "The strongest roots are the ones nobody sees.",
    "The roses remember every kind word you've ever whispered.",
    "Water what makes your heart bloom.",
    "Patience is the sun that makes the late bloomers finally open."
];

document.getElementById('newQuoteBtn').onclick = () => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').innerText = `"${q}"`;
};

let count = 4382;
setInterval(() => {
    if (Math.random() > 0.9) {
        count++;
        document.getElementById('counter').innerText = count.toString().padStart(7, '0');
    }
}, 3000);

let isPlaying = false;
document.getElementById('musicBtn').onclick = function() {
    this.innerText = isPlaying ? "▶ Play Music" : "■ Stop Music";
    isPlaying = !isPlaying;
};
