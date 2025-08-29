function startQuickClickGame(callback) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // clear current day screen

    const container = document.createElement("div");
    container.classList.add("screen-container", "fade-in");
    container.id = "quick-click-game";

    // Title
    const title = document.createElement("h2");
    title.textContent = "Quick Click Challenge! 🖱️";
    container.appendChild(title);

    // Instructions
    const instructions = document.createElement("p");
    instructions.textContent = "Click the button as fast as you can in 5 seconds!";
    container.appendChild(instructions);

    // Timer display
    const timerDisplay = document.createElement("p");
    timerDisplay.textContent = "Time left: 5s";
    container.appendChild(timerDisplay);

    container.appendChild(createSpacer("5px"));

    // Click button
    const clickBtn = document.createElement("button");
    clickBtn.textContent = "Click me!";
    clickBtn.classList.add("choice-btn");
    container.appendChild(clickBtn);

    // Score display
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = "Clicks: 0";
    container.appendChild(scoreDisplay);

    container.appendChild(createSpacer("5px"));

    // Rule hint
    const ruleHint = document.createElement("p");
    ruleHint.textContent = "Rule: 15+ clicks → Wallet +2, otherwise Wallet -2";
    ruleHint.classList.add("game-hint");
    container.appendChild(ruleHint);

    let score = 0;
    let timeLeft = 5;

    clickBtn.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = `Clicks: ${score}`;
    });

    // Countdown timer
    const countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(countdown);

            let resultMessage = "";
            if (score >= 15) {
                playerStats.wallet += 2; 
                resultMessage = `🎉 Great! You scored <strong>${score}</strong> clicks! Wallet +2`;
                launchConfetti();
            } else {
                playerStats.wallet -= 2;
                resultMessage = `😅 You scored only <strong>${score}</strong> clicks. Wallet -2`;
            }
            updateStats();

            gameContainer.innerHTML = `
                <div class="screen-container fade-in show">
                    <h2>Game Over!</h2>
                    <p>${resultMessage}</p>
                    <br>
                    <button class="choice-btn" id="continue-btn" disabled>Continue</button>
                </div>
            `;

            const continueBtn = document.getElementById("continue-btn");

            setTimeout(() => {
                continueBtn.disabled = false;
            }, 1000);

            continueBtn.addEventListener("click", () => {
                if (callback) callback(score);
            });
        }
    }, 1000);

    gameContainer.appendChild(container);
    setTimeout(() => container.classList.add("show"), 10); 
}

function createSpacer(height = "10px") {
    const spacer = document.createElement("div");
    spacer.classList.add("spacer");
    spacer.style.setProperty("--spacer-height", height);
    return spacer;
}