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

    // Short Rule
    const rules = document.createElement("p");
    rules.classList.add("game-hint");
    rules.textContent = "Place 4 or more veggies on your plate! Avoid junk food!";
    container.appendChild(rules);

    // Score & Timer
    const scoreDisplay = document.createElement("p");
    scoreDisplay.id = "eco-score";
    scoreDisplay.textContent = "Veggies: 0 | Junk: 0";
    container.appendChild(scoreDisplay);

    const timerDisplay = document.createElement("p");
    timerDisplay.id = "eco-timer";
    timerDisplay.textContent = "Time left: 12s";
    container.appendChild(timerDisplay);

    // Plate
    const plateContainer = document.createElement("div");
    plateContainer.classList.add("plate-container");
    container.appendChild(plateContainer);

    const plate = document.createElement("div");
    plate.classList.add("plate");
    plateContainer.appendChild(plate);

    // Foods
    // const foods = [
    //     { name: "🥦", type: "low" },
    //     { name: "🥕", type: "low" },
    //     { name: "🍎", type: "low" },
    //     { name: "🍌", type: "low" },
    //     { name: "🥑", type: "low" },
    //     { name: "🍔", type: "high" },
    //     { name: "🍕", type: "high" },
    //     { name: "🍟", type: "high" },
    //     { name: "🍫", type: "high" }
    // ];

    const allFoods = [
      { name: "🥦", type: "low" },
      { name: "🥕", type: "low" },
      { name: "🍎", type: "low" },
      { name: "🍌", type: "low" },
      { name: "🥑", type: "low" },
      { name: "🍇", type: "low" },
      { name: "🍓", type: "low" },

      { name: "🍔", type: "high" },
      { name: "🍕", type: "high" },
      { name: "🍟", type: "high" },
      { name: "🍫", type: "high" },
      { name: "🥤", type: "high" },
    ];

    // Guarantee at least 4 veggies in the selection
    const veggies = allFoods.filter(f => f.type === "low");
    const junk = allFoods.filter(f => f.type === "high");

    // Pick 4 random veggies
    const chosenVeggies = veggies.sort(() => Math.random() - 0.5).slice(0, 4);

    // Pick 4 random junk foods
    const chosenJunk = junk.sort(() => Math.random() - 0.5).slice(0, 4);

    // Merge and shuffle again
    let foods = [...chosenVeggies, ...chosenJunk].sort(() => Math.random() - 0.5);
    
    let lowImpactCount = 0;
    let highImpactCount = 0;
    let finished = false;

    // Arrange foods in a row
    const foodRow = document.createElement("div");
    foodRow.classList.add("food-row");
    container.appendChild(foodRow);

    foods.forEach(food => {
        const foodEl = document.createElement("div");
        foodEl.classList.add("food-item");
        foodEl.textContent = food.name;
        foodEl.dataset.type = food.type;
        foodRow.appendChild(foodEl);

        // Click to place
        foodEl.addEventListener("click", () => placeFood(foodEl, food.type, food.name));
    });

    // Timer
    let timeLeft = 12;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
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

    function placeFood(element, type, emoji) {
        if (finished) return;

        const droppedItem = document.createElement("span");
        droppedItem.textContent = emoji;
        droppedItem.classList.add("dropped-food");
        plate.appendChild(droppedItem);

        const plateRect = plate.getBoundingClientRect();
        createParticle(plateRect.left + plateRect.width / 2, plateRect.top + plateRect.height / 2, type === "low" ? "green" : "red");

        if (type === "low") lowImpactCount++;
        else highImpactCount++;

        scoreDisplay.textContent = `Veggies: ${lowImpactCount} | Junk: ${highImpactCount}`;
        if (element) element.remove();

        if (lowImpactCount >= 4 || lowImpactCount + highImpactCount >= foods.length) {
            finished = true;
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        let resultMessage = "";

        if (lowImpactCount >= 4) {
            playerStats.env += 3;
            resultMessage = `🥗 Great job! Env +3 🌱`;
            launchConfetti();
        } else {
            playerStats.env -= 3;
            resultMessage = `😢 Not enough veggies. Env -3 🥦`;
        }
        updateStats();

        container.innerHTML = `
            <div class="screen-container fade-in show">
                <h2>Eco Plate Result</h2>
                <p>${resultMessage}</p>
                <button class="choice-btn" id="continue-btn">Continue</button>
            </div>
        `;

        document.getElementById("continue-btn").addEventListener("click", () => {
            if (callback) callback();
        });
    }

    gameContainer.appendChild(container);
    setTimeout(() => container.classList.add("show"), 10);
}
