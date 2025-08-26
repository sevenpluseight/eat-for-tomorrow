let currentDay = 0;
let playerStats = {
    health: 0,
    wallet: 0,
    env: 0
};

const gameContainer = document.getElementById('game-container');
const statsContainer = document.getElementById('stats-container');

setupMarkers();
moveCharacter(0); // Start at Day 1 position

// Apple saved theme from localStorage - change the theme on landing page
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

// function updateStats() {
//     let healthEmoji = playerStats.health <= -2 ? "🤒" : playerStats.health >=2 ? "😊" : "😐";
//     let walletEmoji = playerStats.wallet <= 0 ? "🪙" : playerStats.wallet >=5 ? "💎" : "💰";
//     let envEmoji = playerStats.env <= -2 ? "🏭" : playerStats.env >=2 ? "🌳" : "🌿";

//     statsContainer.innerHTML = `
//     Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
// }

function getStatEmojis(stats) {
  const healthEmoji = stats.health <= -3
    ? "🤒"   // sick
    : stats.health >= 4 
      ? "❤️"  // healthy
      : "😐"; // neutral

  const walletEmoji = stats.wallet <= -1 
    ? "💸"   // no money
    : stats.wallet >= 5
      ? "💎"  // rich
      : "💰"; // average

  const envEmoji = stats.env <= -2
    ? "🏭"   // polluted
    : stats.env >= 3 
      ? "🌳"  // green
      : "🌿"; // neutral

  return { healthEmoji, walletEmoji, envEmoji };
}

function updateStats() {
  const { healthEmoji, walletEmoji, envEmoji } = getStatEmojis(playerStats);
  statsContainer.innerHTML = `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function showDay() {
    const day = days [currentDay];

    let choicesHTML = day.choices.map ((choice, index) => {
        return `<button class="choice-btn" data-index="${index}">
                ${choice.emoji} ${choice.label}
                </button>`;
    }).join("");

    gameContainer.innerHTML = `
        <div class="screen-container fade-in" id="day-content">
            <h2>Day ${day.day} - ${day.title}</h2>
            <p>${day.question}</p>
            <div id="choices-container">
                ${choicesHTML}
            </div>
        </div>
    `;

    // Trigger fade-in
    const contentDiv = document.getElementById('day-content');
    setTimeout(() => contentDiv.classList.add('show'), 10);

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleChoice(btn.dataset.index);
        });
    });
} 

let isAnswering = false;

function handleChoice(choiceIndex) {
    if (isAnswering) return; // Prevent multiple clicks
    isAnswering = true;

    const choice = days[currentDay].choices[choiceIndex];

    const healthChange = typeof choice.health === "function" ? choice.health() : choice.health;
    const walletChange = typeof choice.wallet === "function" ? choice.wallet() : choice.wallet;
    const envChange = typeof choice.env === "function" ? choice.env() : choice.env;

    const foodEl = document.getElementById("food");
    const character = document.getElementById("character");

    // Show the food above the character
    foodEl.textContent = choice.emoji;
    foodEl.style.left = character.style.left || "0%";
    foodEl.classList.add("show");

    // Wait → hide food (simulate eating) → then move
    setTimeout(() => {
        foodEl.classList.remove("show");
    }, 800); // match CSS transition duration
    
    // Apply changes
    playerStats.health += healthChange;
    playerStats.wallet += walletChange;
    playerStats.env += envChange;

    updateStats();
    currentDay++;
    moveCharacter(currentDay);

    // Show floating and only proceed when animation is done
    showFloatingChange(healthChange, walletChange, envChange, choiceIndex, () => {
        if (currentDay < days.length) {
            showDay();
        } else {
            showEnding();
        }

        isAnswering = false; // Reset for next question
    });
}

// function showFloatingChange(healthChange, walletChange, envChange, choiceIndex, callback) {
//     const btn = document.querySelector(`.choice-btn[data-index="${choiceIndex}"]`);
//     const floating = document.createElement('div');
//     floating.classList.add('floating-change');

//     let content = " ";
//     if (healthChange) content += ` Health: ${healthChange > 0 ? '+' : ''}${healthChange} `;
//     if (walletChange) content += ` Wallet: ${walletChange > 0 ? '+' : ''}${walletChange} `;
//     if (envChange) content += ` Environment: ${envChange > 0 ? '+' : ''}${envChange} `;

//     floating.innerHTML = content;

//     const rect = btn.getBoundingClientRect();
//     floating.style.position = 'absolute';
//     floating.style.left = rect.left + window.scrollX + 'px';
//     floating.style.top = rect.top + window.scrollY - 30 + 'px';
//     floating.style.opacity = 1;

//     document.body.appendChild(floating);

//     // Animate floating mark
//     setTimeout(() => {
//         floating.style.top = rect.top + window.scrollY - 60 + 'px';
//         floating.style.opacity = 0;
//     }, 10);

//     // Remove floating mark after animation ends then call callback
//     setTimeout(() => {
//         floating.remove();
//         if (callback) callback(); // proceed to next question
//     }, 800);
// }

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
    if (character) {
        character.textContent = "🥳"; 
    }

    let endingTitle = " ";
    let endingTagline = " ";

    const { health, wallet, env } = playerStats;

    if (health <= -3 && wallet <= 2 && env <= -2) {
        endingTitle = "🍔 Fast Food Fallout 💥";
        endingTagline = "💀 Junk wins, you and the planet lose! 🌍";
    } else if (health >= 5 && env>= 5) {
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

    // Trigger fade-in
    const endingContent = document.getElementById('ending-content');
    setTimeout(() => endingContent.classList.add('show'), 10);

    launchConfetti();
}

// function getStatsEmojis() {
//     let healthEmoji = playerStats.health <= -2 ? "🤒" : playerStats.health >= 2 ? "😊" : "😐";
//     let walletEmoji = playerStats.wallet <= 0 ? "🪙" : playerStats.wallet >= 5 ? "💎" : "💰";
//     let envEmoji = playerStats.env <= -2 ? "🏭" : playerStats.env >= 2 ? "🌳" : "🌿";

//     return `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
// }

function getStatsEmojis() {
  const { healthEmoji, walletEmoji, envEmoji } = getStatEmojis(playerStats);
  return `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Environment: ${envEmoji}`;
}

function restartGame() {
    currentDay = 0;
    playerStats = {
        health: 0,
        wallet: 0,
        env: 0
    };
    
    const character = document.getElementById("character");
    if (character) {
        character.innerHTML = '<i class="fa-solid fa-person-running"></i>'; 
    }

    statsContainer.style.display = "block"; 
    updateStats();
    setupMarkers();
    moveCharacter(0);
    showDay();
}

// Dark Mode Toggle
// const darkSwitch = document.getElementById('dark-mode-switch');

// darkSwitch.addEventListener('change', () => {
//     document.body.classList.toggle('dark-mode', darkSwitch.checked);
// });

function setupMarkers() {
    const totalDays = 14;
    const markers = document.getElementById("markers");

    markers.innerHTML = "";

    for (let day = 1; day <= totalDays; day++) {
        const marker = document.createElement("div");
        marker.classList.add("marker");

        // Distribute evenly with %
        const percent = ((day - 1) / (totalDays - 1)) * 100;
        marker.style.left = percent + "%";

        // Show numbers only at milestones
        if (day === 1 || day === 7 || day === 14) {
            marker.textContent = day;
        } else {
            marker.textContent = "•";
        }

        markers.appendChild(marker);
    }
}

function moveCharacter(dayIndex) {
    const totalDays = 14;
    const path = document.getElementById("path");
    const char = document.getElementById("character");

    const pathWidth = path.clientWidth; // inside path
    const charWidth = char.clientWidth;

    // Space available for movement
    const step = (pathWidth - charWidth) / (totalDays - 1);

    // Clamp to valid range
    if (dayIndex >= totalDays) dayIndex = totalDays - 1;
    if (dayIndex < 0) dayIndex = 0;

    // Apply relative to path container
    char.style.left = (dayIndex * step) + "px";
}

updateStats();
showDay();

function launchConfetti() {
  const duration = 3000; // 3 seconds
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

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}