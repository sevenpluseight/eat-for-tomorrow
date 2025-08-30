function startEcoPlateGame(callback) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("screen-container", "fade-in");
    container.id = "eco-plate-game";

    // Title
    const title = document.createElement("h2");
    title.textContent = "Eco Plate 🌱";
    container.appendChild(title);

    // Rules
    const rules = document.createElement("p");
    rules.classList.add("eco-rule");
    rules.innerHTML = '<span class="emoji">🥗</span> Collect 5 veggies! Avoid junk food! <span class="emoji">⏳</span>';
    container.appendChild(rules);


    // Score & Timer
    const scoreDisplay = document.createElement("p");
    scoreDisplay.id = "eco-score";
    scoreDisplay.textContent = "Veggies: 0 | Junk: 0";
    container.appendChild(scoreDisplay);

    const timerDisplay = document.createElement("p");
    timerDisplay.id = "eco-timer";
    timerDisplay.textContent = "Time left: 12s ⏳";
    container.appendChild(timerDisplay);

    // Plate
    const plateContainer = document.createElement("div");
    plateContainer.classList.add("plate-container");
    container.appendChild(plateContainer);

    const plate = document.createElement("div");
    plate.classList.add("plate");
    plateContainer.appendChild(plate);
    plateContainer.style.border = "4px solid #f5e6a2";

    // Food pool
    const allFoods = [
        // Veggies
        { name: "🥦", type: "low" }, { name: "🥕", type: "low" },
        { name: "🍎", type: "low" }, { name: "🍌", type: "low" },
        { name: "🥑", type: "low" }, { name: "🌽", type: "low" },
        { name: "🍓", type: "low" }, { name: "🥬", type: "low" },
        { name: "🍇", type: "low" }, { name: "🍉", type: "low" },
        // Junk
        { name: "🍔", type: "high" }, { name: "🍕", type: "high" },
        { name: "🍟", type: "high" }, { name: "🍫", type: "high" },
        { name: "🥤", type: "high" }, { name: "🍩", type: "high" }
    ];

    // Shuffle helper
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Guarantee enough veggies & junk
    const veggies = allFoods.filter(f => f.type === "low");
    const junk = allFoods.filter(f => f.type === "high");

    const chosenVeggies = shuffleArray([...veggies]).slice(0, 6); // always ≥5 veggies
    const chosenJunk = shuffleArray([...junk]).slice(0, 4);       // at least 3 junk

    let foods = shuffleArray([...chosenVeggies, ...chosenJunk]);

    // Game state
    let lowImpactCount = 0;
    let highImpactCount = 0;
    const maxJunk = 2;     
    const plateMaxItems = 6;
    const targetVeggies = 5;
    let finished = false;

    // Display foods
    const foodRow = document.createElement("div");
    foodRow.classList.add("food-row");
    container.appendChild(foodRow);

    foods.forEach(food => {
        const foodEl = document.createElement("div");
        foodEl.classList.add("food-item");
        foodEl.textContent = food.name;
        foodEl.dataset.type = food.type;
        foodRow.appendChild(foodEl);

        foodEl.addEventListener("click", () => placeFood(foodEl, food.type, food.name));
    });

    // Timer
    let timeLeft = 12;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s ⏳`;
        if (timeLeft <= 0 && !finished) {
            finished = true;
            endGame();
        }
    }, 1000);

    // Particle effect
    function createParticle(x, y, color) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            particle.style.position = "absolute";
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.style.width = particle.style.height = "6px";
            particle.style.backgroundColor = color;
            particle.style.borderRadius = "50%";
            document.body.appendChild(particle);
            const dx = (Math.random() - 0.5) * 20;
            const dy = (Math.random() - 0.5) * 20;
            particle.animate([
                { transform: "translate(0,0)", opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
            ], { duration: 600 });
            setTimeout(() => particle.remove(), 600);
        }
    }

    // Junk shake effect
    function shakeElement(el) {
        el.animate([
            { transform: "translateX(0)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(0)" }
        ], { duration: 300 });

        el.style.filter = "drop-shadow(0 0 6px red) drop-shadow(0 0 12px red)";
        setTimeout(() => { el.style.filter = ""; }, 400);
    }

    function shakePlate() {
    plateContainer.animate([
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(0)" }
    ], { duration: 400 });
    }

    function flashPlateBorder(color) {
    plateContainer.style.borderColor = color;
    setTimeout(() => {
        plateContainer.style.borderColor = "#f5e6a2";
    }, 400);
    }

    function placeFood(element, type, emoji) {
        if (finished) return;
        if (plate.children.length >= plateMaxItems) return;

        const droppedItem = document.createElement("span");
        droppedItem.textContent = emoji;
        droppedItem.classList.add("dropped-food");
        plate.appendChild(droppedItem);

        const plateRect = plate.getBoundingClientRect();
        createParticle(
            plateRect.left + plateRect.width / 2,
            plateRect.top + plateRect.height / 2,
            type === "low" ? "green" : "red"
        );

        if (type === "low") {
            lowImpactCount++;
            flashPlateBorder("green");
        } else {
            highImpactCount++;
            flashPlateBorder("red");
            shakeElement(element);
            shakePlate();
        }

        scoreDisplay.textContent = `Veggies: ${lowImpactCount} | Junk: ${highImpactCount}`;
        if (element) element.remove();

        if (highImpactCount >= maxJunk) {
            finished = true;
            endGame();
            return;
        }

        if (lowImpactCount >= targetVeggies) {
            finished = true;
            endGame();
            return;
        }

        if (plate.children.length >= plateMaxItems && lowImpactCount < targetVeggies) {
            finished = true;
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval);

        let envChange = 0;
        let resultMessage = "";
        if (lowImpactCount >= targetVeggies && highImpactCount < maxJunk) {
            playerStats.env += 3;
            envChange = 3;
            resultMessage = `💚 Excellent! Veggies love you!  Env +3`;
            launchConfetti();
        } else if (highImpactCount >= maxJunk) {
            playerStats.env -= 3;
            envChange = -3;
            resultMessage = `😖 Too much junk! Env -3`;
        } else {
            playerStats.env -= 3;
            resultMessage = `🥲 Not enough veggies. Env -3`;
        }
        updateStats();

        container.innerHTML = `
            <div class="screen-container fade-in show">
                <h2>Game Over!</h2>
                <p>${resultMessage}</p>
                <br>
                <button class="choice-btn" id="continue-btn">Continue</button>
            </div>
        `;

        setTimeout(() => {
            showFloatingChange(0, 0, envChange, null);
        }, 200);

        document.getElementById("continue-btn").addEventListener("click", () => {
            if (callback) callback();
        });
    }

    gameContainer.appendChild(container);
    setTimeout(() => container.classList.add("show"), 10);
}
