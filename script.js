document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
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
            toggleButton.textContent = '☀️';
        } else {
            body.classList.remove('dark');
            toggleButton.textContent = '🌙';
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

    // Attach click handler to toggle the theme
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('vernissage-theme', theme);
        applyTheme(theme);
    });
});
