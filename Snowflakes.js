/**
 * Snowflakes.js
 * Creates animated falling snowflakes for the Winter theme
 */

function createSnowflakes() {
    // Only create snowflakes if Winter theme is active
    if (!document.documentElement.classList.contains('winter-theme')) {
        return;
    }

    // Remove any existing snowflake container
    const existingContainer = document.getElementById('snowflake-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create container for snowflakes
    const container = document.createElement('div');
    container.id = 'snowflake-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    // Create 30 snowflakes with random properties
    const snowflakeCount = 30;

    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake(container);
    }
}

function createSnowflake(container) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';

    // Random properties
    const startPositionX = Math.random() * 100; // 0-100vw
    const duration = 15 + Math.random() * 20; // 15-35 seconds
    const delay = Math.random() * -30; // Start at different points in animation
    const size = 0.8 + Math.random() * 1.2; // 0.8em - 2em
    const opacity = 0.33 + Math.random() * 0.33; // 0.33 - 0.66
    const drift = -30 + Math.random() * 60; // Horizontal drift -30px to +30px
    const rotation = Math.random() * 360; // Starting rotation
    const rotationSpeed = 180 + Math.random() * 360; // Rotation amount during fall

    snowflake.style.cssText = `
        position: absolute;
        top: -50px;
        left: ${startPositionX}vw;
        font-size: ${size}em;
        opacity: ${opacity};
        color: rgba(255, 255, 255, 0.95);
        animation: snowfall-${Math.floor(Math.random() * 3)} ${duration}s linear infinite;
        animation-delay: ${delay}s;
        user-select: none;
        transform: rotate(${rotation}deg);
    `;

    // Set CSS variables for this specific snowflake's animation
    snowflake.style.setProperty('--drift', `${drift}px`);
    snowflake.style.setProperty('--rotation', `${rotationSpeed}deg`);

    container.appendChild(snowflake);
}

// Initialize snowflakes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSnowflakes);
} else {
    createSnowflakes();
}

// Re-create snowflakes when theme changes to Winter
// We'll export this function so ThemeManager can call it
export { createSnowflakes };
