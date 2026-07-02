// Page Navigation Function
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    document.getElementById(pageId).classList.add('active');

    // Scroll to top of content
    window.scrollTo(0, 0);
}

// Quote Generator (The Metaphors)
const quotes = [
    "The strongest roots are the ones nobody sees.",
    "A garden is not a place, it is a state of grace between two people.",
    "Don't worry about the weeds of the past; keep planting the flowers of today.",
    "The roses remember every kind word you've ever whispered.",
    "Some gardens are grown for the world; this one is grown only for you.",
    "To love is to be a gardener of someone else's soul.",
    "Patience is the sun that makes the late bloomers finally open.",
    "Water what makes your heart bloom, and the rest will fade away."
];

function generateQuote() {
    const quoteElement = document.getElementById('daily-quote');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.style.opacity = 0;
    
    setTimeout(() => {
        quoteElement.innerText = `"${quotes[randomIndex]}"`;
        quoteElement.style.opacity = 1;
    }, 300);
}

// Fake Music Player Toggle
let isPlaying = false;
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    if (!isPlaying) {
        btn.innerText = "■ Stop Music";
        // In a real production site, you'd trigger an Audio object here
        console.log("Playing Soft_Vines.mid...");
        isPlaying = true;
    } else {
        btn.innerText = "▶ Play Music";
        isPlaying = false;
    }
}

// Visitor Counter Simulation
let count = 4382;
const counterElement = document.getElementById('counter');
setInterval(() => {
    if (Math.random() > 0.9) {
        count++;
        counterElement.innerText = count.toString().padStart(7, '0');
    }
}, 3000);

// Add a little console secret for those who inspect the code
console.log("%cThe gardener is in love with the visitor.", "color: #a0522d; font-size: 20px; font-weight: bold;");
