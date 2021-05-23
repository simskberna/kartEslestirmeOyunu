class AudioController{
    constructor(){
        this.bgMusic = new Audio('./Assets/Auido/backgroundSound.mp3');
        this.flipSound = new Audio('./Assets/Auido/flip.mp3');
        this.matchSound= new Audio('./Assets/Auido/correct-answer.mp3');
        this.zaferSound = new Audio('./Assets/Auido/victory.mp3');
        this.gameOverSound = new Audio('./Assets/Auido/game-over.mp3');
        this.wrongAnswerSound = new Audio('./Assets/Auido/wrong-answer.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;

    }
    startMusic(){
        this.bgMusic.play();
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime=0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    mismatch(){
        this.wrongAnswerSound.play();
    }
    zafer(){
        this.stopMusic();
        this.zaferSound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class KartEslestirme{
    constructor(totalTime,cards){
        this.cardsArray= cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.counter = document.getElementById('points');
        this.audioController = new AudioController();
        
    }
    oyunuBaslat(){
        this.cardToCheck = null;
        this.matchCount = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(()=>{
            this.audioController.startMusic();
            this.karistir();
            this.countDown=this.sureyiBaslat();
            this.busy=false;
        }, 500);

        this.kartlariSakla();
        this.timer.innerText = this.timeRemaining;
       this.counter.innerText = this.matchCount;

    }
    kartlariSakla(){
        this.cardsArray.forEach(card=>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    sureyiBaslat(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining ===0){
                this.gameOver();
            }
        },1000);
    }
    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
         
    }
    zafer(){
        clearInterval(this.countDown);
        this.audioController.zafer();
        document.getElementById('victory-text').classList.add('visible');

    }
    kartiCevir(card){
        if(this.kartCevrilebilirMi(card)){
            this.audioController.flip();
         
            card.classList.add('visible');

            if(this.cardToCheck)
                this.kartEslesmeKontrolu(card);
            else
                this.cardToCheck = card;
        }
    }
    kartEslesmeKontrolu(card){
        if(this.kartTipi(card) === this.kartTipi(this.cardToCheck))
            this.kartEslesmesi(card,this.cardToCheck);
        else
            this.eslesmeme(card,this.cardToCheck);
        
        this.cardToCheck = null;
    }

    kartEslesmesi(card1,card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card1.classList.add('matched');
       setTimeout(()=>{
        this.matchCount++;
        this.counter.innerText=this.matchCount;
       },500);
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.zafer();
    }

    eslesmeme(card1,card2){ 
        this.audioController.mismatch();
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    kartTipi(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    karistir(){
        for(let i = this.cardsArray.length - 1; i > 0; i--){
            let randIndex = Math.floor(Math.random()*(i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    kartCevrilebilirMi(card){
            
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}
function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new KartEslestirme(100, cards);

    overlays.forEach(overlay =>{
        overlay.addEventListener('click',()=>{
            overlay.classList.remove('visible');
            game.oyunuBaslat();
         
        });
    });
    cards.forEach(card=>{
        card.addEventListener('click',()=>{
            game.kartiCevir(card);
        });
    });
}
if(document.readyState === "loading"){
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}
