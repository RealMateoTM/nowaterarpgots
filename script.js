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

function startGame() {
    playerName = document.getElementById('player-name').value || 'Gracz';
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false); // Ukryj newsy na innych stronach
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
    toggleNewsDisplay(false); // Ukryj newsy na innych stronach
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

function updateInvestmentButtons() {
    currentJob.investments.forEach((investment, index) => {
        const button = document.getElementById(`investment-${index}`);
        if (purchasedInvestments.includes(index) || (index > 0 && !purchasedInvestments.includes(index - 1))) {
            button.disabled = true;
        } else if (earnings >= investment.cost) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

function buyInvestment(index) {
    const investment = currentJob.investments[index];
    if (earnings >= investment.cost) {
        earnings -= investment.cost;
        passiveIncome += investment.income;
        purchasedInvestments.push(index);
        updateEarningsDisplay();
        updateInvestmentButtons();
    } else {
        alert("Nie masz wystarczających środków na tę inwestycję!");
    }
}

function startPassiveIncome() {
    if (passiveIncomeInterval) clearInterval(passiveIncomeInterval);

    passiveIncomeInterval = setInterval(() => {
        earnings += passiveIncome;
        updateEarningsDisplay();
        updateInvestmentButtons();
    }, 1000);
}

function setTheme(theme) {
    document.body.className = '';
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else if (theme === 'colorful') {
        document.body.classList.add('theme-colorful');
    }
}

// Wywołaj funkcję toggleNewsDisplay(true) tylko na stronie głównej
toggleNewsDisplay(true);
