window.addEventListener("load", function() {
    document.body.classList.add("loaded");
    document.body.removeAttribute("data-loading");
    loadGamesData();
});

document.querySelector(".scroll-down").addEventListener("click", function() {
    window.scrollTo({
        top: document.querySelector("#games").offsetTop - 80,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", function() {
    let scrollY = window.scrollY;
    let logo = document.querySelector(".logo");
    
    if (logo) {
        logo.style.transform = `rotate(${5 - 0.1 * scrollY}deg) scale(${1 - 2e-4 * scrollY})`;
    }
    
    let backToTop = document.getElementById("backToTop");
    scrollY > 300 ? backToTop.classList.add("visible") : backToTop.classList.remove("visible");
});

document.getElementById("backToTop").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const themeToggle = document.getElementById("themeToggle");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

function loadGamesData() {
    fetch("game.json", {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        cache: "no-cache",
        referrerPolicy: "strict-origin-when-cross-origin"
    })
    .then(response => {
        if (!response.ok) throw Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        let gamesGrid = document.getElementById("gamesGrid");
        gamesGrid.innerHTML = "";
        
        // Add schema for ItemList
        const listSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": []
        };
        
        data.forEach((game, index) => {
            let gameCard = document.createElement("div");
            gameCard.className = "game-card";
            gameCard.itemscope = "";
            gameCard.itemtype = "https://schema.org/VideoGame";
            
            if (!game.is_active) {
                gameCard.style.opacity = "0.5";
                gameCard.style.filter = "grayscale(80%)";
            }
            
            gameCard.innerHTML = `
                <div class="game-image-container">
                    <img src="${game.image_url ? 'static/image/' + game.image_url : 'static/icons/placeholder.jpg'}" 
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
            
            // Add to schema
            listSchema.itemListElement.push({
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
            });
        });
        
        // Add schema to head
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(listSchema);
        document.head.appendChild(script);
    })
    .catch(error => {
        console.error("Error loading games data:", error);
        let gamesGrid = document.getElementById("gamesGrid");
        gamesGrid.innerHTML = `
            <div class="error-message" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"/></svg>
                <p>We're having trouble loading our games. Please refresh the page or try again later.</p>
                <button onclick="loadGamesData()" class="retry-btn">Retry</button>
            </div>
        `;
    });
}

// Theme toggle functionality
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        notificationText.textContent = "Dark theme activated";
    } else {
        localStorage.setItem("theme", "light");
        notificationText.textContent = "Light theme activated";
    }
    
    notification.classList.add("show");
    setTimeout(function() {
        notification.classList.remove("show");
    }, 3000);
});
