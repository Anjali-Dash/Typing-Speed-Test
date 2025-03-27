let darkModeEnabled = false;
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    darkModeEnabled = !darkModeEnabled;
}

const paragraphs = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Typing is fun and helps improve speed.",
        "Practice daily to become a better typist."
    ],
    medium: [
        "Artificial intelligence is shaping the future of technology.",
        "Programming languages like JavaScript and Python are widely used in software development.",
        "Developing efficient algorithms is crucial for optimizing application performance."
    ],
    hard: [
        "Quantum computing is an emerging field that leverages quantum mechanics to solve complex problems.",
        "Cybersecurity is essential in protecting sensitive data from unauthorized access and cyber threats.",
        "Blockchain technology is revolutionizing the financial sector with decentralized ledgers and secure transactions."
    ]
};

let timer;
let timeLeft = 30;
let started = false;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let originalWords = [], typedWords = [];

function startTest() {
    if (started) return;
    started = true;
    document.getElementById("typingArea").disabled = false;
    document.getElementById("typingArea").value = "";
    document.getElementById("typingArea").focus();
    const difficulty = document.getElementById("difficulty").value;
    document.getElementById("paragraph").textContent = paragraphs[difficulty][Math.floor(Math.random() * paragraphs[difficulty].length)];
    timeLeft = 30;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("wpm").textContent = 0;
    document.getElementById("mistakes").textContent = 0;
    document.getElementById("overallScore").textContent = 0;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    const text = paragraphs[difficulty][0];
    originalWords = text.split(" ");
    typedWords = [];
    updateParagraphDisplay();
    timeLeft = 30;
    document.getElementById("timer").textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function updateParagraphDisplay() {
    let displayText = "";
    originalWords.forEach((word, index) => {
        if (index === typedWords.length) {
            displayText += `<span class='highlight-current'>${word}</span> `;
        } else {
            displayText += word + " ";
        }
    });
    document.getElementById("paragraph").innerHTML = displayText.trim();
}

function trackTyping() {
    typedWords = document.getElementById("typingArea").value.trim().split(" ");
    updateParagraphDisplay();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
    } else {
        clearInterval(timer);
        calculateScore();
    }
}

function stopTest() {
    clearInterval(timer);
    calculateScore();
}

function calculateScore() {
    const originalText = document.getElementById("paragraph").textContent.trim().split(" ");
    const textEntered = document.getElementById("typingArea").value.trim().split(" ");
    let correctWords = 0;
    let mistakes = 0;
    let highlightedText = "";

    originalText.forEach((word, index) => {
        if (textEntered[index] === word) {
            correctWords++;
            highlightedText += word + " ";
        } else {
            highlightedText += `<span class='highlight'>${textEntered[index] || "_"}</span> `;
            mistakes++;
        }
    });
    
    document.getElementById("paragraph").innerHTML = highlightedText.trim();
    document.getElementById("mistakes").textContent = mistakes;

    const wpm = ((correctWords / 30) * 60).toFixed(2);
    const accuracyScore = ((correctWords / originalText.length) * 100).toFixed(2);
    const overallScore = ((parseFloat(wpm) + parseFloat(accuracyScore)) / 2).toFixed(2);

    document.getElementById("wpm").textContent = wpm;
    document.getElementById("overallScore").textContent = overallScore;
    document.getElementById("typingArea").disabled = true;
    started = false;

    const difficulty = document.getElementById("difficulty").value;
    leaderboard.push({ difficulty, wpm, accuracyScore, overallScore });
    leaderboard.sort((a, b) => b.overallScore - a.overallScore);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

function updateLeaderboard() {
    const leaderboardElement = document.getElementById("leaderboard");
    const difficulty = document.getElementById("difficulty").value;
    leaderboardElement.innerHTML = leaderboard.map(entry => 
        `<li>Level: ${entry.difficulty}, WPM: ${entry.wpm}, Score: ${entry.overallScore}</li>`
    ).join("");
}

function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    leaderboard = [];
    updateLeaderboard();
}


toggleDarkMode();
updateLeaderboard();
