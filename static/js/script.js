// Load event to show content when ready
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    document.body.removeAttribute('data-loading');
    
    // Load games after page is ready
    loadGamesData();
});

// Scroll animation
document.querySelector('.scroll-down').addEventListener('click', function() {
    window.scrollTo({
        top: document.querySelector('#games').offsetTop - 80,
        behavior: 'smooth'
    });
});

// Parallax effect
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const logo = document.querySelector('.logo');

    if (logo) {
        logo.style.transform = `rotate(${5 - scrollPosition * 0.1}deg) scale(${1 - scrollPosition * 0.0002})`;
    }

    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (scrollPosition > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top button
document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Check saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        notificationText.textContent = 'Dark theme is activated';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        notificationText.textContent = 'Light theme is activated';
    }

    // Show notification
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
});

// Load games data from game.json with error handling
function loadGamesData() {
    fetch('game.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        cache: 'force-cache'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(games => {
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = '';
        
        games.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.itemscope = '';
            gameCard.itemtype = 'https://schema.org/VideoGame';
            
            if (!game.is_active) {
                gameCard.style.opacity = '0.5';
                gameCard.style.filter = 'grayscale(80%)';
            }
            
            gameCard.innerHTML = `
                <div class="game-image-container">
                    <img src="static/image/${game.image_url}" alt="${game.name} screenshot" class="game-image" loading="lazy" width="300" height="200" itemprop="image">
                    ${game.is_new ? '<div class="game-badge">New</div>' : ''}
                </div>
                <div class="game-info">
                    <h3 class="game-name" itemprop="name">${game.name}</h3>
                    <p class="game-description" itemprop="description">${game.description}</p>
                    <meta itemprop="gamePlatform" content="${game.platform || 'PC'}">
                    <meta itemprop="applicationCategory" content="Game">
                    <a href="${game.store_link}" class="game-link" ${!game.is_active ? 'style="background: #ccc; pointer-events: none;"' : ''} itemprop="url" rel="${game.is_active ? 'noopener' : 'nofollow'}">
                        ${game.is_active ? 'View In Store' : 'Coming Soon'}
                    </a>
                </div>
            `;
            
            gamesGrid.appendChild(gameCard);
        });
    })
    .catch(error => {
        console.error('Error loading games data:', error);
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = `
            <div class="error-message" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                <p>We're having trouble loading our games. Please refresh the page or try again later.</p>
                <button onclick="loadGamesData()">Retry</button>
            </div>
        `;
    });
}
