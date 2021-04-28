const { v4: uuid } = require('uuid');
const offsets = require('./offsets');

class Game {
    constructor() {
        this.id = uuid();
        this.players = [];
        this.availableColors = ['red', 'blue', 'green', 'yellow'];
        this.active = false;
        this.currentPlayer = null;
        this.winner = null;
        this.turnTime = 60;
    }

    isFree() {
        return this.players.length < 4 && !this.active;
    }

    getPlayer(id) {
        const player = this.players.find(player => id == player.id);
        const result = ((({ id, timer, ...obj }) => obj))(player);
        delete result.id;
        return result;
    }

    addPlayer(player) {
        player.color = this.availableColors.pop();
        player.onTimeEnd = () => this.nextPlayer();
        this.players.push(player);

        if (!this.isFree()) {
            this.active = true;
            this.players.forEach(p => p.ready = true);
            this.nextPlayer();
        }
    }

    removePlayer(id) {
        const player = this.players.find(p => p.id == id);
        this.availableColors.push(player.color);
        this.players = this.players.filter(p => p.id != id);

        if (this.currentPlayer && this.currentPlayer.id == id) {
            this.currentPlayer.stopTimer();
            this.nextPlayer();
        }
    }

    nextPlayer() {
        if (this.currentPlayer) {
            this.currentPlayer.stopTimer();
            this.currentPlayer.movesToMake = null;
        }
        
        if (!this.currentPlayer) {
            this.currentPlayer = this.players[0];
            this.currentPlayer.timeLeft = this.turnTime;
            this.currentPlayer.startTimer();
            return;
        }

        let currentIndex = this.players.findIndex(p => p.id == this.currentPlayer.id) + 1;
        if (currentIndex >= this.players.length) {
            currentIndex = 0;
        }

        this.currentPlayer = this.players[currentIndex];
        if (this.currentPlayer) {
            this.currentPlayer.timeLeft = this.turnTime;
            this.currentPlayer.startTimer();
        }
    }

    updatePlayerStatus(playerid, status) {
        if (this.active) return;

        const player = this.players.find(player => player.id == playerid);
        player.setReady(status);

        if (this.players.every(player => player.ready) && this.players.length >= 2) {
            this.active = true;
            this.nextPlayer();
        }
    }

    rollDice() {
        const value = Math.floor(Math.random() * 6) + 1;
        if (!this.currentPlayer.movesToMake) {
            this.currentPlayer.throwed(value);
        }

        if (!this.currentPlayer.movesToMake) this.nextPlayer();

        return value;
    }

    checkCaptures(pawnID) {
        const pawn = this.currentPlayer.pawns.find(p => p.id == pawnID);
        this.players.forEach(p => {
            p.pawns.forEach(pn => {
                if (p.id == this.currentPlayer.id || pn.finish) return;
                let pnOffset = pn.field + offsets[p.color]
                if (pnOffset >= 40) pnOffset -= 40;
                let pawnOffset = pawn.field + offsets[this.currentPlayer.color];
                if (pawnOffset >= 40) pawnOffset -= 40;
                if (!pn.home && pnOffset == pawnOffset) {
                    pn.field = 0;
                    pn.home = true;
                }
            });
        });
    }

    checkWin() {
        if (this.currentPlayer.pawns.every(p => p.finish)) {
            this.winner = this.getPlayer(this.currentPlayer.id);
        }
    }

    makeMove(pawnID) {
        this.currentPlayer.move(pawnID);
        this.checkCaptures(pawnID);
        this.checkWin();
        this.nextPlayer();
    }

    getState() {
        return {
            players: this.players.map(({ id }) => this.getPlayer(id)),
            active: this.active,
            currentPlayer: this.currentPlayer ? this.getPlayer(this.currentPlayer.id) : null,
            winner: this.winner
        }
    }
}

module.exports = Game;