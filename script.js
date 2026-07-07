document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const toggleIcon = toggleButton ? toggleButton.querySelector('.theme-toggle-icon') : null;
    const body = document.body;
    const logoImg = document.getElementById('site-logo');
    const appStoreBadge = document.getElementById('appstore-badge');
    const brandAssetsIcon = document.getElementById('brand-assets-icon');
    const brandAssetsLogo = document.getElementById('brand-assets-logo');
    const mobileAppShots = [
        document.getElementById('mobile-app-shot-1'),
        document.getElementById('mobile-app-shot-2')
    ].filter(Boolean);

    const servers = [
        {
            name: "vernissage.photos",
            url: "https://vernissage.photos/register",
            img: "images/servers/84grngkm.png",
            category: "General",
            language: "EN",
            description: "Official Vernissage server, run by the platform's creator. It's a focused space for photographers of all kinds (amateurs to professionals) who want a clean, creative place to share their work and connect with others in the fediverse."
        },
        {
            name: "vernissage.pnpde.social",
            url: "https://vernissage.pnpde.social/register",
            img: "images/servers/rhngk84u.png",
            category: "General",
            language: "DE",
            description: "We're an inclusive community for anyone who loves games and creativity-board gamers, RPG players, LARPers, designers, artists, creators, and everyone curious. We work to keep this a kind, supportive space, especially welcoming to marginalized folks who want a relaxed place to hang out."
        }
    ];

    /**
     * Apply the given theme by toggling the `dark` class and updating the
     * toggle button text.    Valid values for theme are 'dark' or 'light'.
     * @param {string} theme
     */
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        if (isDark) {
            body.classList.add('dark');
            setToggleIcon('☀️');
        } else {
            body.classList.remove('dark');
            setToggleIcon('🌙');
        }

        updateThemeAssets(isDark);
    }

    // Check for a stored preference
    const storedTheme = localStorage.getItem('vernissage-theme');
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        // Use system preference if no stored preference exists
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        }
    }

    function updateThemeImage(imgElement, isDark) {
        if (!imgElement) {
            return;
        }

        const lightSrc = imgElement.dataset.light || imgElement.getAttribute('src');
        const darkSrc = imgElement.dataset.dark || lightSrc;
        imgElement.setAttribute('src', isDark ? darkSrc : lightSrc);
    }

    function updateThemeAssets(isDark) {
        updateThemeImage(logoImg, isDark);
        updateThemeImage(appStoreBadge, isDark);
        updateThemeImage(brandAssetsIcon, isDark);
        updateThemeImage(brandAssetsLogo, isDark);
    }

    function setToggleIcon(icon) {
        if (!toggleButton) {
            return;
        }

        if (toggleIcon) {
            toggleIcon.textContent = icon;
        } else {
            toggleButton.textContent = icon;
        }
    }

    // Attach click handler to toggle the theme
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark');
            const theme = isDark ? 'dark' : 'light';
            localStorage.setItem('vernissage-theme', theme);
            applyTheme(theme);
        });
    }

    function pickRandomScreens(count) {
        const screens = [
            { src: 'images/ios-01.png', alt: 'Vernissage iOS app feed view' },
            { src: 'images/ios-02.png', alt: 'Vernissage iOS app photo detail view' },
            { src: 'images/ios-03.png', alt: 'Vernissage iOS app profile view' },
            { src: 'images/ios-04.png', alt: 'Vernissage iOS app comments and interactions view' }
        ];

        for (let i = screens.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [screens[i], screens[j]] = [screens[j], screens[i]];
        }

        return screens.slice(0, count);
    }

    function updateMobileAppScreens() {
        if (mobileAppShots.length === 0) {
            return;
        }

        const selectedScreens = pickRandomScreens(mobileAppShots.length);
        mobileAppShots.forEach((shot, index) => {
            const selected = selectedScreens[index];
            if (!selected) {
                return;
            }

            shot.setAttribute('src', selected.src);
            shot.setAttribute('alt', selected.alt);
        });
    }

    updateMobileAppScreens();

    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('[data-dropdown-toggle]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        const items = menu ? Array.from(menu.querySelectorAll('a')) : [];

        if (!toggle || !menu) {
            return;
        }

        const closeDropdown = () => {
            dropdown.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        const openDropdown = () => {
            dropdown.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
        };

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const isOpen = dropdown.classList.contains('open');
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
                if (items.length) {
                    items[0].focus();
                }
            }
        });

        items.forEach((item) => {
            item.addEventListener('click', () => closeDropdown());
        });

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });

        dropdown.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
                toggle.focus();
            }
        });
    });

    // Render server cards on the servers page
    const serversGrid = document.getElementById('servers-grid');
    if (serversGrid) {
        servers.forEach((server) => {
            const categoryLabel = (server.category || 'General').toUpperCase();
            const card = document.createElement('article');
            card.className = 'server-card';

            card.innerHTML = `
                <div class="server-thumb">
                    <img src="${server.img}" alt="${server.name} server cover">
                </div>
                <div class="server-body">
                    <p class="server-tag">${categoryLabel}</p>
                    <h3 class="server-name">${server.name}</h3>
                    <p class="server-desc">${server.description}</p>
                </div>
                <div class="server-footer">
                    <a class="btn primary" href="${server.url}" target="_blank" rel="noopener noreferrer">Create account</a>
                </div>
            `;

            serversGrid.appendChild(card);
        });
    }
});
