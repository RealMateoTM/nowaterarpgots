// Obiekt do przechowywania zarobków i inwestycji dla każdego zawodu
const jobEarnings = {};

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
}

// Funkcja ładowania stanu gry
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);

        // Przywróć zapisane dane
        playerName = gameState.playerName || 'Gracz';
        currentJob = gameState.currentJob ? jobs[gameState.currentJob] : null;
        earnings = gameState.earnings || 0;
        passiveIncome = gameState.passiveIncome || 0;
        purchasedInvestments = gameState.purchasedInvestments || [];
        Object.assign(jobEarnings, gameState.jobEarnings);

        // Zaktualizuj interfejs
        if (currentJob) {
            chooseJob(currentJob.name.toLowerCase());
        }
    }
}

// Zapis stanu gry przed opuszczeniem strony
window.addEventListener('beforeunload', saveGameState);

// Wywołaj ładowanie stanu gry po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    toggleNewsDisplay(true); // Wyświetl newsy na stronie głównej
});
