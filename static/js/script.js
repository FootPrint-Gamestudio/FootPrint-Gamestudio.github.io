// مدیریت سیستم تم
function initThemeSystem() {
    // تنظیم تم اولیه بر اساس localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
    
    // اضافه کردن event listener به دکمه تغییر تم
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
}

// تغییر تم
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    showNotification(isDarkMode ? "Dark theme activated" : "Light theme activated");
}

// نمایش نوتیفیکیشن
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

// اسکرول به بخش بازی‌ها
function initScrollDownButton() {
    const scrollDownBtn = document.querySelector(".scroll-down");
    if (scrollDownBtn) {
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
}

// انیمیشن لوگو هنگام اسکرول
function initLogoAnimation() {
    const logo = document.querySelector(".logo");
    if (logo) {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            logo.style.transform = `rotate(${5 - 0.1 * scrollY}deg) scale(${1 - 2e-4 * scrollY})`;
        });
    }
}

// دکمه بازگشت به بالا
function initBackToTopButton() {
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        // نمایش/پنهان کردن دکمه بر اساس اسکرول
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("visible", window.scrollY > 300);
        });
        
        // عملکرد کلیک
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

// بارگذاری داده‌های بازی‌ها
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
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        renderGames(data);
        addGamesSchema(data);
    } catch (error) {
        console.error("Error loading games data:", error);
        showGamesError();
    }
}

// رندر بازی‌ها در صفحه
function renderGames(games) {
    const gamesGrid = document.getElementById("gamesGrid");
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = "";
    
    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.itemscope = "";
        gameCard.itemtype = "https://schema.org/VideoGame";
        
        if (!game.is_active) {
            gameCard.style.opacity = "0.5";
            gameCard.style.filter = "grayscale(80%)";
        }
        
        gameCard.innerHTML = `
            <div class="game-image-container">
                <img src="${game.image_url ? 'static/image/' + game.image_url : 'static/icons/placeholder.webp'}" 
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
                <a href="${game.store_link || '#'}" 
                   class="game-link" 
                   ${game.is_active ? "" : 'style="background: #ccc; pointer-events: none;"'} 
                   itemprop="url" 
                   rel="${game.is_active ? "noopener" : "nofollow"}">
                    ${game.is_active ? "View In Store" : "Coming Soon"}
                </a>
            </div>
        `;
        
        gamesGrid.appendChild(gameCard);
    });
}

// افزودن schema.org برای SEO
function addGamesSchema(games) {
    const listSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": games.map((game, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "VideoGame",
                "name": game.name,
                "description": game.description,
                "url": game.store_link || window.location.href,
                "image": game.image_url ? window.location.origin + '/static/image/' + game.image_url : '',
                "author": { "@type": "Organization", "name": "FOOTPRINT Game Studio" }
            }
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(listSchema);
    document.head.appendChild(script);
}

// نمایش خطا وقتی بازی‌ها بارگذاری نشوند
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

// مقداردهی اولیه زمانی که DOM کاملاً لود شده
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
    document.body.removeAttribute("data-loading");
    
    initThemeSystem();
    initScrollDownButton();
    initLogoAnimation();
    initBackToTopButton();
    loadGamesData();
});

// برای دسترسی به تابع loadGamesData از طریق HTML
window.loadGamesData = loadGamesData;
