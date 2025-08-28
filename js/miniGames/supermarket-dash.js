function startSupermarketDash(callback) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("screen-container", "fade-in");
    container.id = "supermarket-dash";

    const title = document.createElement("h2");
    title.textContent = "Supermarket Dash 🛒💨";
    container.appendChild(title);

    // Short rules for kids
    const rules = document.createElement("p");
    rules.classList.add("game-hint");
    rules.innerHTML = `
        Catch <span style="color:green">healthy foods</span> & <span style="color:gold">coins</span>!<br>
        Avoid <span style="color:red">junk foods</span>! 15 seconds only!
    `;
    container.appendChild(rules);

    const scoreDisplay = document.createElement("p");
    scoreDisplay.id = "dash-score";
    updateDashScore();
    container.appendChild(scoreDisplay);

    // Play area
    const playArea = document.createElement("div");
    playArea.classList.add("dash-play-area");
    playArea.style.position = "relative";
    playArea.style.width = "100%";
    playArea.style.height = "300px";
    playArea.style.border = "2px solid #ccc";
    playArea.style.overflow = "hidden";
    playArea.style.backgroundColor = "#f0f0f0";
    container.appendChild(playArea);

    // Basket as emoji
    const basket = document.createElement("div");
    basket.classList.add("dash-basket");
    basket.style.position = "absolute";
    basket.style.bottom = "0";
    basket.style.width = "50px";
    basket.style.height = "50px";
    basket.style.fontSize = "36px";
    basket.style.textAlign = "center";
    basket.style.lineHeight = "50px";
    basket.textContent = "🛒"; // shopping cart emoji
    playArea.appendChild(basket);

    let basketX = playArea.clientWidth / 2 - 25;
    basket.style.left = basketX + "px";
    const basketSpeed = 15;

    const items = [
        { emoji: "🥦", type: "low" },
        { emoji: "🥕", type: "low" },
        { emoji: "🍎", type: "low" },
        { emoji: "🍌", type: "low" },
        { emoji: "🥑", type: "low" },
        { emoji: "🍔", type: "high" },
        { emoji: "🍕", type: "high" },
        { emoji: "🍟", type: "high" },
        { emoji: "💰", type: "coin" }
    ];

    let timeLeft = 15;
    let finished = false;

    // Basket movement
    function moveBasket(e) {
        if (finished) return;
        if (e.key === "ArrowLeft") {
            basketX = Math.max(0, basketX - basketSpeed);
        } else if (e.key === "ArrowRight") {
            basketX = Math.min(playArea.clientWidth - 50, basketX + basketSpeed);
        }
        basket.style.left = basketX + "px";
    }
    document.addEventListener("keydown", moveBasket);

    // Timer
    const timerDisplay = document.createElement("p");
    timerDisplay.classList.add("game-hint");
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    container.appendChild(timerDisplay);

    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0 && !finished) {
            finished = true;
            endGame();
        }
    }, 1000);

    function spawnItem() {
        if (finished) return;

        const itemData = items[Math.floor(Math.random() * items.length)];
        const itemEl = document.createElement("div");
        itemEl.classList.add("dash-item");
        itemEl.textContent = itemData.emoji;
        itemEl.style.position = "absolute";
        itemEl.style.width = "40px";
        itemEl.style.height = "40px";
        itemEl.style.fontSize = "24px";
        itemEl.style.left = Math.random() * (playArea.clientWidth - 40) + "px";
        itemEl.style.top = "-40px";
        itemEl.style.textAlign = "center";
        playArea.appendChild(itemEl);

        let fallSpeed = 2 + Math.random() * 3;

        function fall() {
            if (finished) {
                itemEl.remove();
                return;
            }
            let y = parseFloat(itemEl.style.top);
            let x = parseFloat(itemEl.style.left);

            if (
                y + 40 >= playArea.clientHeight - 50 &&
                x + 40 > basketX &&
                x < basketX + 50
            ) {
                // Caught item
                if (itemData.type === "low") {
                    playerStats.health += 1;
                    playerStats.env += 1;
                    launchConfetti(itemEl, "green");
                    bounceBasket();
                } else if (itemData.type === "high") {
                    playerStats.health -= 1;
                    playerStats.env -= 1;
                    bounceBasket();
                } else if (itemData.type === "coin") {
                    playerStats.wallet += 1;
                    launchConfetti(itemEl, "gold");
                    bounceBasket();
                }
                updateDashScore();
                itemEl.remove();
                return;
            }

            if (y + 40 > playArea.clientHeight) {
                itemEl.remove();
                return;
            }

            itemEl.style.top = y + fallSpeed + "px";
            requestAnimationFrame(fall);
        }
        fall();

        setTimeout(spawnItem, 300 + Math.random() * 500);
    }

    function bounceBasket() {
        basket.animate([
            { transform: "translateY(0px)" },
            { transform: "translateY(-10px)" },
            { transform: "translateY(0px)" }
        ], { duration: 200 });
    }

    function updateDashScore() {
        // Show stats as emojis only
        const healthEmoji = playerStats.health <= -3 ? "🤒" : playerStats.health >= 4 ? "❤️" : "😐";
        const walletEmoji = playerStats.wallet <= -1 ? "💸" : playerStats.wallet >= 5 ? "💎" : "💰";
        const envEmoji = playerStats.env <= -2 ? "🏭" : playerStats.env >= 3 ? "🌳" : "🌿";
        scoreDisplay.textContent = `Health: ${healthEmoji} | Wallet: ${walletEmoji} | Env: ${envEmoji}`;
    }

    function launchConfetti(element, color = "green") {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            particle.style.position = "absolute";
            particle.style.left = rect.left + rect.width / 2 + "px";
            particle.style.top = rect.top + rect.height / 2 + "px";
            particle.style.width = particle.style.height = "6px";
            particle.style.backgroundColor = color;
            particle.style.borderRadius = "50%";
            document.body.appendChild(particle);
            const dx = (Math.random() - 0.5) * 50;
            const dy = (Math.random() - 0.5) * 50;
            particle.animate(
                [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }],
                { duration: 800 }
            );
            setTimeout(() => particle.remove(), 800);
        }
    }

    function endGame() {
        finished = true;
        clearInterval(timer);
        document.removeEventListener("keydown", moveBasket);

        container.innerHTML = `
            <div class="screen-container fade-in show">
                <h2>Supermarket Dash Result</h2>
                <p>🎯 Time's up!</p>
                <p>${scoreDisplay.textContent}</p>
                <button class="choice-btn" id="continue-btn">Continue</button>
            </div>
        `;
        document.getElementById("continue-btn").addEventListener("click", () => {
            if (callback) callback();
        });
    }

    gameContainer.appendChild(container);
    setTimeout(() => container.classList.add("show"), 10);

    spawnItem();
}
