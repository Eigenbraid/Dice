/**
 * ThemeManager.js
 * Handles theme switching and persistence across all pages
 */

// Available themes
const THEMES = {
    AUTUMN: 'autumn',
    LIGHT: 'light',
    DARK: 'dark',
    WINTER: 'winter',
    SPRING: 'spring',
    SUMMER: 'summer'
};

// Default theme
const DEFAULT_THEME = THEMES.AUTUMN;

// LocalStorage key
const STORAGE_KEY = 'dice-roller-theme';

/**
 * Gets the current theme from localStorage or returns default
 */
function getCurrentTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme || DEFAULT_THEME;
}

/**
 * Applies a theme to the document body
 * @param {string} theme - The theme name to apply
 */
function applyTheme(theme) {
    // Remove all theme classes
    Object.values(THEMES).forEach(t => {
        document.body.classList.remove(`${t}-theme`);
    });

    // Apply new theme class (except for autumn which is default)
    if (theme !== THEMES.AUTUMN) {
        document.body.classList.add(`${theme}-theme`);
    }
}

/**
 * Sets a theme and persists it to localStorage
 * @param {string} theme - The theme name to set
 */
function setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
        console.warn(`Invalid theme: ${theme}. Using default.`);
        theme = DEFAULT_THEME;
    }

    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
}

/**
 * Initializes the theme system
 * Should be called as early as possible to prevent flash of unstyled content
 */
function initializeTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
}

/**
 * Creates and returns a theme selector dropdown element
 * @returns {HTMLSelectElement} The theme selector dropdown
 */
function createThemeSelector() {
    const currentTheme = getCurrentTheme();

    const select = document.createElement('select');
    select.id = 'theme-selector';
    select.className = 'theme-selector';

    // Add options
    const options = [
        { value: THEMES.AUTUMN, label: 'Autumn' },
        { value: THEMES.LIGHT, label: 'Light' },
        { value: THEMES.DARK, label: 'Dark' },
        { value: THEMES.WINTER, label: 'Winter' },
        { value: THEMES.SPRING, label: 'Spring' },
        { value: THEMES.SUMMER, label: 'Summer' }
    ];

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.value === currentTheme) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });

    // Add event listener
    select.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    return select;
}

/**
 * Adds the theme selector to the page
 * Call this after DOM content is loaded
 */
function addThemeSelector() {
    // Try to find the header element
    const header = document.querySelector('.header');

    if (header) {
        // Create a wrapper for the theme selector
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-selector-wrapper';

        const label = document.createElement('label');
        label.textContent = 'Theme: ';
        label.htmlFor = 'theme-selector';
        label.style.marginRight = '8px';

        const selector = createThemeSelector();

        wrapper.appendChild(label);
        wrapper.appendChild(selector);

        // Insert at the beginning of the header
        header.insertBefore(wrapper, header.firstChild);
    } else {
        console.warn('Could not find .header element to add theme selector');
    }
}

// Export for ES modules
export {
    THEMES,
    DEFAULT_THEME,
    getCurrentTheme,
    setTheme,
    initializeTheme,
    createThemeSelector,
    addThemeSelector
};
