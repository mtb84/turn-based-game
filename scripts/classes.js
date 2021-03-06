import { foods } from './objects.js';
import { getRandom, disableButtons, updateHeroHealthBar, updateEnemyHealthBar } from './helpers.js';

export class Character {
    constructor({ name, health, powerLevel, faceImg, backgroundImg, standImg, throwImg }) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.currentFood = null;
        this.powerLevel = powerLevel;
        this.faceImg = faceImg;
        this.backgroundImg = backgroundImg;
        this.standImg = standImg;
        this.throwImg = throwImg;
    }

    attack(target) {
        const newHealth = target.health - (this.currentFood.damage * this.powerLevel);
        const throwSound = document.getElementById('throw-sound');
        const hitSound = document.getElementById('hit-sound');
        throwSound.play(); 
        setTimeout(() => {
            hitSound.play();
            
            if (Math.round(newHealth) <= 0) {
                target.health = 0;
                this.gameOver();
            }
            else {
                target.health = newHealth;
            }
            
            if (this instanceof Hero) {
                updateEnemyHealthBar(target);
            }
            else {
                updateHeroHealthBar(target);
            }
        }, 1000);
    }

    eat() {
        const newHealth = this.health + this.currentFood.nutrition;
        if (newHealth > this.maxHealth) {
            this.health = this.maxHealth;
        }
        else {
            this.health = newHealth;
        }
        const eatSound = document.getElementById("eat-sound");
        eatSound.play();
    }

    generateFood() {
        this.currentFood = getRandom(foods);
    };

    gameOver() {
        disableButtons();

        const youLost = document.getElementById('youLose')
        const youWon = document.getElementById('youWin')
        score.pause();
        let title = "";
        if (this instanceof Hero) {
            title = `🏆🏆🏆   You win!   🏆🏆🏆`;
            youWon.play()
        }
        else {
            title = `Game over... ${this.name} wins`;
            youLost.play()
        }

        document.querySelector('.game-over .title').textContent = title;
        document.querySelectorAll('.game-over img').forEach(img => img.src = `../files/${this.faceImg}`);
        document.querySelector('.game-over').style.visibility = 'visible';
    }
}

export class Hero extends Character {
    constructor(name, health, powerLevel, faceImg, backgroundImg, standImg, throwImg) {
        super(name, health, powerLevel, faceImg, backgroundImg, standImg, throwImg);
    }

    heroThrow() {
        const heroStanding = document.querySelector('.hero-standing');
        heroStanding.src = `./files/${this.throwImg}`;
        heroStanding.style.transform = 'translate(25%, 0) scale(1.5)';

        const heroFood = document.querySelector('.hero-food');
        heroFood.innerHTML = this.currentFood.icon;
        heroFood.classList.toggle('move-right');

        setTimeout(() => {
            heroStanding.src = `./files/${this.standImg}`;
            heroStanding.style.transform = 'translate(25%, -25%) scale(1)';
            heroFood.innerHTML = "";
            heroFood.classList.toggle('move-right');
        }, 1000);
    }

    heroEat() {
        const heroEating = document.querySelector('.hero-eat');
        heroEating.classList.toggle('eating');
        setTimeout(() => {
            heroEating.classList.toggle('eating');
        }, 1000)
    }
}

export class Enemy extends Character {
    constructor(name, health, powerLevel, faceImg, backgroundImg, standImg, throwImg) {
        super(name, health, powerLevel, faceImg, backgroundImg, standImg, throwImg);
    }

    enemyThrow() {
        const enemyStanding = document.querySelector('.enemy-standing');
        enemyStanding.src = `./files/${this.throwImg}`;

        const enemyFood = document.querySelector('.enemy-food');
        enemyFood.innerHTML = this.currentFood.icon;
        enemyFood.classList.toggle('move-left');

        setTimeout(() => {
            enemyStanding.src = `./files/${this.standImg}`;
            enemyFood.innerHTML = "";
            enemyFood.classList.toggle('move-left');
        }, 1000);
    }

    enemyEat() {
        const enemyEating = document.querySelector('.enemy-eat');
        enemyEating.classList.toggle('eating');
        updateEnemyHealthBar(this);
        setTimeout(() => {
            enemyEating.classList.toggle('eating');
        }, 1000)
    }

    randomMove(target) {
        if (Math.random() > 0.2) {
            this.attack(target);
            this.enemyThrow();
        }
        else {
            this.eat();
            this.enemyEat();
        }
    }
}