import { Node } from "./core/Node.js";
import { Sprite } from "./core/Sprite.js";
import { Card } from "./components/Card.js";
import { Label } from "./core/Label.js";
// import { Button } from "./core/Button.js";
class Game extends Node {
    constructor() {
        super();
        this._load();
        this._init();
    }
    _init() {
        this._layoutCenter();
    }
    _load() {
        this.canClick = true;
        this.canSelfClick = true;
        this.firstCard = null;
        this.secondCard = null;
        this.score = 500 ;
        this.countRight = 0;
        this.valueCards = [];
        this._createNewGame();
        this.cards = [];
        this.tl = gsap.timeline();
        this.musics = {
            click: "click",
            countScore: "countScore",
            match: "match",
            nomatch: "nomatch",
            victoria: "victoria",
            lose: "lose",
            playGame: "playGame"
        };
    }
    play() {
        this._createCards();
        this.elementScore = this._createScore(this.score);
    }
    resetGame() {
        let element = document.getElementsByTagName("div")[0];
        element.innerHTML = " ";
        this.playMusic(this.musics.playGame)
        this._load();
        this.play();
    }
    removeAll(text = "") {
        let element = document.getElementsByTagName("div")[0];
        element.innerHTML = `${text}`;
    }
    _createResultBoard(text, typeMusic) {
        this.resultBoard = new Label();
        this.resultBoard.width = 500;
        this.resultBoard.height = 500;
        this.resultBoard.x = 300;
        this.resultBoard.y = 300;
        this.resultBoard.text = `${text}`;
        this.playMusic(`${typeMusic}`);
        this.resultBoard.fontSize = 80;
        this.resultBoard.elm.setAttribute("id", "featureBackground");
        this.addChild(this.resultBoard);
        return this.resultBoard;
    }
    _createScore(value) {
        let score = new Label();
        score.x = 200;
        score.y = 0;
        score.text = `SCORE: ${value}`;
        score.width = 200;
        score.fontSize = 30;
        this.addChild(score);
        return score;
    }
    _createNewGame() {
        this.newGame = new Label();
        this.newGame.x = 600;
        this.newGame.y = 0;
        this.newGame.width = 100;
        this.newGame.height = 50;
        this.newGame.elm.style.backgroundSize = "100% 100%";
        this.newGame.elm.addEventListener("click", this.resetGame.bind(this, this.newGame));
        this.newGame.elm.style.backgroundImage = "url(./images/NewGame.png)";
        this.addChild(this.newGame);
    }
    _layoutCenter() {
        this.width = 500;
        this.height = 400;
        this.x = 300;
        this.y = 200;
    }
    _createCards() {
        let indexValue = this.createValueCards();
        for (let index = 0; index < 20; index++) {
            this.card = new Card(index);
            this.card.elm.addEventListener("click",this.onClickedCard.bind(this, this.card));
            this.card.elm.setAttribute("class", `${index}`);
            this.card.setValue(indexValue[index]);
            this.cards.push(this.card);
        }
        this.collectCards()
        return this.card;
    }
    collectCards() {
        for (let index = 19; index >= 0; index--) {
            this.cards[index].x = 200;
            this.cards[index].y = 150;
            this.addChild(this.cards[index]);
            this.tl.fromTo( this.cards[index].elm,{ x: 200, y: 150, alpha: 0 },{ x: 200, t: 150, alpha: 1, duration: 0.1 });
            // this.tl.fromTo( this.cards[index].elm,{ x: 200, y: 150, alpha: 0 },{ x: 30000, t: 30000, alpha: 1, duration: 0.1 });
            if (index == 0) {
                this.tl.fromTo(
                    this.cards[index].elm,
                    { alpha: 0 },
                    { alpha: 1, delay: 0.1, onComplete: this.distributeCards.bind(this)});
            }
        }
    }
    distributeCards() {
        for (let index = 0; index < 20; index++) {
            let col = index % 5;
            let row = Math.floor(index / 5);
            this.addChild(this.cards[index]);
            this.tl.fromTo(this.cards[index].elm,{ x: 200, y: 150 },{ y: row * 100, x: col * 100, alpha: 1, duration: 0.1 });
        }
    }
    createValueCards() {
        this.valueCards = [];
        for (let i = 0; i < 20; i++) {
            this.valueCards.push(i % 10);
        }
        return this.valueCards;
    }
    shuffleValueCards() {
        return this.valueCards.sort(() => Math.random() - 0.5);
    }
    onClickedCard(card) {
        if (!this.canClick) {
            return;
        } else {
            if (card.preventSelfClick() == "false") {
                card.sprite.elm.setAttribute("isClicked", "true");
                card.flipCard();
            } else {
                return;
            }
        }
        if (card === this.firstCard) return;
        if (this.firstCard === null) {
            this.firstCard = card;              
            console.log("First: ", this.firstCard.value);
        } else {
            this.secondCard = card;
            if (this.secondCard.index == this.firstCard.index) {
                this.secondCard = null;
                return;
            }
            console.log("Second: ", this.secondCard.value);
            this.canClick = false;
            this.compareCard(this.firstCard, this.secondCard);
            this.firstCard = null;
        }
        this.playMusic(this.musics.click);
    }
    compareCard(firstCard, secondCard) {
        let point = 0;
        let result = "YOU LOSE!!!";
        if (this.firstCard.value == this.secondCard.value) {
            this.playMusic(this.musics.match);
            console.log("MATCH");
            firstCard.scaleCard();
            secondCard.scaleCard();
            setTimeout(() => {
                firstCard.hideCard();
                secondCard.hideCard();
                this.canClick = true;
            }, 1000);
            this.countRight++;
            point = 1000;
            if (this.countRight === 10  ) {
                result = "YOU WIN!!!";
                this.endGame(result, this.musics.victoria);
            }
        } else {
            console.log("NOT MATCH");
            this.playMusic(this.musics.nomatch)
            setTimeout(() => {
                firstCard.closeCard();
                secondCard.closeCard();
                this.canClick = true;
            }, 1000);
            point = -500;
        }
        this.counterScore(point);
        if (this.score <= 0) return this.endGame(result, this.musics.lose);
    }
    counterScore(point) {
        let startCount = this.score;
        this.score = startCount + point;
        let num = { start: startCount };
        let time = 0.5;
        gsap
            .timeline()
            .set(num, { start: startCount }) // back to '0'
            .to(num, {
                start: this.score,
                duration: time,
                onUpdate: this.changeScore.bind(this, num),
            });
    }
    changeScore(num) {
        this.elementScore.text = `SCORE: ${num.start.toFixed()}`;
    }
    endGame(result, typeMusic) {
        this.removeAll();
        this._load();
        this._createResultBoard(result, typeMusic);
        this.happyEnd()
    }
    happyEnd(){
        this.tl.fromTo(this.resultBoard.elm,{ x: -400, y: -300 },{ x: 300, y: 300, alpha: 1, duration: 15, delay: 1 });
        this.tl.fromTo(this.resultBoard.elm,{ x: 300, y: 300 },{ x: -150, y: -150, alpha: 1, duration: 15, delay: 1 });
        // this.happyEnd()
    }
    playMusic(typeMusic) {
        this.audio = new Audio("./music/" + typeMusic + ".wav");
        // audio.pause()
        this.audio.play();
        return this.audio;
    }
}
let game = new Game();
document.body.appendChild(game.elm);
