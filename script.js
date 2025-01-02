const jobs = {
    kierowca: {
        name: "Kierowca",
        image: "kierowca.png",
        baseIncome: 1,
        investments: [
            { name: "Dostawczak", cost: 50, income: 5 },
            { name: "Dostwaczak MAX", cost: 150, income: 15 },
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

// Funkcje zapisu i odczytu danych
function saveGameData() {
    const data = {
        playerName,
        currentJob: currentJob ? currentJob.name : null,
        earnings,
        passiveIncome,
        purchasedInvestments
    };
    localStorage.setItem('gameData', JSON.stringify(data));
    console.log("Dane zapisane w Local Storage:", data);
}

function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        console.log("Wczytano dane z Local Storage:", data);

        playerName = data.playerName || '';
        currentJob = jobs[data.currentJob] || null;
        earnings = data.earnings || 0;
        passiveIncome = data.passiveIncome || 0;
        purchasedInvestments = data.purchasedInvestments || [];

        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase());
            updateInvestmentButtons();
        } else {
            toggleNewsDisplay(true);
        }
        updateEarningsDisplay();
    }
}

// Funkcje gry
function startGame() {
    playerName = document.getElementById('player-name').value || 'Gracz';
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false);
    saveGameData();
}

function chooseJob(job) {
    currentJob = jobs[job];
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('job-title').innerText = `Zawód: ${currentJob.name}`;

    const jobImagePath = `images/${currentJob.image}`;
    document.getElementById('job-image').src = jobImagePath;
    document.getElementById('job-image').alt = `Obraz zawodu: ${currentJob.name}`;

    updateInvestmentList();
    updateEarningsDisplay();
    startPassiveIncome();
    toggleNewsDisplay(false);
    saveGameData();
}

function earnMoney() {
    earnings += currentJob.baseIncome;
    updateEarningsDisplay();
    updateInvestmentButtons();
    saveGameData();
}

function buyInvestment(index) {
    const investment = currentJob.investments[index];
    if (earnings >= investment.cost) {
        earnings -= investment.cost;
        passiveIncome += investment.income;
        purchasedInvestments.push(index);
        updateEarningsDisplay();
        updateInvestmentButtons();
        saveGameData();
    } else {
        alert("Nie masz wystarczających środków na tę inwestycję!");
    }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
});
