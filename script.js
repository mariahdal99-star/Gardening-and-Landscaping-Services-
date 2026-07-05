import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDbkpCjUX-ePA07d_WyswDCcPC9h23u4O4",
  authDomain: "gardeninglandscape-7f981.firebaseapp.com",
  projectId: "gardeninglandscape-7f981",
  storageBucket: "gardeninglandscape-7f981.firebasestorage.app",
  messagingSenderId: "721680518429",
  appId: "1:721680518429:web:63134f52306b829b28e5f4",
  measurementId: "G-BBVQZEHQ7D"
}; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const guestbookCol = collection(db, "guestbook");

// 2. MAIN NAVIGATION
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
};

// 3. RESOURCE HUB (SUB-TIPS)
window.showSubTip = function(tipId) {
    document.querySelectorAll('.sub-tip').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tips-menu button').forEach(b => b.classList.remove('active-btn'));

    const target = document.getElementById('tip-' + tipId);
    if (target) target.classList.add('active');

    const btn = Array.from(document.querySelectorAll('.tips-menu button'))
                     .find(b => b.getAttribute('onclick').includes(tipId));
    if (btn) btn.classList.add('active-btn');
};

// 4. PH CALCULATOR
window.calculatePH = function() {
    const val = document.getElementById('phValue').value;
    const res = document.getElementById('phResult');
    if(val === "bitter") res.innerText = "Soil is too acidic. Add forgiveness and lime.";
    else if(val === "sweet") res.innerText = "Soil is overly alkaline. Add deep memories.";
    else res.innerText = "Balance achieved. The roots feel safe.";
};

// 5. GUESTBOOK LOGIC
const entriesDiv = document.getElementById('guestbook-entries');
const submitBtn = document.getElementById('submitComment');

if (submitBtn) {
    submitBtn.onclick = async () => {
        const name = document.getElementById('guestName').value.trim();
        const msg = document.getElementById('guestMessage').value.trim();
        if (!name || !msg) return;
        submitBtn.innerText = "Planting...";
        try {
            await addDoc(guestbookCol, { name, message: msg, timestamp: serverTimestamp() });
            document.getElementById('guestName').value = "";
            document.getElementById('guestMessage').value = "";
        } catch (e) { alert("Soil error! Try later."); }
        submitBtn.innerText = "Plant a Message";
    };
}

onSnapshot(query(guestbookCol, orderBy("timestamp", "desc")), (snap) => {
    if (!entriesDiv) return;
    if (snap.empty) { entriesDiv.innerHTML = "<p><i>No flowers yet...</i></p>"; return; }
    entriesDiv.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        const date = d.timestamp ? d.timestamp.toDate().toLocaleString() : "Just now";
        const div = document.createElement('div');
        div.className = 'guest-entry';
        div.innerHTML = `<div class="entry-header"><b>${d.name}</b> <small>${date}</small></div><p>${d.message}</p>`;
        entriesDiv.appendChild(div);
    });
});

// 6. DECORATIONS
const quotes = ["The strongest roots are the ones nobody sees.", "Patience is the sun."];
document.getElementById('newQuoteBtn').onclick = () => {
    document.getElementById('daily-quote').innerText = `"${quotes[Math.floor(Math.random()*quotes.length)]}"`;
};

let count = 4382;
setInterval(() => {
    if (Math.random() > 0.9) {
        count++;
        document.getElementById('counter').innerText = count.toString().padStart(7, '0');
    }
}, 3000);
