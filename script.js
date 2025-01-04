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
    },
    zolnierz: {
        name: "Żołnierz",
        image: "zolnierz.png",
        baseIncome: 1,
        investments: [
            { name: "Pojazd opancerzony", cost: 100, income: 20 },
            { name: "Zaawansowany sprzęt wojskowy", cost: 300, income: 35 },
            { name: "Baza wojskowa", cost: 1500, income: 200 }
        ]
    },
    policjant: {
        name: "Policjant",
        image: "policjant.png",
        baseIncome: 1,
        investments: [
            { name: "Radiowóz patrolowy", cost: 100, income: 10 },
            { name: "Monitoring miejski", cost: 200, income: 25 },
            { name: "Akademia policyjna", cost: 570, income: 100 }
        ]
    },
    strazak: {
        name: "Strażak",
        image: "strazak.png",
        baseIncome: 1,
        investments: [
            { name: "Nowoczesny wóz strażacki", cost: 50, income: 15 },
            { name: "Zaawansowane systemy gaśnicze", cost: 150, income: 30 },
            { name: "Centrum szkoleniowe dla strażaków", cost: 1000, income: 100 }
        ]
    },
    lekarz: {
        name: "Lekarz",
        image: "lekarz.png",
        baseIncome: 1,
        investments: [
            {name: "Przychodnia publiczna", cost: 50, income: 20},
            {name: "Prywatny gabinet", cost: 150, income: 50},
            {name: "Specjalizacja I",cost: 400, income: 230}
        ]
    }
};

let playerName = '';
let currentJob = null;
let earnings = 0;
let passiveIncome = 0;
let passiveIncomeInterval = null;
let purchasedInvestments = [];

// Funkcja zapisu postępu
function saveProgress() {
    const progress = {
        playerName: playerName,
        currentJob: currentJob ? currentJob.name : null,
        earnings: earnings,
        passiveIncome: passiveIncome,
        purchasedInvestments: purchasedInvestments
    };
    document.cookie = `gameProgress=${JSON.stringify(progress)}; path=/; max-age=31536000`;
}

// Funkcja wczytywania postępu
function loadProgress() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const progressCookie = cookies.find(cookie => cookie.startsWith('gameProgress='));
    if (progressCookie) {
        const progress = JSON.parse(progressCookie.split('=')[1]);
        playerName = progress.playerName || 'Gracz';
        currentJob = jobs[progress.currentJob] || null;
        earnings = progress.earnings || 0;
        passiveIncome = progress.passiveIncome || 0;
        purchasedInvestments = progress.purchasedInvestments || [];
        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase());
            purchasedInvestments.forEach(index => {
                const investment = currentJob.investments[index];
                passiveIncome += investment.income;
            });
        }
        updateEarningsDisplay();
        updateInvestmentButtons();
    }
    // Pokazuj newsy na stronie głównej po załadowaniu
    const isMainPage = !currentJob;
    toggleNewsDisplay(isMainPage);
}

function startGame() {
    const playerNameInput = document.getElementById('player-name').value.trim();

    if (!playerNameInput) {
        alert('Proszę podać nazwę gracza, aby kontynuować!');
        return; // Zatrzymuje przejście do następnej strony
    }

    playerName = playerNameInput;
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
        console.log(`News section is now ${show ? 'visible' : 'hidden'}`);
    }
}


function earnMoney() {
    earnings += currentJob.baseIncome;
    updateEarningsDisplay();
    updateInvestmentButtons();
    saveProgress(); // Zapisz postęp
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
        saveProgress(); // Zapisz postęp
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
    updateInvestmentButtons();
}

function setTheme(theme) {
    document.body.className = '';
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else if (theme === 'colorful') {
        document.body.classList.add('theme-colorful');
    }
}

function goToJobs() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false); // Ukryj newsy w sekcji zawodów
}

function goToMain() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.start-container').style.display = 'block';
    toggleNewsDisplay(true); // Pokaż newsy na stronie głównej
}

// Wywołanie loadProgress po załadowaniu strony
window.onload = () => {
    loadProgress();
    const isMainPage = !currentJob; // Jeśli brak aktualnego zawodu, to jesteśmy na stronie głównej
    toggleNewsDisplay(isMainPage);
};