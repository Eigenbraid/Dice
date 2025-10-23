// Major Arcana cards (0-21)
const majorArcana = [
    { number: 0, name: "The Fool" },
    { number: 1, name: "The Magician" },
    { number: 2, name: "The High Priestess" },
    { number: 3, name: "The Empress" },
    { number: 4, name: "The Emperor" },
    { number: 5, name: "The Hierophant" },
    { number: 6, name: "The Lovers" },
    { number: 7, name: "The Chariot" },
    { number: 8, name: "Strength" },
    { number: 9, name: "The Hermit" },
    { number: 10, name: "Wheel of Fortune" },
    { number: 11, name: "Justice" },
    { number: 12, name: "The Hanged Man" },
    { number: 13, name: "Death" },
    { number: 14, name: "Temperance" },
    { number: 15, name: "The Devil" },
    { number: 16, name: "The Tower" },
    { number: 17, name: "The Star" },
    { number: 18, name: "The Moon" },
    { number: 19, name: "The Sun" },
    { number: 20, name: "Judgement" },
    { number: 21, name: "The World" }
];

// State
let currentDeck = [];
let readingHistory = [];
let handCounter = 0;

// Initialize deck
function createDeck() {
    return [...majorArcana];
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
    return `${card.number}. ${card.name}`;
}

// Perform a new reading
function performReading() {
    // Create and shuffle a fresh deck
    currentDeck = shuffleDeck(createDeck());

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
