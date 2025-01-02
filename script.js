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

const fakePlayerNames = [
    "Mateusz", "Anna", "Krzysztof", "Ewa", "Marcin", 
    "Julia", "Tomasz", "Zofia", "Piotr", "Katarzyna"
];

const fakeJobs = Object.values(jobs).map(job => job.name);

let playerName = '';
let currentJob = null;
let earnings = 0;
let passiveIncome = 0;
let passiveIncomeInterval = null;
let purchasedInvestments = [];

// Funkcja zapisywania gry
function saveGameData() {
    const gameData = {
        playerName,
        currentJob: currentJob ? currentJob.name : null,
        earnings,
        passiveIncome,
        purchasedInvestments
    };
    document.cookie = `gameData=${JSON.stringify(gameData)}; path=/`;
}

// Funkcja ładowania gry
function loadGameData() {
    const cookies = document.cookie.split('; ').find(row => row.startsWith('gameData='));
    if (cookies) {
        const gameData = JSON.parse(cookies.split('=')[1]);
        playerName = gameData.playerName || 'Gracz';
        currentJob = jobs[gameData.currentJob] || null;
        earnings = gameData.earnings || 0;
        passiveIncome = gameData.passiveIncome || 0;
        purchasedInvestments = gameData.purchasedInvestments || [];
        return true;
    }
    return false;
}

// Generowanie rankingu
function generateFakeRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; // Wyczyszczenie listy

    const fakeRanking = Array.from({ length: 5 }, () => {
        const name = fakePlayerNames[Math.floor(Math.random() * fakePlayerNames.length)];
        const job = fakeJobs[Math.floor(Math.random() * fakeJobs.length)];
        const earnings = Math.floor(Math.random() * 2000 + 500); // Losowy dochód od 500 do 2500 NT

        return { name, job, earnings };
    });

    fakeRanking.sort((a, b) => b.earnings - a.earnings); // Posortowanie po zarobkach

    fakeRanking.forEach(player => {
        const listItem = document.createElement('li');
        listItem.innerText = `${player.name} - ${player.job} = ${player.earnings} NT`;
        rankingList.appendChild(listItem);
    });
}

// Funkcje gry (np. startGame, chooseJob, earnMoney, itp.)
// [Dodaj pozostałe funkcje tutaj, poprawione z poprzedniej wersji]

// Po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    if (loadGameData()) {
        goToMain();
    } else {
        toggleNewsDisplay(true);
    }

    generateFakeRanking(); // Pierwsze generowanie rankingu
    setInterval(() => generateFakeRanking(), 120000); // Aktualizacja rankingu co 2 minuty
});
