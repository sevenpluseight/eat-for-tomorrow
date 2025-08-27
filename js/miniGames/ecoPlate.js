function startEcoPlateGame(callback) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("screen-container", "fade-in");
    container.id = "eco-plate-game";

    const title = document.createElement("h2");
    title.textContent = "Eco Plate 🌱♻️";
    container.appendChild(title);

    // RULES
    const rules = document.createElement("p");
    rules.classList.add("game-hint");
    rules.innerHTML = `
        <strong>Rules:</strong> Place <span style="color:green">low-impact foods</span> onto the plate!<br>
        Avoid <span style="color:red">high-impact foods</span>.<br>
        Place at least 4 low-impact foods to win!
    `;
    container.appendChild(rules);

    const scoreDisplay = document.createElement("p");
    scoreDisplay.id = "eco-score";
    scoreDisplay.textContent = "Low-Impact: 0 | High-Impact: 0";
    container.appendChild(scoreDisplay);

    const plateContainer = document.createElement("div");
    plateContainer.classList.add("plate-container");
    container.appendChild(plateContainer);

    const plate = document.createElement("div");
    plate.classList.add("plate");
    plateContainer.appendChild(plate);

    const foods = [
        { name: "🥦", type: "low" },
        { name: "🥕", type: "low" },
        { name: "🍎", type: "low" },
        { name: "🍌", type: "low" },
        { name: "🥑", type: "low" },
        { name: "🍔", type: "high" },
        { name: "🍕", type: "high" },
        { name: "🍟", type: "high" },
        { name: "🍫", type: "high" }
    ];

    let lowImpactCount = 0;
    let highImpactCount = 0;
    let finished = false;

    // Arrange foods nicely at the bottom
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

        scoreDisplay.textContent = `Low-Impact: ${lowImpactCount} | High-Impact: ${highImpactCount}`;
        if (element) element.remove();

        if (lowImpactCount >= 4 || lowImpactCount + highImpactCount >= foods.length) {
            finished = true;
            endGame();
        }
    }

    function endGame() {
        let resultMessage = "";
        if (lowImpactCount >= 4) {
            playerStats.env += 3;
            resultMessage = `🥗 “Green plate victory! You made the planet proud! Env +3 🌱✨`;
            launchConfetti(); // celebrate success
        } else {
            playerStats.env -= 3;
            resultMessage = `🥦 Better luck next time! Keep those veggies coming! Env -3 🥗`;
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
