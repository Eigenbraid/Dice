// Major Arcana cards (0-21)
const majorArcana = [
    { number: 0, name: "The Fool", type: "major" },
    { number: 1, name: "The Magician", type: "major" },
    { number: 2, name: "The High Priestess", type: "major" },
    { number: 3, name: "The Empress", type: "major" },
    { number: 4, name: "The Emperor", type: "major" },
    { number: 5, name: "The Hierophant", type: "major" },
    { number: 6, name: "The Lovers", type: "major" },
    { number: 7, name: "The Chariot", type: "major" },
    { number: 8, name: "Strength", type: "major" },
    { number: 9, name: "The Hermit", type: "major" },
    { number: 10, name: "Wheel of Fortune", type: "major" },
    { number: 11, name: "Justice", type: "major" },
    { number: 12, name: "The Hanged Man", type: "major" },
    { number: 13, name: "Death", type: "major" },
    { number: 14, name: "Temperance", type: "major" },
    { number: 15, name: "The Devil", type: "major" },
    { number: 16, name: "The Tower", type: "major" },
    { number: 17, name: "The Star", type: "major" },
    { number: 18, name: "The Moon", type: "major" },
    { number: 19, name: "The Sun", type: "major" },
    { number: 20, name: "Judgement", type: "major" },
    { number: 21, name: "The World", type: "major" }
];

// Minor Arcana cards
const minorArcana = [];
const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

// Generate Minor Arcana
suits.forEach(suit => {
    ranks.forEach(rank => {
        minorArcana.push({
            suit: suit,
            rank: rank,
            name: `${rank} of ${suit}`,
            type: "minor"
        });
    });
});

// State
let currentDeck = [];
let readingHistory = [];
let handCounter = 0;

// Initialize deck based on selected type
function createDeck(deckType = 'major') {
    switch(deckType) {
        case 'both':
            return [...majorArcana, ...minorArcana];
        case 'major':
            return [...majorArcana];
        case 'minor':
            return [...minorArcana];
        default:
            return [...majorArcana];
    }
}

// Shuffle deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Draw a card from the deck (without replacement)
function drawCard() {
    if (currentDeck.length === 0) {
        return null;
    }
    return currentDeck.pop();
}

// Format card for display
function formatCard(card) {
    if (card.type === 'major') {
        return `${card.number}. ${card.name}`;
    } else {
        return card.name;
    }
}

// Get selected deck type
function getSelectedDeckType() {
    const radios = document.getElementsByName('deckType');
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return 'major'; // default
}

// Perform a new reading
function performReading() {
    // Get selected deck type
    const deckType = getSelectedDeckType();

    // Create and shuffle a fresh deck
    currentDeck = shuffleDeck(createDeck(deckType));

    // Draw three cards
    const pastCard = drawCard();
    const presentCard = drawCard();
    const futureCard = drawCard();

    // Update display
    updateCardDisplay('pastCard', pastCard);
    updateCardDisplay('presentCard', presentCard);
    updateCardDisplay('futureCard', futureCard);

    // Add to history
    handCounter++;
    addToHistory(handCounter, pastCard, presentCard, futureCard);
}

// Update card display
function updateCardDisplay(elementId, card) {
    const element = document.getElementById(elementId);
    if (card) {
        element.textContent = formatCard(card);
        element.classList.add('filled');
    } else {
        element.textContent = '--';
        element.classList.remove('filled');
    }
}

// Add reading to history
function addToHistory(handNumber, pastCard, presentCard, futureCard) {
    const reading = {
        hand: handNumber,
        cards: [pastCard, presentCard, futureCard]
    };

    readingHistory.unshift(reading);
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('readingHistory');
    historyContainer.innerHTML = '';

    readingHistory.forEach(reading => {
        const handDiv = document.createElement('div');
        handDiv.className = 'history-hand';

        const title = document.createElement('div');
        title.className = 'history-hand-title';
        title.textContent = `Hand ${reading.hand}`;

        const cardList = document.createElement('ul');
        reading.cards.forEach(card => {
            const li = document.createElement('li');
            li.textContent = formatCard(card);
            cardList.appendChild(li);
        });

        handDiv.appendChild(title);
        handDiv.appendChild(cardList);
        historyContainer.appendChild(handDiv);
    });
}

// Event listeners
document.getElementById('newReadingButton').addEventListener('click', performReading);
