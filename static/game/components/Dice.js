import HttpClient from '../../utils/httpclient.js';

export default class Dice {
    constructor(selector, imgs) {
        this.ref = document.querySelector(selector);
        this.imgsPath = imgs;
        this.button = document.createElement('button');
        this.button.innerHTML = "Roll a Dice!"
        this.button.addEventListener('click', () => this.buttonHandler());
        this.img = document.createElement('img');
        this.httpClient = new HttpClient('/api/game/dice');
        this.synth = window.speechSynthesis;

        const setVoice = () => {
            this.voice = this.synth.getVoices().find(v => v.lang == "pl-PL");
        }
        this.synth.onvoiceschanged = setVoice;
        setVoice();
    }

    update({ game, player }) {
        if (game.currentPlayer && game.currentPlayer.color == player.color) {
            this.isRolling = true;
            if (game.currentPlayer.movesToMake) {
                this.img.src = `${this.imgsPath}${game.currentPlayer.movesToMake}.png`;
                this.ref.appendChild(this.img);
            } else {
                this.ref.appendChild(this.button);
            }
        } else {
            if (!this.rolled) {
                this.ref.innerHTML = '';
            } else {
                this.isRolling = false;
                setTimeout(() => {
                    if (!this.isRolling) {
                        this.ref.innerHTML = '';
                        this.rolled = false;
                    }
                }, 1000)
            }
        }
    }

    speak(value) {
        const utterance = new SpeechSynthesisUtterance(value.toString());
        utterance.voice = this.voice;
        this.synth.speak(utterance);
    }

    async buttonHandler() {
        const value = (await this.httpClient.get()).movesToMake;
        if (value) {
            this.rolled = true;
            this.img.src = `${this.imgsPath}${value}.png`;
            this.speak(value);
            this.ref.prepend(this.img);
            this.button.remove();
        }
    }
}