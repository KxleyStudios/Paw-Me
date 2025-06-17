// Paw @ Me Game Script
class PawAtMeGame {
    constructor() {
        this.gameState = {
            roomId: null,
            playerId: null,
            isHost: false,
            gameActive: false,
            timeLeft: 120, // 2 minutes
            scores: { player1: 0, player2: 0 },
            currentRound: null,
            roundStartTime: null
        };
        
        this.firebase = null;
        this.database = null;
        this.gameRef = null;
        
        this.elements = {
            menuSection: document.getElementById('menuSection'),
            createRoomBtn: document.getElementById('createRoomBtn'),
            joinRoomBtn: document.getElementById('joinRoomBtn'),
            roomInput: document.getElementById('roomInput'),
            roomId: document.getElementById('roomId'),
            timeLeft: document.getElementById('timeLeft'),
            connectionStatus: document.getElementById('connectionStatus'),
            countdownDisplay: document.getElementById('countdownDisplay'),
            actionPrompt: document.getElementById('actionPrompt'),
            player1Score: document.getElementById('player1Score'),
            player2Score: document.getElementById('player2Score'),
            player1Character: document.getElementById('player1Character'),
            player2Character: document.getElementById('player2Character'),
            player1Explosion: document.getElementById('player1Explosion'),
            player2Explosion: document.getElementById('player2Explosion')
        };
        
        this.rhythmPatterns = [
            { beats: [1000, 800, 1200], name: "Quick Jab" },
            { beats: [1500, 1000, 800, 600], name: "Combo Strike" },
            { beats: [2000, 500, 500, 1000], name: "Power Punch" },
            { beats: [800, 800, 400, 400, 800], name: "Flurry" },
            { beats: [1200, 1200, 600], name: "Heavy Hit" }
        ];
        
        this.init();
    }
    
    init() {
        this.initFirebase();
        this.bindEvents();
        this.updateConnectionStatus("Ready to play!");
    }
    
    initFirebase() {
        // Firebase configuration - replace with your own config
        const firebaseConfig = {
            // You'll need to add your Firebase config here
            // For now, we'll simulate Firebase functionality
            databaseURL: "https://your-project.firebaseio.com"
        };
        
        // Simulated Firebase for demo - replace with actual Firebase init
        this.simulateFirebase();
    }
    
    simulateFirebase() {
        // This simulates Firebase functionality for demo purposes
        // Replace this with actual Firebase initialization
        this.updateConnectionStatus("Firebase simulation mode");
        console.log("Replace this with actual Firebase configuration");
    }
    
    bindEvents() {
        this.elements.createRoomBtn.addEventListener('click', () => this.createRoom());
        this.elements.joinRoomBtn.addEventListener('click', () => this.joinRoom());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyRelease(e));
    }
    
    createRoom() {
        const roomId = this.generateRoomCode();
        this.gameState.roomId = roomId;
        this.gameState.isHost = true;
        this.gameState.playerId = 'player1';
        
        this.elements.roomId.textContent = roomId;
        this.elements.menuSection.style.display = 'none';
        this.updateConnectionStatus("Waiting for player 2...");
        
        // In real implementation, create Firebase room here
        this.startGameLoop();
    }
    
    joinRoom() {
        const roomId = this.elements.roomInput.value.toUpperCase();
        if (roomId.length !== 4) {
            alert("Please enter a 4-character room code");
            return;
        }
        
        this.gameState.roomId = roomId;
        this.gameState.isHost = false;
        this.gameState.playerId = 'player2';
        
        this.elements.roomId.textContent = roomId;
        this.elements.menuSection.style.display = 'none';
        this.updateConnectionStatus("Connected! Game starting...");
        
        // In real implementation, join Firebase room here
        this.startGameLoop();
    }
    
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    startGameLoop() {
        this.gameState.gameActive = true;
        this.startTimer();
        
        // Wait a moment then start first round
        setTimeout(() => {
            this.startNewRound();
        }, 2000);
    }
    
    startTimer() {
        const timer = setInterval(() => {
            this.gameState.timeLeft--;
            const minutes = Math.floor(this.gameState.timeLeft / 60);
            const seconds = this.gameState.timeLeft % 60;
            this.elements.timeLeft.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.gameState.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }
    
    startNewRound() {
        if (!this.gameState.gameActive) return;
        
        const pattern = this.rhythmPatterns[Math.floor(Math.random() * this.rhythmPatterns.length)];
        this.gameState.currentRound = {
            pattern: pattern,
            currentBeat: 0,
            startTime: Date.now(),
            completed: false
        };
        
        this.updateConnectionStatus(`Get ready: ${pattern.name}`);
        this.showCountdown();
    }
    
    showCountdown() {
        let count = 3;
        this.elements.countdownDisplay.textContent = count;
        this.elements.countdownDisplay.classList.remove('hidden');
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.elements.countdownDisplay.textContent = count;
            } else if (count === 0) {
                this.elements.countdownDisplay.textContent = "GO!";
            } else {
                clearInterval(countdownInterval);
                this.elements.countdownDisplay.classList.add('hidden');
                this.startRhythmSequence();
            }
        }, 1000);
    }
    
    startRhythmSequence() {
        const pattern = this.gameState.currentRound.pattern;
        let beatIndex = 0;
        
        const showNextBeat = () => {
            if (beatIndex >= pattern.beats.length || !this.gameState.gameActive) {
                this.elements.actionPrompt.classList.add('hidden');
                setTimeout(() => this.startNewRound(), 2000);
                return;
            }
            
            this.elements.actionPrompt.classList.remove('hidden');
            this.gameState.currentRound.currentBeat = beatIndex;
            this.gameState.currentRound.beatStartTime = Date.now();
            
            setTimeout(() => {
                this.elements.actionPrompt.classList.add('hidden');
                beatIndex++;
                setTimeout(showNextBeat, 300);
            }, pattern.beats[beatIndex]);
        };
        
        showNextBeat();
    }
    
    handleKeyPress(e) {
        if (!this.gameState.gameActive) return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.performAction('attack');
                break;
            case 'AltLeft':
            case 'AltRight':
                e.preventDefault();
                this.performAction('dodge');
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                e.preventDefault();
                this.performAction('taunt');
                break;
        }
    }
    
    handleKeyRelease(e) {
        // Reset character animations when key is released
        if (!this.gameState.gameActive) return;
        
        const characterId = this.gameState.playerId === 'player1' ? 'player1Character' : 'player2Character';
        const character = document.getElementById(characterId);
        
        // Remove animation classes after a short delay
        setTimeout(() => {
            character.classList.remove('hit', 'dodge', 'taunt');
        }, 100);
    }
    
    performAction(action) {
        const characterId = this.gameState.playerId === 'player1' ? 'player1Character' : 'player2Character';
        const character = document.getElementById(characterId);
        const isPlayer1 = this.gameState.playerId === 'player1';
        
        // Update character sprite and animation
        character.classList.remove('hit', 'dodge', 'taunt');
        character.classList.add(action);
        
        // Update character image based on action
        const baseSrc = isPlayer1 ? 'images/character1_' : 'images/character2_';
        character.src = baseSrc + action + '.png';
        
        // Reset to idle after animation
        setTimeout(() => {
            character.src = baseSrc + 'idle.png';
            character.classList.remove(action);
        }, 600);
        
        if (action === 'attack') {
            this.processAttack();
        }
        
        // In real implementation, send action to Firebase
        this.syncAction(action);
    }
    
    processAttack() {
        if (!this.gameState.currentRound || this.elements.actionPrompt.classList.contains('hidden')) {
            return; // No active beat to hit
        }
        
        const timeDiff = Date.now() - this.gameState.currentRound.beatStartTime;
        const accuracy = Math.max(0, 1000 - timeDiff) / 1000; // Score based on timing
        
        if (accuracy > 0.3) { // Hit threshold
            const points = Math.floor(accuracy * 100);
            this.addScore(points);
            this.showHitEffect();
            this.elements.actionPrompt.classList.add('hidden');
        }
    }
    
    addScore(points) {
        const scoreElement = this.gameState.playerId === 'player1' ? 
            this.elements.player1Score : this.elements.player2Score;
        
        this.gameState.scores[this.gameState.playerId] += points;
        scoreElement.textContent = this.gameState.scores[this.gameState.playerId];
        
        // Score popup animation
        this.showScorePopup(points);
    }
    
    showScorePopup(points) {
        const popup = document.createElement('div');
        popup.textContent = `+${points}`;
        popup.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 36px;
            font-weight: bold;
            color: #feca57;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            z-index: 20;
            pointer-events: none;
            animation: scorePopup 1s ease-out forwards;
        `;
        
        // Add keyframe animation
        if (!document.getElementById('scorePopupStyle')) {
            const style = document.createElement('style');
            style.id = 'scorePopupStyle';
            style.textContent = `
                @keyframes scorePopup {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { transform: translate(-50%, -70%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -90%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.getElementById('centerArea').appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    }
    
    showHitEffect() {
        const oppositePlayer = this.gameState.playerId === 'player1' ? 'player2' : 'player1';
        const explosionElement = document.getElementById(oppositePlayer + 'Explosion');
        const characterElement = document.getElementById(oppositePlayer + 'Character');
        
        // Show explosion
        explosionElement.classList.remove('hidden');
        explosionElement.classList.add('show');
        
        // Shake character
        characterElement.classList.add('hit');
        
        setTimeout(() => {
            explosionElement.classList.add('hidden');
            explosionElement.classList.remove('show');
        }, 800);
    }
    
    syncAction(action) {
        // In real implementation, sync with Firebase
        console.log(`Player ${this.gameState.playerId} performed: ${action}`);
    }
    
    updateConnectionStatus(status) {
        this.elements.connectionStatus.textContent = status;
    }
    
    endGame() {
        this.gameState.gameActive = false;
        const winner = this.gameState.scores.player1 > this.gameState.scores.player2 ? 
            'Player 1' : this.gameState.scores.player2 > this.gameState.scores.player1 ? 
            'Player 2' : 'Tie';
        
        this.updateConnectionStatus(`Game Over! Winner: ${winner}`);
        
        // Show final scores
        setTimeout(() => {
            alert(`Game Over!\nPlayer 1: ${this.gameState.scores.player1}\nPlayer 2: ${this.gameState.scores.player2}\nWinner: ${winner}`);
            this.resetGame();
        }, 1000);
    }
    
    resetGame() {
        this.gameState = {
            roomId: null,
            playerId: null,
            isHost: false,
            gameActive: false,
            timeLeft: 120,
            scores: { player1: 0, player2: 0 },
            currentRound: null,
            roundStartTime: null
        };
        
        this.elements.player1Score.textContent = '0';
        this.elements.player2Score.textContent = '0';
        this.elements.timeLeft.textContent = 'Time Left: 2:00';
        this.elements.menuSection.style.display = 'flex';
        this.elements.roomInput.value = '';
        this.updateConnectionStatus('Ready to play!');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PawAtMeGame();
});

// Firebase configuration template
const firebaseConfig = {
  apiKey: "AIzaSyDxwiUn31XZPWbKHMlCVb8z39IwdK6wFkQ",
  authDomain: "lempunch.firebaseapp.com",
  databaseURL: "https://lempunch-default-rtdb.firebaseio.com",
  projectId: "lempunch",
  storageBucket: "lempunch.firebasestorage.app",
  messagingSenderId: "443229856298",
  appId: "1:443229856298:web:a89ac5f679898f8ad69953"
};

// Example Firebase integration functions (uncomment and modify when ready)
/*
function initializeFirebase() {
    firebase.initializeApp(firebaseConfigTemplate);
    return firebase.database();
}

function createFirebaseRoom(roomId, hostId) {
    const database = firebase.database();
    return database.ref('rooms/' + roomId).set({
        host: hostId,
        players: { [hostId]: { score: 0, ready: true } },
        gameState: 'waiting',
        createdAt: firebase.database.ServerValue.TIMESTAMP
    });
}

function joinFirebaseRoom(roomId, playerId) {
    const database = firebase.database();
    return database.ref('rooms/' + roomId + '/players/' + playerId).set({
        score: 0,
        ready: true,
        joinedAt: firebase.database.ServerValue.TIMESTAMP
    });
}
*/