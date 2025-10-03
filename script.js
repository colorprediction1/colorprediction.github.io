// Game Variables
let balance = 1000.00;
let timeLeft = 60;
let timer;
let currentBetAmount = 10;
let selectedBetType = null;
let selectedBetValue = null;
let currentBet = null;
let gameHistory = [];
let winHistory = [];

// Initialize Game
function initGame() {
    loadGameData();
    startTimer();
    updateDisplay();
    loadHistory();
}

// Timer Functions
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    updateTimer();
    
    timer = setInterval(function() {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 10) {
            document.getElementById('timer').style.color = '#e74c3c';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            calculateResult();
            setTimeout(startTimer, 3000);
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft + 's';
    document.getElementById('timer').style.color = timeLeft <= 10 ? '#e74c3c' : '#f1c40f';
}

// Display Functions
function updateDisplay() {
    document.getElementById('balanceAmount').textContent = balance.toFixed(2);
}

function loadHistory() {
    const historyBody = document.getElementById('historyBody');
    const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [
        { period: "20240131130", number: "4", color: "Green" },
        { period: "20240131129", number: "1", color: "Red" },
        { period: "20240131128", number: "8", color: "Violet" }
    ];
    
    gameHistory = savedHistory;
    renderHistory();
}

function renderHistory() {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';
    
    gameHistory.forEach(item => {
        const row = document.createElement('tr');
        const colorCode = item.color === 'Green' ? '#27ae60' : 
                         item.color === 'Red' ? '#e74c3c' : '#9b59b6';
        
        row.innerHTML = `
            <td>${item.period}</td>
            <td>${item.number}</td>
            <td style="color:${colorCode}; font-weight:bold">${item.color}</td>
        `;
        historyBody.appendChild(row);
    });
}

// Bet Modal Functions
function openBetModal(type) {
    if (timeLeft <= 10) {
        alert('Betting locked! Wait for next round.');
        return;
    }
    
    selectedBetType = typeof type === 'number' ? 'number' : 'color';
    selectedBetValue = type;
    currentBetAmount = 10;
    
    document.getElementById('modalTitle').textContent = 
        selectedBetType === 'color' ? Bet on ${type.toUpperCase()} : Bet on Number ${type};
    
    updateAmountDisplay();
    resetAmountButtons();
    document.getElementById('betModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('betModal').style.display = 'none';
}

function setAmount(amount) {
    currentBetAmount = amount;
    updateAmountDisplay();
    resetAmountButtons();
    event.target.classList.add('selected');
}

function resetAmountButtons() {
    document.querySelectorAll('.bet-amount-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function changeAmount(change) {
    let newAmount = currentBetAmount + change;
    if (newAmount >= 10 && newAmount <= 1000) {
        currentBetAmount = newAmount;
        updateAmountDisplay();
        resetAmountButtons();
    }
}

function doubleAmount() {
    let newAmount = currentBetAmount * 2;
    if (newAmount <= 1000) {
        currentBetAmount = newAmount;
        updateAmountDisplay();
        resetAmountButtons();
    }
}

function updateAmountDisplay() {
    document.getElementById('currentAmount').textContent = '₹' + currentBetAmount;
}

function placeBet() {
    if (balance < currentBetAmount) {
        alert('Insufficient balance!');
        return;
    }

    currentBet = {
        type: selectedBetType,
        value: selectedBetValue,
        amount: currentBetAmount,
        timestamp: new Date().toLocaleTimeString()
    };

    balance -= currentBetAmount;
    updateDisplay();
    
    let betText = selectedBetType === 'color' ? 
        ${selectedBetValue.toUpperCase()} Color - ₹${currentBetAmount} : 
        Number ${selectedBetValue} - ₹${currentBetAmount};
    
    document.getElementById('betInfo').textContent = 'Bet placed: ' + betText;
    saveGameData();
    closeModal();
}

// Game Logic
function calculateResult() {
    const winningNumber = Math.floor(Math.random() * 10);
    let winningColor = winningNumber === 0 || winningNumber === 5 ? 'Violet' : 
                     winningNumber % 2 === 0 ? 'Green' : 'Red';
    
    // Add to history
    const currentPeriod = document.getElementById('period').textContent;
    const newHistoryItem = {
        period: currentPeriod,
        number: winningNumber.toString(),
        color: winningColor
    };
    
    gameHistory.unshift(newHistoryItem);
    if (gameHistory.length > 50) {
        gameHistory = gameHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    
    // Check win
    if (currentBet) {
        let won = false;
        let multiplier = 0;
        
        if (currentBet.type === 'color') {
            if ((currentBet.value === 'green' && winningColor === 'Green') ||
                (currentBet.value === 'red' && winningColor === 'Red') ||
                (currentBet.value === 'violet' && winningColor === 'Violet')) {
                won = true;
                multiplier = currentBet.value === 'violet' ? 4.5 : 2;
            }
        } else if (currentBet.type === 'number' && currentBet.value === winningNumber) {
            won = true;
            multiplier = 9;
        }
        
        if (won) {
            const winnings = currentBet.amount * multiplier;
            balance += winnings;
            
            // Add to win history
            winHistory.unshift({
                period: currentPeriod,
                bet: currentBet.type === 'color' ? currentBet.value + ' color' : 'number ' + currentBet.value,
                amount: currentBet.amount,
                winnings: winnings,
                timestamp: new Date().toLocaleString()
            });
            
            localStorage.setItem('winHistory', JSON.stringify(winHistory));
            
            document.getElementById('betInfo').textContent = 
                🎉 You won ₹${winnings}! Winning: ${winningNumber} (${winningColor});
        } else {
            document.getElementById('betInfo').textContent = 
                😔 You lost! Winning: ${winningNumber} (${winningColor});
        }
        
        currentBet = null;
    } else {
        document.getElementById('betInfo').textContent = 
            Result: ${winningNumber} (${winningColor}) - No bet placed;
    }
    
    renderHistory();
    
    // Update period
    let periodNum = parseInt(currentPeriod) + 1;
    document.getElementById('period').textContent = periodNum;
    
    saveGameData();
}

// Utility Functions
function addMoney() {
    balance += 500;
    updateDisplay();
    saveGameData();
    alert('₹500 added to your account!');
}

function showRules() {
    alert(`🎯 GAME RULES:
• Green: 0,2,4,6,8 (2x Win)
• Red: 1,3,5,7,9 (2x Win)  
• Violet: 0,5 (4.5x Win)
• Number: Any 0-9 (9x Win)

💰 Min Bet: ₹10
⏰ Each Round: 60 seconds
⏱ Last 10s: Betting Locked`);
}

function showWinHistory() {
    const winHistory = JSON.parse(localStorage.getItem('winHistory')) || [];
    if (winHistory.length === 0) {
        alert('No winning history yet!');
        return;
    }
    
    let winMessage = 'Your Winning History:\n\n';
    winHistory.slice(0, 10).forEach(win => {
        winMessage += Period: ${win.period}\n;
        winMessage += Bet: ${win.bet} - ₹${win.amount}\n;
        winMessage += Won: ₹${win.winnings}\n;
        winMessage += Time: ${win.timestamp}\n\n;
    });
    
    alert(winMessage);
}

function showProfile() {
    const totalGames = gameHistory.length;
    const wins = winHistory.length;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
    
    alert(`👤 USER PROFILE:
Name: Player
User ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
Balance: ₹${balance}
Total Games: ${totalGames}
Games Won: ${wins}
Win Rate: ${winRate}%`);
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

// Data Management
function saveGameData() {
    const gameData = {
        balance: balance,
        period: document.getElementById('period').textContent,
        gameHistory: gameHistory,
        winHistory: winHistory
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function loadGameData() {
    const savedData = JSON.parse(localStorage.getItem('gameData'));
    if (savedData) {
        balance = savedData.balance || 1000.00;
        document.getElementById('period').textContent = savedData.period || '20240131131';
        gameHistory = savedData.gameHistory || [];
        winHistory = savedData.winHistory || [];
    }
}

// Start game when page loads
window.onload = initGame;