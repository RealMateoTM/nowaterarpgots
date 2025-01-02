const jobs = {
    kierowca: {
        name: "Kierowca",
        image: "kierowca.png",
        baseIncome: 1,
        investments: [
            { name: "Dostawczak", cost: 50, income: 5 },
            { name: "Dostawczak MAX", cost: 150, income: 15 },
            { name: "Solówka", cost: 500, income: 50 },
            { name: "Ciągnik z naczepą", cost: 1500, income: 150 }
        ]
    },
    rolnik: {
        name: "Rolnik",
        image: "rolnik.png",
        baseIncome: 1,
        investments: [
            { name: "Pole", cost: 40, income: 4 },
            { name: "Narzędzia do ręcznej obróbki pola", cost: 120, income: 20 },
            { name: "Traktor", cost: 400, income: 100 },
            { name: "Kombajn", cost: 1500, income: 200 }
        ]
    },
    wlasciciel: {
        name: "Właściciel nieruchomości",
        image: "wlasciciel.png",
        baseIncome: 1,
        investments: [
            { name: "Mały sklep", cost: 100, income: 10 },
            { name: "Galeria handlowa", cost: 300, income: 30 },
            { name: "Wieżowiec", cost: 1000, income: 100 }
        ]
    }
};

let playerName = '';
let currentJob = null;
let earnings = 0;
let passiveIncome = 0;
let passiveIncomeInterval = null;
let purchasedInvestments = [];

// Obiekt do przechowywania zarobków i inwestycji dla każdego zawodu
const jobEarnings = {};

// Funkcja zapisu stanu gry
function saveGameState() {
    const gameState = {
        playerName,
        currentJob: currentJob ? currentJob.name : null,
        earnings,
        passiveIncome,
        purchasedInvestments,
        jobEarnings
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log("Stan gry zapisany:", gameState); // Diagnostyka
}

// Funkcja ładowania stanu gry
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);

        console.log("Stan gry wczytany:", gameState); // Diagnostyka

        // Przywróć zapisane dane
        playerName = gameState.playerName || 'Gracz';
        currentJob = gameState.currentJob ? jobs[gameState.currentJob.toLowerCase()] : null;
        earnings = gameState.earnings || 0;
        passiveIncome = gameState.passiveIncome || 0;
        purchasedInvestments = gameState.purchasedInvestments || [];
        Object.assign(jobEarnings, gameState.jobEarnings);

        // Przywróć interfejs i logikę
        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase());
        }
    } else {
        console.log("Brak zapisanego stanu gry."); // Diagnostyka
    }
}

// Funkcja inicjalizacji gry
function startGame() {
    const nameInput = document.getElementById('player-name');
    playerName = nameInput ? nameInput.value || 'Gracz' : playerName;
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false); // Ukryj newsy na innych stronach
    saveGameState(); // Zapis po rozpoczęciu gry
}

// Zapis stanu gry przed opuszczeniem strony
window.addEventListener('beforeunload', saveGameState);

// Wywołaj ładowanie stanu gry po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    toggleNewsDisplay(true); // Wyświetl newsy na stronie głównej
});
