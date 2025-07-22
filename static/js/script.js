window.addEventListener("load",function(){document.body.classList.add("loaded"),document.body.removeAttribute("data-loading"),loadGamesData()}),document.querySelector(".scroll-down").addEventListener("click",function(){window.scrollTo({top:document.querySelector("#games").offsetTop-80,behavior:"smooth"})}),window.addEventListener("scroll",function(){let e=window.scrollY,t=document.querySelector(".logo");t&&(t.style.transform=`rotate(${5-.1*e}deg) scale(${1-2e-4*e})`);let a=document.getElementById("backToTop");e>300?a.classList.add("visible"):a.classList.remove("visible")}),document.getElementById("backToTop").addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});const themeToggle=document.getElementById("themeToggle"),themeIcon=themeToggle.querySelector("i"),notification=document.getElementById("notification"),notificationText=document.getElementById("notificationText");function loadGamesData(){fetch("game.json",{headers:{"Content-Type":"application/json",Accept:"application/json"},cache:"force-cache"}).then(e=>{if(!e.ok)throw Error("Network response was not ok");return e.json()}).then(e=>{let t=document.getElementById("gamesGrid");t.innerHTML="",e.forEach((e,a)=>{let o=document.createElement("div");o.className="game-card",o.itemscope="",o.itemtype="https://schema.org/VideoGame",e.is_active||(o.style.opacity="0.5",o.style.filter="grayscale(80%)"),o.innerHTML=`
                <div class="game-image-container">
                    <img src="static/image/${e.image_url}" alt="${e.name} screenshot" class="game-image" loading="lazy" width="300" height="200" itemprop="image">
                    ${e.is_new?'<div class="game-badge">New</div>':""}
                </div>
                <div class="game-info">
                    <h3 class="game-name" itemprop="name">${e.name}</h3>
                    <p class="game-description" itemprop="description">${e.description}</p>
                    <meta itemprop="gamePlatform" content="${e.platform||"PC"}">
                    <meta itemprop="applicationCategory" content="Game">
                    <a href="${e.store_link}" class="game-link" ${e.is_active?"":'style="background: #ccc; pointer-events: none;"'} itemprop="url" rel="${e.is_active?"noopener":"nofollow"}">
                        ${e.is_active?"View In Store":"Coming Soon"}
                    </a>
                </div>
            `,t.appendChild(o)})}).catch(e=>{console.error("Error loading games data:",e),w;let t=document.getElementById("gamesGrid");t.innerHTML=`
            <div class="error-message" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                <p>We're having trouble loading our games. Please refresh the page or try again later.</p>
                <button onclick="loadGamesData()">Retry</button>
            </div>
        `})}"dark"===localStorage.getItem("theme")&&(document.body.classList.add("dark-mode"),themeIcon.classList.remove("fa-moon"),themeIcon.classList.add("fa-sun")),themeToggle.addEventListener("click",function(){document.body.classList.toggle("dark-mode"),document.body.classList.contains("dark-mode")?(localStorage.setItem("theme","dark"),themeIcon.classList.remove("fa-moon"),themeIcon.classList.add("fa-sun"),notificationText.textContent="Dark theme is activated"):(localStorage.setItem("theme","light"),themeIcon.classList.remove("fa-sun"),themeIcon.classList.add("fa-moon"),notificationText.textContent="Light theme is activated"),notification.classList.add("show"),setTimeout(function(){notification.classList.remove("show")},3e3)});
