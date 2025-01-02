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
const jobEarnings = {}; // Przechowywanie zarobków dla każdego zawodu

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
    console.log("Stan gry zapisany:", gameState);
}

// Funkcja ładowania stanu gry
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        console.log("Stan gry wczytany:", gameState);

        playerName = gameState.playerName || 'Gracz';
        currentJob = gameState.currentJob ? jobs[gameState.currentJob.toLowerCase()] : null;
        earnings = gameState.earnings || 0;
        passiveIncome = gameState.passiveIncome || 0;
        purchasedInvestments = gameState.purchasedInvestments || [];
        Object.assign(jobEarnings, gameState.jobEarnings);

        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase(), true);
        }
    } else {
        console.log("Brak zapisanego stanu gry.");
    }
}

// Funkcja wyboru zawodu
function chooseJob(jobKey, isLoading = false) {
    if (!jobs[jobKey]) {
        console.error("Wybrano nieprawidłowy zawód:", jobKey);
        return;
    }

    if (!isLoading) saveGameState();

    currentJob = jobs[jobKey];
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    document.getElementById('job-title').innerText = currentJob.name;
    document.getElementById('job-image').src = currentJob.image;
    document.getElementById('job-image').alt = `Obraz zawodu: ${currentJob.name}`;

    updateEarningsDisplay();
    updateInvestmentList();
    startPassiveIncome();
}

// Funkcja aktualizacji zarobków
function updateEarningsDisplay() {
    document.getElementById('earnings').innerText = earnings;
}

// Funkcja aktualizacji listy inwestycji
function updateInvestmentList() {
    const investmentsList = document.getElementById('investments-list');
    investmentsList.innerHTML = '';

    currentJob.investments.forEach((investment, index) => {
        const investmentItem = document.createElement('div');
        investmentItem.className = 'investment-item';
        investmentItem.innerHTML = `
            <span>${investment.name} (Koszt: ${investment.cost} NT, Dochód: ${investment.income} NT/s)</span>
            <button class="button" onclick="buyInvestment(${index})">Kup</button>
        `;
        investmentsList.appendChild(investmentItem);
    });
}

// Funkcja kupowania inwestycji
function buyInvestment(index) {
    const investment = currentJob.investments[index];
    if (earnings >= investment.cost) {
        earnings -= investment.cost;
        passiveIncome += investment.income;
        purchasedInvestments.push(index);
        updateEarningsDisplay();
    } else {
        alert("Nie masz wystarczających środków na tę inwestycję!");
    }
}

// Funkcja zarabiania pieniędzy
function earnMoney() {
    earnings += currentJob.baseIncome;
    updateEarningsDisplay();
}

// Funkcja pasywnych zarobków
function startPassiveIncome() {
    if (passiveIncomeInterval) clearInterval(passiveIncomeInterval);

    passiveIncomeInterval = setInterval(() => {
        earnings += passiveIncome;
        updateEarningsDisplay();
    }, 1000);
}

// Funkcja rozpoczęcia gry
function startGame() {
    playerName = document.getElementById('player-name').value || 'Gracz';
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
}

// Zapis stanu gry przed zamknięciem strony
window.addEventListener('beforeunload', saveGameState);

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
});
