import PawnManager from "./PawnManager.js";

export default class Board {
    constructor(selector, background) {
        this.ref = document.querySelector(selector);
        this.background = document.createElement('img');
        this.background.src = background;
        this.pawnManager = new PawnManager();
    }

    update({ game, player }) {
        this.ref.innerHTML = "";
        if (game.active) {
            this.ref.appendChild(this.background);

            this.ref.appendChild(this.pawnManager.ref);
            this.pawnManager.update({ game, player });
        }
    }
}