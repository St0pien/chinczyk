import HttpClient from "../../utils/httpclient.js";

export default class WinnerScreen {
    constructor() {
        this.ref = document.createElement('div');
        this.ref.classList.add('winner');
        this.button = document.createElement('button');
        this.button.addEventListener('click', () => this.nextGame());
        this.button.innerHTML = 'Next game';
        this.button.classList.add('next-btn')
        this.showed = false;
        this.httpClient = new HttpClient('/api/game/leave/');
        this.leaveBtn = document.querySelector('#leave');
        this.leaveBtn.addEventListener('click', () => { 
            this.httpClient.get('').then(() => {
                location.replace('/waiting/');
            });
        });
    }

    nextGame() {
        this.httpClient.get('').then(() => {
            location.replace('/');
        });
    }

    update({ game }) {
        if (game.winner && !this.showed) {
            this.ref.style.backgroundColor = game.winner.color;
            this.ref.innerHTML = `${game.winner.nick} won!!!`;
            this.ref.appendChild(this.button);
            document.body.appendChild(this.ref);
            this.showed = true;
        }
    }
}