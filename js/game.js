let currentDay = 0;
let playerStats = {
    health: 0,
    wallet: 0,
    env: 0
};

const gameContainer = document.getElementById('game-container');
const statsContainer = document.getElementById('stats-container');

setupMarkers();
moveCharacter(0); // Start at Day 1

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}

function getStatEmojis(stats) {
    const healthEmoji = stats.health <= -3 ? "🤒" : stats.health >= 4 ? "❤️" : "😐";
    const walletEmoji = stats.wallet <= -1 ? "💸" : stats.wallet >= 5 ? "💎" : "💰";
    const envEmoji = stats.env <= -2 ? "🏭" : stats.env >= 3 ? "🌳" : "🌿";
    return { healthEmoji, walletEmoji, envEmoji };
}

function updateStats() {
    const { healthEmoji, walletEmoji, envEmoji } = getStatEmojis(playerStats);
    statsContainer.innerHTML = `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function getStatsEmojis() {
    const { healthEmoji, walletEmoji, envEmoji } = getStatEmojis(playerStats);
    return `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function showDay() {
    const day = days[currentDay];
    let choicesHTML = day.choices.map((choice, index) => {
        return `<button class="choice-btn" data-index="${index}">
                    ${choice.emoji} ${choice.label}
                </button>`;
    }).join("");

    gameContainer.innerHTML = `
        <div class="screen-container fade-in" id="day-content">
            <h2>Day ${day.day} - ${day.title}</h2>
            <p>${day.question}</p>
            <div id="choices-container">${choicesHTML}</div>
        </div>
    `;

    // Fade-in
    const contentDiv = document.getElementById('day-content');
    setTimeout(() => contentDiv.classList.add('show'), 10);

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn.dataset.index));
    });
}

let isAnswering = false;

function handleChoice(choiceIndex) {
    if (isAnswering) return;
    isAnswering = true;

    const choice = days[currentDay].choices[choiceIndex];

    const healthChange = typeof choice.health === "function" ? choice.health() : choice.health;
    const walletChange = typeof choice.wallet === "function" ? choice.wallet() : choice.wallet;
    const envChange = typeof choice.env === "function" ? choice.env() : choice.env;

    const foodEl = document.getElementById("food");
    const character = document.getElementById("character");

    // Show food above character
    foodEl.textContent = choice.emoji;
    foodEl.style.left = character.style.left || "0%";
    foodEl.classList.add("show");
    setTimeout(() => foodEl.classList.remove("show"), 800);

    // Apply stats
    playerStats.health += healthChange;
    playerStats.wallet += walletChange;
    playerStats.env += envChange;

    updateStats();

    // Show floating stat changes and trigger mini-game for Day 3
    showFloatingChange(healthChange, walletChange, envChange, choiceIndex, () => {
        startDayMiniGame(currentDay, () => {
            currentDay++;
            moveCharacter(currentDay);
            if (currentDay < days.length) {
                showDay();
            } else {
                showEnding();
            }
            isAnswering = false;
        });
    });
}

function startDayMiniGame(dayIndex, callback) {
    if (dayIndex === 2) { // Day 3 (0-indexed)
        startQuickClickGame((score) => {
            let message = "";
            if (score >= 15) {
                playerStats.wallet += score;
                message = `🎉 Great! You scored ${score} clicks! Wallet +2`;
            } else {
                playerStats.wallet -= 2;
                message = `😅 You scored only ${score} clicks. Wallet -2`;
            }
            updateStats();
            callback();
        });
    } else if (dayIndex === 6) { // Day 7 (0-indexed)
        startMemoryMatchGame(() => {   // ✅ this function lives in memoryGame.js
            callback();
        });
    } else if (dayIndex === 10) { // Day 11
        startEcoPlateGame(() => {
            callback();
        });
    }else {
        callback();
    }
}

function showFloatingChange(healthChange, walletChange, envChange, choiceIndex, callback) {
    const character = document.getElementById("character");
    const rect = character.getBoundingClientRect();

    const floating = document.createElement("div");
    floating.classList.add("floating-change");

    let content = "";
    if (healthChange) content += `<span class="health">${healthChange > 0 ? "❤️+" : "❤️"}${healthChange}</span> `;
    if (walletChange) content += `<span class="wallet">${walletChange > 0 ? "💰+" : "💰"}${walletChange}</span> `;
    if (envChange) content += `<span class="env">${envChange > 0 ? "🌱+" : "🌱"}${envChange}</span> `;

    floating.innerHTML = content;

    floating.style.position = "absolute";
    floating.style.left = rect.left + window.scrollX + rect.width / 2 + "px";
    floating.style.top = rect.top + window.scrollY - 40 + "px";
    floating.style.opacity = 1;
    floating.style.pointerEvents = "none";
    floating.style.transition = "all 0.8s ease-out";

    document.body.appendChild(floating);

    requestAnimationFrame(() => {
        floating.style.transform = "translateY(-30px)";
        floating.style.opacity = "0";
    });

    setTimeout(() => {
        floating.remove();
        if (callback) callback();
    }, 800);
}

function showEnding() {
    statsContainer.style.display = "none";
    const character = document.getElementById("character");
    if (character) character.textContent = "🥳";

    let endingTitle = "";
    let endingTagline = "";

    const { health, wallet, env } = playerStats;

    if (health <= -3 && wallet <= 2 && env <= -2) {
        endingTitle = "🍔 Fast Food Fallout 💥";
        endingTagline = "💀 Junk wins, you and the planet lose! 🌍";
    } else if (health >= 5 && env >= 5) {
        endingTitle = "🌱 Eco Hero 💪";
        endingTagline = "💚 You saved the world with your healthy choices!";
    } else if (health <= 4 && wallet >= 5 && env <= -1) {
        endingTitle = "💰 Wealthy but Wasteful 🏭";
        endingTagline = "🔥 Saved cash, but your planet took a hit. 🧨";
    } else if (health >= 5 && wallet <= -1) {
        endingTitle = "🥦 Health Over Wealth 💪";
        endingTagline = "⚡You ate like a champ… your budget didn't survive! 💸";
    } else {
        endingTitle = "⚖️ Middle Path 🌤️";
        endingTagline = "🥗 🪙 🌿 Balanced choices kept you steady — not too good, not too bad.";
    }

    gameContainer.innerHTML = `
        <div class="ending-container fade-in" id="ending-content">
            <h2>${endingTitle}</h2>
            <p>${endingTagline}</p>
            <p>Final Stats:</p>
            <div class="final-stats-container">
                <p>${getStatsEmojis()}</p>
            </div>
            <div class="play-again-wrapper">
                <button onclick="restartGame()" class="play-again-btn">Play Again</button>
            </div>
        </div>
    `;

    setTimeout(() => document.getElementById('ending-content').classList.add('show'), 10);
    launchConfetti();
}

function restartGame() {
    currentDay = 0;
    playerStats = { health: 0, wallet: 0, env: 0 };

    const character = document.getElementById("character");
    if (character) character.innerHTML = '<i class="fa-solid fa-person-running"></i>';

    statsContainer.style.display = "block";
    updateStats();
    setupMarkers();
    moveCharacter(0);
    showDay();
}

function setupMarkers() {
    const totalDays = 14;
    const markers = document.getElementById("markers");
    markers.innerHTML = "";

    for (let day = 1; day <= totalDays; day++) {
        const marker = document.createElement("div");
        marker.classList.add("marker");
        const percent = ((day - 1) / (totalDays - 1)) * 100;
        marker.style.left = percent + "%";
        marker.textContent = (day === 1 || day === 7 || day === 14) ? day : "•";
        markers.appendChild(marker);
    }
}

function moveCharacter(dayIndex) {
    const totalDays = 14;
    const path = document.getElementById("path");
    const char = document.getElementById("character");

    const pathWidth = path.clientWidth;
    const charWidth = char.clientWidth;
    const step = (pathWidth - charWidth) / (totalDays - 1);

    if (dayIndex >= totalDays) dayIndex = totalDays - 1;
    if (dayIndex < 0) dayIndex = 0;

    char.style.left = (dayIndex * step) + "px";
}

// =======================
// CONFETTI
// =======================
function launchConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        for (let i = 0; i < 3; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = Math.random() * 100 + "vw";
            const size = Math.random() * 6 + 4;
            confetti.style.width = size + "px";
            confetti.style.height = size + "px";
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 70%)`;
            confetti.style.animationDuration = (Math.random() * 3 + 3) + "s";
            confetti.style.opacity = Math.random() * 0.6 + 0.3;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 6000);
        }
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

updateStats();
showDay();
