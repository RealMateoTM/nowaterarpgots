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

// Funkcje cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

// Zapisywanie i wczytywanie gry
function saveGameData() {
    const data = {
        playerName,
        currentJob: currentJob ? currentJob.name : null,
        earnings,
        passiveIncome,
        purchasedInvestments
    };
    setCookie('gameData', JSON.stringify(data), 7); // Cookie ważne przez 7 dni
    console.log("Dane zapisane w cookies:", data);
}

function loadGameData() {
    const savedData = getCookie('gameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        console.log("Wczytano dane z cookies:", data);

        playerName = data.playerName || '';
        currentJob = jobs[data.currentJob] || null;
        earnings = data.earnings || 0;
        passiveIncome = data.passiveIncome || 0;
        purchasedInvestments = data.purchasedInvestments || [];

        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase(), true);
        } else {
            goToMain();
        }
        updateEarningsDisplay();
    }
}

// Reszta funkcji gry pozostaje bez zmian
function startGame() {
    playerName = document.getElementById('player-name').value || 'Gracz';
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    saveGameData();
}

function chooseJob(job, fromLoad = false) {
    currentJob = jobs[job];
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('job-title').innerText = `Zawód: ${currentJob.name}`;

    const jobImagePath = `images/${currentJob.image}`;
    document.getElementById('job-image').src = jobImagePath;
    document.getElementById('job-image').alt = `Obraz zawodu: ${currentJob.name}`;

    if (!fromLoad) {
        earnings = 0;
        passiveIncome = 0;
        purchasedInvestments = [];
    }

    updateInvestmentList();
    updateEarningsDisplay();
    startPassiveIncome();
    saveGameData();
}

function earnMoney() {
    earnings += currentJob.baseIncome;
    updateEarningsDisplay();
    saveGameData();
}

function buyInvestment(index) {
    const investment = currentJob.investments[index];
    if (earnings >= investment.cost) {
        earnings -= investment.cost;
        passiveIncome += investment.income;
        purchasedInvestments.push(index);
        updateEarningsDisplay();
        saveGameData();
    } else {
        alert("Nie masz wystarczających środków na tę inwestycję!");
    }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
});
