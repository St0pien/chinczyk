import HttpClient from "../../utils/httpclient.js";

export default class PlayerBar {
    constructor(selector) {
        this.httpClient = new HttpClient("/api/player/")
        this.ref = document.querySelector(selector);
        this.readySwitch = this.ref.querySelector('#ready');
        this.readyText = this.ref.querySelector('.ready-text');
        this.readySwitch.addEventListener("change", () => this.readyBtnClick());
        this.ready = false;
    }

    readyBtnClick() {
        this.httpClient.post({ ready: !this.ready }, 'status');
        this.ready = this.readySwitch.checked;
        this.readyText.innerHTML = this.ready ? "Let's go!" : "Wait"
    }

    update({ game, player }) {
        const playerRefs = this.ref.querySelectorAll('.player');
        playerRefs.forEach(ref => {
            ref.remove();
        });

        const frag = document.createDocumentFragment();
        game.players.forEach(player => {
            const div = document.createElement('div');
            div.classList.add('player');
            div.style.backgroundColor = '#222';
            if (player.ready) {
                div.style.backgroundColor = player.color;
            }
            div.innerHTML = player.nick;
            if (game.currentPlayer && game.currentPlayer.color == player.color) {
                const timer = document.createElement('div');
                timer.classList.add('player-timer');
                timer.innerHTML = player.timeLeft;
                div.appendChild(timer);
            }
            frag.appendChild(div);
        });
        this.ref.appendChild(frag);

        this.ready = player.ready;
        this.readySwitch.checked = this.ready;
        this.readyText.innerHTML = player.ready ? "Let's go!" : "Wait";

        if (game.active) {
            this.readyText.remove();
            const toggle = this.ref.querySelector('.switch')
            if (toggle) {
                toggle.remove();
            }
        }
    }
}