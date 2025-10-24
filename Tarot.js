// Major Arcana cards (0-21) with meanings
const majorArcana = [
    { number: 0, name: "The Fool", type: "major",
      upright: "New beginnings, innocence, spontaneity, free spirit, adventure",
      reversed: "Recklessness, taking foolish risks, naivety, poor judgment" },
    { number: 1, name: "The Magician", type: "major",
      upright: "Manifestation, resourcefulness, power, inspired action, skill",
      reversed: "Manipulation, poor planning, untapped talents, trickery" },
    { number: 2, name: "The High Priestess", type: "major",
      upright: "Intuition, sacred knowledge, divine feminine, subconscious mind",
      reversed: "Secrets, disconnected from intuition, withdrawal, silence" },
    { number: 3, name: "The Empress", type: "major",
      upright: "Femininity, beauty, nature, nurturing, abundance, creativity",
      reversed: "Creative block, dependence on others, emptiness, lack of growth" },
    { number: 4, name: "The Emperor", type: "major",
      upright: "Authority, establishment, structure, father figure, control",
      reversed: "Domination, excessive control, lack of discipline, rigidity" },
    { number: 5, name: "The Hierophant", type: "major",
      upright: "Spiritual wisdom, religious beliefs, conformity, tradition, institutions",
      reversed: "Personal beliefs, freedom, challenging the status quo, rebellion" },
    { number: 6, name: "The Lovers", type: "major",
      upright: "Love, harmony, relationships, values alignment, choices",
      reversed: "Self-love, disharmony, imbalance, misalignment of values" },
    { number: 7, name: "The Chariot", type: "major",
      upright: "Control, willpower, success, action, determination, victory",
      reversed: "Self-discipline, opposition, lack of direction, aggression" },
    { number: 8, name: "Strength", type: "major",
      upright: "Strength, courage, persuasion, influence, compassion, inner power",
      reversed: "Inner strength, self-doubt, low energy, raw emotion, insecurity" },
    { number: 9, name: "The Hermit", type: "major",
      upright: "Soul searching, introspection, inner guidance, solitude, wisdom",
      reversed: "Isolation, loneliness, withdrawal, lost your way, recluse" },
    { number: 10, name: "Wheel of Fortune", type: "major",
      upright: "Good luck, karma, life cycles, destiny, turning point, change",
      reversed: "Bad luck, resistance to change, breaking cycles, external forces" },
    { number: 11, name: "Justice", type: "major",
      upright: "Justice, fairness, truth, cause and effect, law, accountability",
      reversed: "Unfairness, lack of accountability, dishonesty, injustice" },
    { number: 12, name: "The Hanged Man", type: "major",
      upright: "Pause, surrender, letting go, new perspectives, sacrifice",
      reversed: "Delays, resistance, stalling, indecision, stagnation" },
    { number: 13, name: "Death", type: "major",
      upright: "Endings, change, transformation, transition, new beginnings",
      reversed: "Resistance to change, personal transformation, inner purging" },
    { number: 14, name: "Temperance", type: "major",
      upright: "Balance, moderation, patience, purpose, meaning, harmony",
      reversed: "Imbalance, excess, self-healing, re-alignment, rushed" },
    { number: 15, name: "The Devil", type: "major",
      upright: "Shadow self, attachment, addiction, restriction, sexuality, materialism",
      reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment" },
    { number: 16, name: "The Tower", type: "major",
      upright: "Sudden change, upheaval, chaos, revelation, awakening, disruption",
      reversed: "Personal transformation, fear of change, averting disaster" },
    { number: 17, name: "The Star", type: "major",
      upright: "Hope, faith, purpose, renewal, spirituality, inspiration",
      reversed: "Lack of faith, despair, self-trust, disconnection, pessimism" },
    { number: 18, name: "The Moon", type: "major",
      upright: "Illusion, fear, anxiety, subconscious, intuition, dreams",
      reversed: "Release of fear, repressed emotion, inner confusion, clarity" },
    { number: 19, name: "The Sun", type: "major",
      upright: "Positivity, fun, warmth, success, vitality, joy, confidence",
      reversed: "Inner child, feeling down, overly optimistic, unrealistic" },
    { number: 20, name: "Judgement", type: "major",
      upright: "Judgement, rebirth, inner calling, absolution, reflection",
      reversed: "Self-doubt, inner critic, ignoring the call, self-loathing" },
    { number: 21, name: "The World", type: "major",
      upright: "Completion, integration, accomplishment, travel, fulfillment",
      reversed: "Seeking personal closure, short-cuts, delays, incompletion" }
];

// Minor Arcana meanings
const minorMeanings = {
    "Wands": {
        "Ace": { upright: "Inspiration, new opportunities, growth, potential", reversed: "Emerging idea, lack of direction, delays, distractions" },
        "Two": { upright: "Future planning, progress, decisions, discovery", reversed: "Personal goals, inner alignment, fear of unknown, lack of planning" },
        "Three": { upright: "Progress, expansion, foresight, overseas opportunities", reversed: "Playing small, lack of foresight, delays, unexpected obstacles" },
        "Four": { upright: "Celebration, harmony, marriage, home, community", reversed: "Personal celebration, inner harmony, conflict with others, transition" },
        "Five": { upright: "Disagreement, competition, tension, diversity", reversed: "Inner conflict, conflict avoidance, releasing tension" },
        "Six": { upright: "Success, public recognition, progress, self-confidence", reversed: "Private achievement, personal definition of success, fall from grace" },
        "Seven": { upright: "Challenge, competition, protection, perseverance", reversed: "Exhaustion, giving up, overwhelmed" },
        "Eight": { upright: "Movement, fast paced change, action, alignment", reversed: "Delays, frustration, resisting change, internal alignment" },
        "Nine": { upright: "Resilience, courage, persistence, test of faith", reversed: "Inner resources, struggle, overwhelm, defensive, paranoia" },
        "Ten": { upright: "Burden, extra responsibility, hard work, completion", reversed: "Inability to delegate, overstressed, burnt out" },
        "Page": { upright: "Inspiration, ideas, discovery, limitless potential, free spirit", reversed: "Newly-formed ideas, redirecting energy, self-limiting beliefs" },
        "Knight": { upright: "Energy, passion, inspired action, adventure, impulsiveness", reversed: "Passion project, haste, scattered energy, delays, frustration" },
        "Queen": { upright: "Courage, confidence, independence, social butterfly, determination", reversed: "Self-respect, unforgiving, demanding, aggressive" },
        "King": { upright: "Natural-born leader, vision, entrepreneur, honour", reversed: "Impulsiveness, haste, ruthless, high expectations" }
    },
    "Cups": {
        "Ace": { upright: "Love, new relationships, compassion, creativity", reversed: "Self-love, intuition, repressed emotions" },
        "Two": { upright: "Unified love, partnership, mutual attraction", reversed: "Self-love, break-ups, disharmony, distrust" },
        "Three": { upright: "Celebration, friendship, creativity, collaborations", reversed: "Independence, alone time, hardcore partying, 'three's a crowd'" },
        "Four": { upright: "Meditation, contemplation, apathy, reevaluation", reversed: "Retreat, withdrawal, checking in for alignment" },
        "Five": { upright: "Regret, failure, disappointment, pessimism", reversed: "Personal setbacks, self-forgiveness, moving on" },
        "Six": { upright: "Revisiting the past, childhood memories, innocence, joy", reversed: "Living in the past, forgiveness, lacking playfulness" },
        "Seven": { upright: "Opportunities, choices, wishful thinking, illusion", reversed: "Alignment, personal values, overwhelmed by choices" },
        "Eight": { upright: "Disappointment, abandonment, withdrawal, escapism", reversed: "Trying one more time, indecision, aimless drifting" },
        "Nine": { upright: "Contentment, satisfaction, gratitude, wish come true", reversed: "Inner happiness, materialism, dissatisfaction, indulgence" },
        "Ten": { upright: "Divine love, blissful relationships, harmony, alignment", reversed: "Disconnection, misaligned values, struggling relationships" },
        "Page": { upright: "Creative opportunities, intuitive messages, curiosity, possibility", reversed: "New ideas, doubting intuition, creative blocks, emotional immaturity" },
        "Knight": { upright: "Creativity, romance, charm, imagination, beauty", reversed: "Overactive imagination, unrealistic, jealous, moody" },
        "Queen": { upright: "Compassion, warmth, kindness, intuition, healer", reversed: "Inner feelings, self-care, self-love, co-dependency" },
        "King": { upright: "Emotionally balanced, compassion, diplomatic", reversed: "Self-compassion, inner feelings, moodiness, emotionally manipulative" }
    },
    "Swords": {
        "Ace": { upright: "Breakthrough, clarity, sharp mind, new ideas, mental clarity", reversed: "Inner clarity, re-thinking an idea, clouded judgement" },
        "Two": { upright: "Difficult decisions, weighing options, stalemate, avoidance", reversed: "Indecision, confusion, information overload, sticking to a decision" },
        "Three": { upright: "Heartbreak, emotional pain, sorrow, grief, hurt", reversed: "Negative self-talk, releasing pain, optimism, forgiveness" },
        "Four": { upright: "Rest, relaxation, meditation, contemplation, recuperation", reversed: "Exhaustion, burn-out, deep contemplation, stagnation" },
        "Five": { upright: "Conflict, disagreements, competition, defeat, winning at all costs", reversed: "Reconciliation, making amends, past resentment" },
        "Six": { upright: "Transition, change, rite of passage, releasing baggage", reversed: "Personal transition, resistance to change, unfinished business" },
        "Seven": { upright: "Betrayal, deception, getting away with something, stealth", reversed: "Imposter syndrome, self-deceit, keeping secrets" },
        "Eight": { upright: "Negative thoughts, self-imposed restriction, imprisonment, victim", reversed: "Self-limiting beliefs, inner critic, releasing negative thoughts" },
        "Nine": { upright: "Anxiety, worry, fear, depression, nightmares", reversed: "Inner turmoil, deep-seated fears, secrets, releasing worry" },
        "Ten": { upright: "Painful endings, deep wounds, betrayal, loss, crisis", reversed: "Recovery, regeneration, resisting an inevitable end" },
        "Page": { upright: "New ideas, curiosity, thirst for knowledge, new ways of communicating", reversed: "Self-expression, all talk and no action, haphazard action" },
        "Knight": { upright: "Ambitious, action-oriented, driven to succeed, fast-thinking", reversed: "Restless, unfocused, impulsive, burn-out" },
        "Queen": { upright: "Independent, unbiased judgement, clear boundaries, direct communication", reversed: "Overly-emotional, easily influenced, bitchy, cold-hearted" },
        "King": { upright: "Mental clarity, intellectual power, authority, truth", reversed: "Quiet power, inner truth, misuse of power, manipulation" }
    },
    "Pentacles": {
        "Ace": { upright: "New financial opportunity, prosperity, new job, manifestation", reversed: "Lost opportunity, lack of planning and foresight" },
        "Two": { upright: "Multiple priorities, time management, prioritisation, adaptability", reversed: "Over-committed, disorganisation, reprioritisation" },
        "Three": { upright: "Teamwork, collaboration, learning, implementation", reversed: "Disharmony, misalignment, working alone" },
        "Four": { upright: "Saving money, security, conservatism, scarcity, control", reversed: "Over-spending, greed, self-worth, financial insecurity" },
        "Five": { upright: "Financial loss, poverty, lack mindset, isolation, worry", reversed: "Recovery from financial loss, spiritual poverty" },
        "Six": { upright: "Giving, receiving, sharing wealth, generosity, charity", reversed: "Self-care, unpaid debts, one-sided charity" },
        "Seven": { upright: "Long-term view, sustainable results, perseverance, investment", reversed: "Lack of long-term vision, limited success, patience required" },
        "Eight": { upright: "Apprenticeship, repetitive tasks, mastery, skill development", reversed: "Self-development, perfectionism, misdirected activity" },
        "Nine": { upright: "Abundance, luxury, self-sufficiency, financial independence", reversed: "Self-worth, over-investment in work, hustling" },
        "Ten": { upright: "Wealth, financial security, family, long-term success, contribution", reversed: "The dark side of wealth, financial failure, loneliness" },
        "Page": { upright: "Manifestation, financial opportunity, skill development", reversed: "Lack of progress, procrastination, learn from failure" },
        "Knight": { upright: "Hard work, productivity, routine, conservatism, perfectionism", reversed: "Self-discipline, boredom, feeling 'stuck', perfectionism" },
        "Queen": { upright: "Nurturing, practical, providing financially, a working parent", reversed: "Financial independence, self-care, work-home conflict" },
        "King": { upright: "Wealth, business, leadership, security, discipline, abundance", reversed: "Financially inept, obsessed with wealth, stubborn, greed" }
    }
};

// Minor Arcana cards
const minorArcana = [];
const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

// Generate Minor Arcana with meanings
suits.forEach(suit => {
    ranks.forEach(rank => {
        minorArcana.push({
            suit: suit,
            rank: rank,
            name: `${rank} of ${suit}`,
            type: "minor",
            upright: minorMeanings[suit][rank].upright,
            reversed: minorMeanings[suit][rank].reversed
        });
    });
});

// State
let currentDeck = [];
let readingHistory = [];
let handCounter = 0;
let currentCards = {
    past: null,
    present: null,
    future: null
};

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
    const card = currentDeck.pop();
    // 50% chance of card being reversed if option is enabled
    const includeReversed = document.getElementById('includeReversed').checked;
    card.isReversed = includeReversed && Math.random() < 0.5;
    return card;
}

// Get image path for a card
function getCardImagePath(card) {
    if (card.type === 'major') {
        // Major Arcana: e.g., "00-TheFool.png"
        const number = String(card.number).padStart(2, '0');
        const name = card.name.replace(/\s+/g, ''); // Remove spaces
        return `img/Tarot/${number}-${name}.png`;
    } else {
        // Minor Arcana: e.g., "Wands01.png", "Cups11.png"
        const rankNumbers = {
            "Ace": "01", "Two": "02", "Three": "03", "Four": "04",
            "Five": "05", "Six": "06", "Seven": "07", "Eight": "08",
            "Nine": "09", "Ten": "10", "Page": "11", "Knight": "12",
            "Queen": "13", "King": "14"
        };
        const number = rankNumbers[card.rank];
        return `img/Tarot/${card.suit}${number}.png`;
    }
}

// Format card for display
function formatCard(card) {
    let cardName;
    if (card.type === 'major') {
        cardName = `${card.number}. ${card.name}`;
    } else {
        cardName = card.name;
    }

    if (card.isReversed) {
        return `${cardName} (Reversed)`;
    }
    return cardName;
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

    // Store current cards
    currentCards.past = pastCard;
    currentCards.present = presentCard;
    currentCards.future = futureCard;

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
        element.innerHTML = '';

        // Create image element
        const img = document.createElement('img');
        img.src = getCardImagePath(card);
        img.alt = formatCard(card);
        img.className = 'card-image';
        if (card.isReversed) {
            img.classList.add('reversed');
        }

        // Create text element for card name
        const text = document.createElement('div');
        text.className = 'card-name';
        text.textContent = formatCard(card);

        element.appendChild(img);
        element.appendChild(text);
    } else {
        element.textContent = '--';
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

// Modal functions
function openCardModal(card, position) {
    if (!card) return;

    const modal = document.getElementById('cardModal');
    const cardImage = document.getElementById('modalCardImage');
    const cardName = document.getElementById('modalCardName');
    const cardOrientation = document.getElementById('modalCardOrientation');
    const cardMeaning = document.getElementById('modalCardMeaning');

    // Set card image
    cardImage.src = getCardImagePath(card);
    cardImage.alt = formatCard(card);
    if (card.isReversed) {
        cardImage.classList.add('reversed');
    } else {
        cardImage.classList.remove('reversed');
    }

    // Set card name
    let name = card.type === 'major' ? `${card.number}. ${card.name}` : card.name;
    cardName.textContent = name;

    // Set orientation and meaning
    if (card.isReversed) {
        cardOrientation.textContent = 'Reversed';
        cardMeaning.textContent = card.reversed;
    } else {
        cardOrientation.textContent = 'Upright';
        cardMeaning.textContent = card.upright;
    }

    // Show modal
    modal.classList.add('active');
}

function closeCardModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
}

// Event listeners
document.getElementById('newReadingButton').addEventListener('click', performReading);

// Card click handlers
document.getElementById('pastCard').addEventListener('click', function() {
    openCardModal(currentCards.past, 'past');
});

document.getElementById('presentCard').addEventListener('click', function() {
    openCardModal(currentCards.present, 'present');
});

document.getElementById('futureCard').addEventListener('click', function() {
    openCardModal(currentCards.future, 'future');
});

// Modal close handlers
document.getElementById('modalClose').addEventListener('click', closeCardModal);

document.getElementById('cardModal').addEventListener('click', function(event) {
    // Close modal if clicking outside the modal content
    if (event.target === this) {
        closeCardModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCardModal();
    }
});
