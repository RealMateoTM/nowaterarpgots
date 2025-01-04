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
            { name: "Przychodnia publiczna", cost: 50, income: 20 },
            { name: "Prywatny gabinet", cost: 150, income: 50 },
            { name: "Specjalizacja I", cost: 400, income: 230 }
        ]
    }
};

let playerName = '';
let currentJob = null;
let earnings = 0;
let passiveIncome = 0;
let passiveIncomeInterval = null;
let purchasedInvestments = [];
let earningsByJob = {}; // Dodano

function saveProgress() {
    if (currentJob) {
        earningsByJob[currentJob.name] = {
            earnings: earnings,
            purchasedInvestments: [...purchasedInvestments],
            passiveIncome: passiveIncome
        };
    }
    const progress = {
        playerName: playerName,
        currentJob: currentJob ? currentJob.name : null,
        earningsByJob: earningsByJob
    };
    document.cookie = `gameProgress=${JSON.stringify(progress)}; path=/; max-age=31536000`;
}

function loadProgress() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const progressCookie = cookies.find(cookie => cookie.startsWith('gameProgress='));
    if (progressCookie) {
        const progress = JSON.parse(progressCookie.split('=')[1]);
        playerName = progress.playerName || 'Gracz';
        currentJob = jobs[progress.currentJob] || null;
        earningsByJob = progress.earningsByJob || {};
        if (currentJob) {
            const savedData = earningsByJob[currentJob.name] || {};
            earnings = savedData.earnings || 0;
            purchasedInvestments = savedData.purchasedInvestments || [];
            passiveIncome = savedData.passiveIncome || 0;

            purchasedInvestments.forEach(index => {
                const investment = currentJob.investments[index];
                passiveIncome += investment.income;
            });
        }
        updateEarningsDisplay();
        updateInvestmentButtons();
        // Zawsze pokazuj newsy po załadowaniu postępu
    toggleNewsDisplay(true); 
    }
    const isMainPage = !currentJob;
    toggleNewsDisplay(true);
}

function chooseJob(job) {
    if (currentJob) {
        earningsByJob[currentJob.name] = {
            earnings: earnings,
            purchasedInvestments: [...purchasedInvestments],
            passiveIncome: passiveIncome
        };
    }
    currentJob = jobs[job];
    if (earningsByJob[currentJob.name]) {
        const savedData = earningsByJob[currentJob.name];
        earnings = savedData.earnings;
        purchasedInvestments = savedData.purchasedInvestments;
        passiveIncome = savedData.passiveIncome;
    } else {
        earnings = 0;
        purchasedInvestments = [];
        passiveIncome = 0;
    }
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
}
