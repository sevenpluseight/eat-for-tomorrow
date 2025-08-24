document.addEventListener("DOMContentLoaded", () => {
  const emojis = document.querySelectorAll(".emoji-bg span");
  const animations = ["floatVertical", "floatHorizontal", "floatDiagonal", "floatWave"];

  // Hero Section - Emojis floating animations
  emojis.forEach((emoji) => {
    const floatY = 12 + Math.random() * 18;   // 12-30px vertical
    const floatX = -12 + Math.random() * 24;  // -12 to +12px horizontal
    const duration = 7 + Math.random() * 6;   // 7-13s
    const delay = Math.random() * 3;          // 0-3s
    const scale = 0.95 + Math.random() * 0.1;
    const opacity = 0.9 + Math.random() * 0.1;
    const animation = animations[Math.floor(Math.random() * animations.length)];

    emoji.style.setProperty("--floatY", `${floatY}px`);
    emoji.style.setProperty("--floatX", `${floatX}px`);
    emoji.style.setProperty("--scale", scale);
    emoji.style.setProperty("--opacity", opacity);

    emoji.style.animation = `${animation} ${duration}s ease-in-out ${delay}s infinite alternate`;
  });

  // Navbar active state toggle
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Theme toggle
  const themeToggle = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");
  const githubIcon = document.querySelector("#github-icon")

  // Load saved theme
  let savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  themeIcon.src = savedTheme === "dark" 
    ? "assets/icons/light-mode.svg"
    : "assets/icons/dark-mode.svg";
  githubIcon.src = savedTheme === "dark"
    ? "assets/icons/github-light.svg"
    : "assets/icons/github-dark.svg";

  themeToggle.addEventListener("click", () => {
    if(document.body.classList.contains("dark")) {
      document.body.classList.replace("dark", "light");
      themeIcon.src = "assets/icons/dark-mode.svg";
      githubIcon.src = "assets/icons/github-dark.svg";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.replace("light", "dark");
      themeIcon.src = "assets/icons/light-mode.svg";
      githubIcon.src = "assets/icons/github-light.svg";
      localStorage.setItem("theme", "dark");
    }
  });

  // Back to top functionality
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".emoji[data-quote]").forEach(emoji => {
    const rect = emoji.getBoundingClientRect();
    
    if (rect.top > 60) {
      emoji.dataset.position = "bottom";
    }
  });
});