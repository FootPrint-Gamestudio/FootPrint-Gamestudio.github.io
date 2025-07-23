function initThemeSystem() {
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // Setup theme toggle button
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  showNotification(isDarkMode ? "Dark theme activated" : "Light theme activated");
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notificationText");
  
  if (notification && notificationText) {
    notificationText.textContent = message;
    notification.classList.add("show");
    
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}

/**
 * Scroll-related Functions (Optimized)
 */
function initScrollDownButton() {
  const scrollDownBtn = document.querySelector(".scroll-down");
  if (!scrollDownBtn) return;

  scrollDownBtn.addEventListener("click", () => {
    const gamesSection = document.querySelector("#games");
    if (gamesSection) {
      window.scrollTo({
        top: gamesSection.offsetTop - 80,
        behavior: "smooth"
      });
    }
  });
}

// Combined scroll handlers with requestAnimationFrame
function initScrollHandlers() {
  const logo = document.querySelector(".logo");
  const backToTopBtn = document.getElementById("backToTop");
  
  if (!logo && !backToTopBtn) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateElements = () => {
    // Logo animation
    if (logo) {
      logo.style.transform = `rotate(${5 - 0.1 * lastScrollY}deg) scale(${1 - 2e-4 * lastScrollY})`;
    }
    
    // Back to top button
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", lastScrollY > 300);
    }
    
    ticking = false;
  };

  const handleScroll = () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(updateElements);
      ticking = true;
    }
  };

  // Use passive event listener for better performance
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * Games Data Functions
 */
async function loadGamesData() {
  try {
    const response = await fetch("game.json", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      cache: "no-cache",
      referrerPolicy: "strict-origin-when-cross-origin"
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const gamesData = await response.json();
    renderGames(gamesData);
    addGamesSchema(gamesData);
  } catch (error) {
    console.error("Error loading games data:", error);
    showGamesError();
  }
}

function renderGames(games) {
  const gamesGrid = document.getElementById("gamesGrid");
  if (!gamesGrid) return;

  gamesGrid.innerHTML = "";

  games.forEach(game => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    gameCard.itemScope = "";
    gameCard.itemType = "https://schema.org/VideoGame";

    if (!game.is_active) {
      gameCard.style.opacity = "0.5";
      gameCard.style.filter = "grayscale(80%)";
    }

    const imageUrl = game.image_url 
      ? `static/image/${game.image_url}`
      : "placeholder.webp";

    gameCard.innerHTML = `
      <div class="game-image-container">
        <img src="${imageUrl}"
             alt="${game.name} by FOOTPRINT Game Studio"
             class="game-image"
             loading="lazy"
             width="300"
             height="200"
             itemprop="image">
        ${game.is_new ? '<div class="game-badge">New</div>' : ""}
      </div>
      <div class="game-info">
        <h3 class="game-name" itemprop="name">${game.name}</h3>
        <p class="game-description" itemprop="description">${game.description}</p>
        <meta itemprop="gamePlatform" content="${game.platform || "PC"}">
        <meta itemprop="applicationCategory" content="Game">
        <a href="${game.store_link || "#"}"
           class="game-link"
           ${!game.is_active ? 'style="background: #ccc; pointer-events: none;"' : ""}
           itemprop="url"
           rel="${game.is_active ? "noopener" : "nofollow"}">
          ${game.is_active ? "View In Store" : "Coming Soon"}
        </a>
      </div>
    `;

    gamesGrid.appendChild(gameCard);
  });
}

function addGamesSchema(games) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: games.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoGame",
        name: game.name,
        description: game.description,
        url: game.store_link || window.location.href,
        image: game.image_url 
          ? `${window.location.origin}/static/image/${game.image_url}`
          : "",
        author: {
          "@type": "Organization",
          name: "FOOTPRINT Game Studio"
        }
      }
    }))
  };

  const scriptTag = document.createElement("script");
  scriptTag.type = "application/ld+json";
  scriptTag.textContent = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
}

function showGamesError() {
  const gamesGrid = document.getElementById("gamesGrid");
  if (!gamesGrid) return;

  gamesGrid.innerHTML = `
    <div class="error-message" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
        <path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"/>
      </svg>
      <p>We're having trouble loading our games. Please refresh the page or try again later.</p>
      <button onclick="loadGamesData()" class="retry-btn">Retry</button>
    </div>
  `;
}

/**
 * Initialize everything when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Remove loading state
  document.body.classList.add("loaded");
  document.body.removeAttribute("data-loading");

  // Initialize all systems
  initThemeSystem();
  initScrollDownButton();
  initScrollHandlers(); // Combined logo animation and back-to-top button
  loadGamesData();
});

// Make loadGamesData available globally for retry button
window.loadGamesData = loadGamesData;
