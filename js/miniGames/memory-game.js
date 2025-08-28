// js/miniGames/memoryGame.js
function startMemoryMatchGame(callback) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // clear current screen

    const container = document.createElement("div");
    container.classList.add("screen-container", "fade-in");
    container.id = "memory-match-game";

    // Title
    const title = document.createElement("h2");
    title.textContent = "Memory Match Challenge 🧠";
    container.appendChild(title);

    // Rule / Hint
    const rule = document.createElement("p");
    rule.innerHTML = `<em style="font-size: 0.9rem; color: #555;">
        Find all pairs within 20 seconds to boost your Health!
    </em>`;
    container.appendChild(rule);

    // Timer
    const timerDisplay = document.createElement("p");
    timerDisplay.textContent = "Time left: 20s";
    container.appendChild(timerDisplay);

    // Timer bar
    const timerBar = document.createElement("div");
    timerBar.style.height = "8px";
    timerBar.style.background = "#4caf50";
    timerBar.style.width = "100%";
    timerBar.style.transition = "width 1s linear";
    container.appendChild(timerBar);

    // Pair tracker
    const pairTracker = document.createElement("p");
    pairTracker.textContent = `Pairs: 0 / 5`;
    container.appendChild(pairTracker);

    // Game board
    const board = document.createElement("div");
    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(5, 55px)";
    board.style.gap = "3px";
    board.style.justifyContent = "center";
    board.style.marginTop = "1rem";
    container.appendChild(board);

    // Card setup (5 pairs = 10 cards)
    const icons = ["🍎", "🍔", "🥦", "🍕", "🍇"];
    const cards = [...icons, ...icons]
        .sort(() => Math.random() - 0.5)
        .map(icon => ({ icon, flipped: false, matched: false }));

    let firstCard = null;
    let lockBoard = false;
    let matchedCount = 0;

    // Render cards
    cards.forEach((card, i) => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("memory-card");

        // inner card (for flipping)
        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        const front = document.createElement("div");
        front.classList.add("card-front");
        front.textContent = "?";

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.textContent = card.icon;

        inner.appendChild(front);
        inner.appendChild(back);
        cardEl.appendChild(inner);
        board.appendChild(cardEl);

        cardEl.addEventListener("click", () => {
            if (lockBoard || card.flipped || card.matched) return;

            card.flipped = true;
            cardEl.classList.add("flipped");

            if (!firstCard) {
                firstCard = { card, el: cardEl };
            } else {
                lockBoard = true;
                setTimeout(() => {
                    if (firstCard.card.icon === card.icon) {
                        card.matched = true;
                        firstCard.card.matched = true;
                        matchedCount++;
                        pairTracker.textContent = `Pairs: ${matchedCount} / ${icons.length}`;
                    } else {
                        card.flipped = false;
                        firstCard.card.flipped = false;
                        cardEl.classList.remove("flipped");
                        firstCard.el.classList.remove("flipped");
                    }
                    firstCard = null;
                    lockBoard = false;
                }, 800);
            }
        });
    });

    // Countdown
    const totalTime = 20;
    let timeLeft = totalTime;
    const countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        timerBar.style.width = `${(timeLeft / totalTime) * 100}%`;

        const allMatched = cards.every(c => c.matched);
        if (timeLeft <= 0 || allMatched) {
            clearInterval(countdown);

            let resultMessage = "";
            if (allMatched) {
                playerStats.health += 2;
                resultMessage = `🍀 Lucky brain! No pair left behind. Health +2 💖`;
                launchConfetti();
            } else {
                playerStats.health -= 2;
                resultMessage = `💤 Oops... ran out of time! Cards still hiding 😅 Health -2`;
            }
            updateStats();

            gameContainer.innerHTML = `
                <div class="screen-container fade-in show">
                    <h2>Game Over!</h2>
                    <p>${resultMessage}</p>
                    <button class="choice-btn" id="continue-btn" disabled>Continue</button>
                </div>
            `;

            const continueBtn = document.getElementById("continue-btn");
            setTimeout(() => { continueBtn.disabled = false; }, 1000);
            continueBtn.addEventListener("click", () => {
                if (callback) callback();
            });
        }
    }, 1000);

    gameContainer.appendChild(container);
    setTimeout(() => container.classList.add("show"), 10);
}
