const { v4: uuid } = require('uuid');

class Player {
    constructor(nick) {
        this.id = uuid();
        this.nick = nick;
        this.color = "";
        this.ready = false;
        this.movesToMake = null;
        this.pawns = [];
        this.onTimeEnd = () => {};
        for (let i=0; i<4; i++) {
            this.pawns.push({
                id: i,
                field: i,
                home: false,
                finish: true
            });
        }

        this.pawns[3].finish = false;
        this.pawns[3].field = 38;

        this.timeLeft = null;
    }

    setReady(status) {
        this.ready = status;
    }

    throwed(value) {
        this.movesToMake = value;
        this.canIMove();
    }

    canIMove() {
        if (this.pawns.findIndex(p => this.canPawnMove(p.id)) == -1) {
            this.movesToMake = null;
        }
    }

    canPawnMove(id) {
        if (typeof this.movesToMake != "number") {
            return false;
        }
        if (this.movesToMake < 1 || this.movesToMake > 6) {
            return false;
        }
        if (this.movesToMake % 1 != 0) { // Check if its integer
            return false;
        }

        const pawn = this.pawns.find(p => p.id == id);
        
        if(pawn.home) {
            if (this.movesToMake != 1 && this.movesToMake != 6) {
                return false;
            }
        }

        if (pawn.finish) {
            if (pawn.field + this.movesToMake >= 4) {
                return false;
            }

            if (this.pawns.findIndex(p => p.finish && p.field == pawn.field + this.movesToMake) > -1) {
                return false;
            }
        }

        if (pawn.field + this.movesToMake >= 40) {
            if (pawn.field-40+this.movesToMake >= 4) {
                return false;
            }

            if (this.pawns.findIndex(p => p.finish && p.field == pawn.field + this.movesToMake - 40) > -1) {
                return false;
            }
        }

        return true;
    }

    move(pawnID) {
        if (!this.canPawnMove(pawnID)) {
            this.movesToMake = null;
            return;
        }

        const pawn = this.pawns.find(p => p.id == pawnID);
        if (pawn.home) {
            pawn.home = false;
        } else {
            pawn.field += this.movesToMake;
        }

        if (pawn.field >= 40) {
            if (this.pawns.every(p => !p.finish || p.field != pawn.field)) {
                pawn.field -= 40;
                pawn.finish = true; 
            }
        }

        this.movesToMake = null;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft < 0) {
                this.onTimeEnd();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timeLeft = null;
    }
}

module.exports = Player;
