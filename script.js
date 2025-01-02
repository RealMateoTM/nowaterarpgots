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
    document.getElementById('job-image').src = `images/${currentJob.image}`;
    updateInvestmentList();
    updateEarningsDisplay();
    startPassiveIncome();
    saveGameData();
}

function toggleNewsDisplay(show) {
    const newsSection = document.getElementById('news-section');
    if (newsSection) {
        newsSection.style.display = show ? 'block' : 'none';
    }
}

function earnMoney() {
    earnings += currentJob.baseIncome;
    updateEarningsDisplay();
    updateInvestmentButtons();
    saveGameData();
}

function updateEarningsDisplay() {
    document.getElementById('earnings').innerText = earnings;
}

function updateInvestmentList() {
    const investmentsList = document.getElementById('investments-list');
    investmentsList.innerHTML = '';

    currentJob.investments.forEach((investment, index) => {
        const investmentItem = document.createElement('div');
        investmentItem.className = 'investment-item';
        investmentItem.innerHTML = `
            <span>${investment.name} (Koszt: ${investment.cost} NT, Dochód: ${investment.income} NT/s)</span>
            <button class="button" id="investment-${index}" onclick="buyInvestment(${index})" disabled>Kup</button>
        `;
        investmentsList.appendChild(investmentItem);
    });

    updateInvestmentButtons();
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

function updateInvestmentButtons() {
    currentJob.investments.forEach((investment, index) => {
        const button = document.getElementById(`investment-${index}`);
        button.disabled = earnings < investment.cost || purchasedInvestments.includes(index);
    });
}

function startPassiveIncome() {
    if (passiveIncomeInterval) clearInterval(passiveIncomeInterval);
    passiveIncomeInterval = setInterval(() => {
        earnings += passiveIncome;
        updateEarningsDisplay();
        saveGameData();
    }, 1000);
}

function goToJobs() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false);
    saveGameData();
}

function goToMain() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.start-container').style.display = 'block';
    toggleNewsDisplay(true);
}

document.addEventListener("DOMContentLoaded", () => {
    if (loadGameData()) {
        goToMain();
    } else {
        toggleNewsDisplay(true);
    }
});
