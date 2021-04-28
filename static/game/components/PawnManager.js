import Pawn from './Pawn.js';

export default class PawnManager {
    constructor() {
        this.ref = document.createElement('div');
        this.ref.classList.add('pawns');
        this.pawns = [];
    }

    update({ game, player }) {
        this.ref.innerHTML = '';
        this.pawns = [];
        game.players.forEach(p => {
            p.pawns.forEach(pawn => {
                const pawnObject = new Pawn(pawn, p.color, (color, field) => this.isFree(color, field));
                this.ref.appendChild(pawnObject.ref);
                this.pawns.push(pawnObject);
            });
        });

        if (player.movesToMake) {
            this.showIndicators(player.movesToMake, player.color);
        }
    }

    isFree(color, field) {
        const pawns = this.pawns.filter(p => p.color == color && p.finish);
        return pawns.every(p => p.field != field);
    }

    showIndicators(moves, color) {
        const onMove = () => {
            this.pawns.forEach(p => p.indicator.style.display = 'none');
        }
        this.pawns
            .filter(p => p.color == color)
            .forEach(p => {
                p.showIndicator(moves, onMove);
                this.ref.appendChild(p.indicator);
            });
    }
}