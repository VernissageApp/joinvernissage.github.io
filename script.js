document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const toggleIcon = toggleButton ? toggleButton.querySelector('.theme-toggle-icon') : null;
    const body = document.body;
    const logoImg = document.getElementById('site-logo');

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

        updateLogo(isDark);
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

    function updateLogo(isDark) {
        if (!logoImg) {
            return;
        }

        const lightSrc = logoImg.dataset.light || logoImg.getAttribute('src');
        const darkSrc = logoImg.dataset.dark || lightSrc;
        logoImg.setAttribute('src', isDark ? darkSrc : lightSrc);
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
});
