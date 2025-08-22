let currentDay = 0;
let playerStats = {
    health: 0,
    wallet: 0,
    env: 0
};

const gameContainer = document.getElementById('game-container');
const statsContainer = document.getElementById('stats-container');  

function updateStats() {
    let healthEmoji = playerStats.health <= -2 ? "🤒" : playerStats.health >=2 ? "😊" : "😐";
    let walletEmoji = playerStats.wallet <= 0 ? "🪙" : playerStats.wallet >=5 ? "💎" : "💰";
    let envEmoji = playerStats.env <= -2 ? "🏭" : playerStats.env >=2 ? "🌳" : "🌿";

    statsContainer.innerHTML = `
    Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function showDay() {
    const day = days [currentDay];

    let choicesHTML = day.choices.map ((choice, index) => {
        return `<button class="choice-btn" data-index="${index}">
                ${choice.emoji} ${choice.label}
                </button>`;
    }).join("");

    gameContainer.innerHTML = `
        <h2>Day ${day.day} - ${day.title}</h2>
        <p>${day.question}</p>
        <div id="choices-container">
            ${choicesHTML}
        </div>
    `;

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleChoice(btn.dataset.index);
        });
    });
} 
function handleChoice(choiceIndex) {
    const choice = days[currentDay].choices[choiceIndex];

    const healthChange = typeof choice.health === "function" ? choice.health() : choice.health;
    const walletChange = typeof choice.wallet === "function" ? choice.wallet() : choice.wallet;
    const envChange = typeof choice.env === "function" ? choice.env() : choice.env;

    // Apply changes
    playerStats.health += healthChange;
    playerStats.wallet += walletChange;
    playerStats.env += envChange;

    // Show floating change
    showFloatingChange(healthChange, walletChange, envChange, choiceIndex);
    updateStats();

    currentDay++;

    if (currentDay < days.length) {
        showDay();
    } else {
        showEnding();
    }
}

function showFloatingChange(healthChange, walletChange, envChange, choiceIndex) {
    const btn = document.querySelector(`.choice-btn[data-index="${choiceIndex}"]`);

    const floating = document.createElement('div');
    floating.classList.add('floating-change');

    let content = " ";
    if (healthChange) content += ` Health: ${healthChange > 0 ? '+' : ''}${healthChange} `;
    if (walletChange) content += ` Wallet: ${walletChange > 0 ? '+' : ''}${walletChange} `;
    if (envChange) content += ` Environment: ${envChange > 0 ? '+' : ''}${envChange} `;

    floating.innerHTML = content;

    const rect = btn.getBoundingClientRect();
    floating.style.position = 'absolute';
    floating.style.left = rect.left + window.scrollX + 'px';
    floating.style.top = rect.top + window.scrollY - 30 + 'px';

    document.body.appendChild(floating);

    setTimeout(() => {
    floating.style.top = rect.top + window.scrollY - 60 + 'px';
    floating.style.opacity = 0;
    }, 10);

    setTimeout(() => {
        floating.remove();
    }, 2000);
}

function showEnding() {
    statsContainer.style.display = "none";

    let endingTitle = " ";
    let endingTagline = " ";

    const { health, wallet, env } = playerStats;

    if (health <= -3 && wallet <= 2 && env <= -2) {
        endingTitle = "Fast Food Fallout 🍔💥";
        endingTagline = "💀🌍 Junk wins, you and the planet lose!";
    } else if (health >= 5 && env>= 5) {
        endingTitle = "Eco Hero 🌱💪";
        endingTagline = "🥗💚 You saved the world with your healthy choices!";
    } else if (health <= 4 && wallet >= 5 && env <= -1) {
        endingTitle = "Wealthy but Wasteful 💰🏭";
        endingTagline = "🛍️🔥Saved cash, but your planet took a hit.";
    } else if (health >= 5 && wallet <= -1) {
        endingTitle = "Health Over Wealth 🥦💪";
        endingTagline = "💸⚡You ate like a champ… your budget didn't survive!";
    } else {
        endingTitle = "Middle Path ⚖️🌤️";
        endingTagline = "🥗🪙🌿 Balanced choices kept you steady — not too good, not too bad.";
    }

    gameContainer.innerHTML = `
        <h2>${endingTitle}</h2>
        <p>${endingTagline}</p>
        <p>Final Stats:</p>
        <p>${getStatsEmojis()}</p>
        <button onclick="restartGame()">Play Again</button>
    `;
}

function getStatsEmojis() {
    let healthEmoji = playerStats.health <= -2 ? "🤒" : playerStats.health >= 2 ? "😊" : "😐";
    let walletEmoji = playerStats.wallet <= 0 ? "🪙" : playerStats.wallet >= 5 ? "💎" : "💰";
    let envEmoji = playerStats.env <= -2 ? "🏭" : playerStats.env >= 2 ? "🌳" : "🌿";

    return `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function restartGame() {
    currentDay = 0;
    playerStats = {
        health: 0,
        wallet: 0,
        env: 0
    };
    updateStats();
    showDay();
}

updateStats();
showDay();
