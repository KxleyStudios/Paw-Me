// Paw @ Me Clicker Game
class PawClickerGame {
    constructor() {
        this.gameData = {
            baps: 0,
            bapsPerSecond: 0,
            clickValue: 1,
            selectedCharacter: null,
            superBapChance: 0,
            globalMultiplier: 1,

            upgrades: {
                autoClicker: { owned: 0, cost: 15, baseCost: 15, bps: 1 },
                clickMultiplier: { owned: 0, cost: 100, baseCost: 100, clickBonus: 1 },
                superBap: { owned: 0, cost: 250, baseCost: 250, chanceBonus: 5 },
                bapFactory: { owned: 0, cost: 500, baseCost: 500, bps: 5 },
                bapMine: { owned: 0, cost: 2500, baseCost: 2500, bps: 25 },
                bapLab: { owned: 0, cost: 10000, baseCost: 10000, bps: 100 },
                bapPortal: { owned: 0, cost: 50000, baseCost: 50000, bps: 500 },
                goldenPaw: { owned: 0, cost: 100000, baseCost: 100000, multiplier: 2 },
                cosmicBap: { owned: 0, cost: 1000000, baseCost: 1000000, bps: 5000 }
            },

            achievements: {
                firstClick: false,
                hundred: false,
                thousand: false,
                superBapFirst: false
            }
        };

        this.elements = {
            characterSelect: document.getElementById('characterSelect'),
            gameArea: document.getElementById('gameArea'),
            bapCount: document.getElementById('bapCount'),
            bpsCount: document.getElementById('bpsCount'),
            mainCharacter: document.getElementById('mainCharacter'),
            clickEffect: document.getElementById('clickEffect'),
            heartsContainer: document.getElementById('heartsContainer')
        };

        this.characterImages = {
            1: {
                idle: 'images/character1_idle.png',
                hit: 'images/character1_hit.png',
                taunt: 'images/character1_taunt.png',
                dodge: 'images/character1_dodge.png'
            },
            2: {
                idle: 'images/character2_idle.png',
                hit: 'images/character2_hit.png',
                taunt: 'images/character2_taunt.png',
                dodge: 'images/character2_dodge.png'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.createFloatingHearts();
        this.startGameLoop();
    }

    bindEvents() {
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const character = e.currentTarget.dataset.character;
                this.selectCharacter(character);
            });
        });

        this.elements.mainCharacter.addEventListener('click', () => {
            this.handleClick();
        });

        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const shopItem = e.currentTarget.closest('.shop-item').dataset.item;
                this.purchaseUpgrade(shopItem);
            });
        });
    }

    selectCharacter(characterId) {
        this.gameData.selectedCharacter = characterId;
        this.elements.characterSelect.classList.add('hidden');
        this.elements.gameArea.classList.remove('hidden');
        this.elements.mainCharacter.src = this.characterImages[characterId].idle;
    }

    handleClick() {
        const isSuper = Math.random() * 100 < this.gameData.superBapChance;
        const value = isSuper ? this.gameData.clickValue * 10 : this.gameData.clickValue;
        this.gameData.baps += value * this.gameData.globalMultiplier;

        this.updateDisplay();

        this.showClickEffect(value);

        this.checkAchievements();
    }

    showClickEffect(amount) {
        const effect = this.elements.clickEffect;
        effect.textContent = `+${amount}`;
        effect.classList.remove('hidden');
        setTimeout(() => effect.classList.add('hidden'), 300);
    }

    updateDisplay() {
        this.elements.bapCount.textContent = Math.floor(this.gameData.baps);
        this.elements.bpsCount.textContent = this.gameData.bapsPerSecond;
        this.updateShopDisplay();
        this.updateAchievements();
    }

    updateShopDisplay() {
        Object.keys(this.gameData.upgrades).forEach(key => {
            const upgrade = this.gameData.upgrades[key];
            const item = document.querySelector(`.shop-item[data-item="${key}"]`);
            item.querySelector('.item-cost').textContent = `Cost: ${upgrade.cost}`;
            item.querySelector('.item-owned').textContent = `Owned: ${upgrade.owned}`;
        });
    }

    purchaseUpgrade(key) {
        const upgrade = this.gameData.upgrades[key];
        if (this.gameData.baps >= upgrade.cost) {
            this.gameData.baps -= upgrade.cost;
            upgrade.owned += 1;

            if (upgrade.bps) this.gameData.bapsPerSecond += upgrade.bps;
            if (upgrade.clickBonus) this.gameData.clickValue += upgrade.clickBonus;
            if (upgrade.chanceBonus) this.gameData.superBapChance += upgrade.chanceBonus;
            if (upgrade.multiplier) this.gameData.globalMultiplier *= upgrade.multiplier;

            upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));

            this.updateDisplay();
        }
    }

    checkAchievements() {
        const baps = this.gameData.baps;
        const a = this.gameData.achievements;

        if (!a.firstClick && baps >= 1) a.firstClick = true;
        if (!a.hundred && baps >= 100) a.hundred = true;
        if (!a.thousand && baps >= 1000) a.thousand = true;

        this.updateAchievements();
    }

    updateAchievements() {
        Object.entries(this.gameData.achievements).forEach(([key, unlocked]) => {
            const el = document.querySelector(`.achievement[data-achievement="${key}"]`);
            if (unlocked) el.classList.remove('locked');
        });
    }

    createFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '🐾';
            heart.style.left = Math.random() * 100 + '%';
            this.elements.heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, 1000);
    }

    startGameLoop() {
        setInterval(() => {
            this.gameData.baps += this.gameData.bapsPerSecond * this.gameData.globalMultiplier;
            this.updateDisplay();
        }, 1000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new PawClickerGame();
});
