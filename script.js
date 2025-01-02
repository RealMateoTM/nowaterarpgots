// Wyświetlanie i ukrywanie newsów
function toggleNewsDisplay(show) {
    const newsSection = document.getElementById('news-section');
    if (newsSection) {
        newsSection.style.display = show ? 'block' : 'none';
    }
}

// Aktualizacja przycisków inwestycji
function updateInvestmentButtons() {
    if (!currentJob) return;
    currentJob.investments.forEach((investment, index) => {
        const button = document.getElementById(`investment-${index}`);
        if (button) {
            if (
                purchasedInvestments.includes(index) || 
                (index > 0 && !purchasedInvestments.includes(index - 1))
            ) {
                button.disabled = true;
            } else if (earnings >= investment.cost) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        }
    });
}

// Start gry
function startGame() {
    const playerNameInput = document.getElementById('player-name');
    if (!playerNameInput) {
        console.error("Brak pola wprowadzenia nazwy gracza (player-name).");
        return;
    }

    playerName = playerNameInput.value || 'Gracz';
    document.querySelector('.start-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false); // Ukryj newsy na stronie wyboru zawodów
}

// Powrót na stronę wyboru zawodów
function goToJobs() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'block';
    toggleNewsDisplay(false); // Ukryj newsy
}

// Powrót na stronę główną
function goToMain() {
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.job-container').style.display = 'none';
    document.querySelector('.start-container').style.display = 'block';
    toggleNewsDisplay(true); // Pokaż newsy na stronie głównej
}

// Inicjalizacja gry po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    toggleNewsDisplay(true); // Pokaż newsy tylko na stronie głównej
});

// Debugowanie widoczności sekcji
function debugVisibility() {
    console.log("Widoczność sekcji:");
    console.log("start-container:", document.querySelector('.start-container').style.display);
    console.log("job-container:", document.querySelector('.job-container').style.display);
    console.log("game-container:", document.querySelector('.game-container').style.display);
    console.log("news-section:", document.getElementById('news-section')?.style.display);
}
