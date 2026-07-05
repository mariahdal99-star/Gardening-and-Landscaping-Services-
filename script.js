import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDbkpCjUX-ePA07d_WyswDCcPC9h23u4O4",
  authDomain: "gardeninglandscape-7f981.firebaseapp.com",
  projectId: "gardeninglandscape-7f981",
  storageBucket: "gardeninglandscape-7f981.firebasestorage.app",
  messagingSenderId: "721680518429",
  appId: "1:721680518429:web:63134f52306b829b28e5f4",
  measurementId: "G-BBVQZEHQ7D"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const guestbookCol = collection(db, "guestbook");

// --- 2. MAIN NAVIGATION LOGIC ---
// Switches between Home, Tips, Photos, etc.
window.showPage = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
};

// --- 3. RESOURCE HUB (SUB-TIPS) LOGIC ---
// Switches categories inside the "Garden Tips" section
window.showSubTip = function(tipId) {
    // Hide all sub-tip content
    document.querySelectorAll('.sub-tip').forEach(t => t.classList.remove('active'));
    
    // Remove the "Active" look from all hub buttons
    document.querySelectorAll('.tips-menu button').forEach(b => b.classList.remove('active-btn'));

    // Show the specific category (Propagation, Pests, etc.)
    const targetSubTip = document.getElementById('tip-' + tipId);
    if (targetSubTip) {
        targetSubTip.classList.add('active');
    }

    // Find the button that was clicked and make it look "pushed down"
    const clickedBtn = Array.from(document.querySelectorAll('.tips-menu button'))
                            .find(btn => btn.getAttribute('onclick').includes(tipId));
    if (clickedBtn) clickedBtn.classList.add('active-btn');
};

// --- 4. SOIL PH CALCULATOR LOGIC ---
window.calculatePH = function() {
    const val = document.getElementById('phValue').value;
    const result = document.getElementById('phResult');
    
    if(val === "bitter") {
        result.innerText = "Analysis: Soil is too acidic. Add forgiveness and lime to neutralize the pain.";
    } else if(val === "sweet") {
        result.innerText = "Analysis: Soil is overly alkaline. Add deep memories and peat moss to ground the roots.";
    } else {
        result.innerText = "Analysis: Balance achieved. The roots feel safe here.";
    }
};

// --- 5. GUESTBOOK LOGIC ---
const nameInput = document.getElementById('guestName');
const msgInput = document.getElementById('guestMessage');
const submitBtn = document.getElementById('submitComment');
const entriesDiv = document.getElementById('guestbook-entries');

// Save a new message to Firebase
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const msg = msgInput.value.trim();

        if (!name || !msg) return; 
        
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
}

// Load messages from Firebase in real-time
const q = query(guestbookCol, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    if (!entriesDiv) return;
    
    if (snapshot.empty) {
        entriesDiv.innerHTML = "<p><i>No comments yet. Be the first flower in the garden.</i></p>";
        return;
    }

    entriesDiv.innerHTML = ""; 
    snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : "Just now";
        
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
        
        div.querySelector('.entry-name').appendChild(safeName);
        div.querySelector('.entry-msg').appendChild(safeMsg);
        entriesDiv.appendChild(div);
    });
});

// --- 6. MISC DECORATIONS ---
// Quote Generator
const quotes = [
    "The strongest roots are the ones nobody sees.",
    "The roses remember every kind word you've ever whispered.",
    "Water what makes your heart bloom.",
    "Patience is the sun that makes the late bloomers finally open.",
    "The garden dislikes being watched as much as it dislikes being abandoned.",
    "Some gardens are grown for the world; this one is grown only for you."
];

const quoteBtn = document.getElementById('newQuoteBtn');
if (quoteBtn) {
    quoteBtn.onclick = () => {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('daily-quote').innerText = `"${q}"`;
    };
}

// Visitor Counter Simulation
let count = 4382;
setInterval(() => {
    const counterEl = document.getElementById('counter');
    if (counterEl && Math.random() > 0.9) {
        count++;
        counterEl.innerText = count.toString().padStart(7, '0');
    }
}, 3000);

// Music Player Simulation
let isPlaying = false;
const musicBtn = document.getElementById('musicBtn');
if (musicBtn) {
    musicBtn.onclick = function() {
        this.innerText = isPlaying ? "▶ Play Music" : "■ Stop Music";
        isPlaying = !isPlaying;
    };
}
