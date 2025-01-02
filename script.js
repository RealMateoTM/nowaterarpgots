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
            chooseJob(currentJob.name.toLowerCase(), true);
        } else {
            showSection('start-container');
        }
        updateEarningsDisplay();
    }
}

// Funkcje zarządzające widocznością
function showSection(sectionClass) {
    document.querySelectorAll('.start-container, .job-container, .game-container').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector(`.${sectionClass}`).style.display = 'block';
}

// Funkcje gry
function startGame() {
    playerName = document.getElementById('player-name').value || 'Gracz';
    showSection('job-container');
    saveGameData();
}

function chooseJob(job, fromLoad = false) {
    currentJob = jobs[job];
    showSection('game-container');

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

function updateEarningsDisplay() {
    document.getElementById('earnings').innerText = earnings;
}

function updateInvestmentList() {
    const investmentsList = document.getElementById('investments-list');
    investmentsList.innerHTML = '';

    currentJob.investments.forEach((investment, index) => {
        const isPurchased = purchasedInvestments.includes(index);
        const buttonDisabled = isPurchased || earnings < investment.cost;

        const investmentItem = document.createElement('div');
        investmentItem.className = 'investment-item';
        investmentItem.innerHTML = `
            <span>${investment.name} (Koszt: ${investment.cost} NT, Dochód: ${investment.income} NT/s)</span>
            <button class="button" onclick="buyInvestment(${index})" ${buttonDisabled ? 'disabled' : ''}>Kup</button>
        `;
        investmentsList.appendChild(investmentItem);
    });
}

function startPassiveIncome() {
    clearInterval(passiveIncomeInterval);
    passiveIncomeInterval = setInterval(() => {
        earnings += passiveIncome;
        updateEarningsDisplay();
    }, 1000);
}

function goToJobs() {
    showSection('job-container');
    saveGameData();
}

function goToMain() {
    showSection('start-container');
    saveGameData();
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
});
