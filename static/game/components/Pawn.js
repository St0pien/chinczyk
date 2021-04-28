import CORDS from './config.js';
import HttpClient from '../../utils/httpclient.js';

export default class Pawn {
    constructor({ field, home, finish, id }, color, isFreeFunction) {
        this.id = id;
        this.isFreeFunction = isFreeFunction;
        this.ref = document.createElement('div');
        this.ref.classList.add('pawn');
        this.ref.style.backgroundColor = color;
        this.field = field;
        this.home = home;
        this.finish = finish
        this.color = color;
        this.setPosition();

        this.indicator = document.createElement('div');
        this.indicator.classList.add('indicator');

        this.httpClient = new HttpClient('/api/player/move');
    }

    setPosition() {
        let x, y;
        
        if (this.field >= 40) {
            this.field -= 40;
            this.finish = true;
        }

        if (this.home) {
            [x, y] = CORDS[this.color].home[this.id];
        } else if (this.finish) {
            [x, y] = CORDS[this.color].finish[this.field];
        } else {
            let cordIndex = this.field + CORDS[this.color].offset;
            if (cordIndex >= CORDS.fields.length) {
                cordIndex -= CORDS.fields.length;
            }
            [x, y] = CORDS.fields[cordIndex];
        }

        this.ref.style.left = `${x}%`;
        this.ref.style.top = `${y}%`;
    }

    indicatorClick(moves, onClick) {
        this.httpClient.post({ id: this.id }).then(() => {
            if (this.home) this.home = false;
            else this.field += moves;
            this.setPosition();
            onClick();
        });
    }

    showIndicator(moves, onClick) {
        let x, y;
        this.indicator.style.display = 'block';
        if (this.home) {
            if (moves != 1 && moves != 6) {
                this.indicator.style.display = 'none';
                return;
            }

            [x, y] = CORDS.fields[CORDS[this.color].offset];
        } else if (this.finish) {
            let cordIndex = this.field + moves;
            if (cordIndex >= 4) {
                this.indicator.style.display = 'none';
                return;
            }
            if (!this.isFreeFunction(this.color, cordIndex)) {
                this.indicator.style.display = 'none';
                return;
            }
            [x, y] = CORDS[this.color].finish[cordIndex];
        } else {
            if (this.field + moves >= 40) {
                this.finish = true;
                let cordIndex = this.field + moves - 40;
                if (cordIndex >= 4) {
                    this.indicator.style.display = 'none';
                    return;
                }

                if (!this.isFreeFunction(this.color, cordIndex)) {
                    this.indicator.style.display = 'none';
                    return;
                }

                [x, y] = CORDS[this.color].finish[cordIndex];
            } else {
                let cordIndex = this.field + moves + CORDS[this.color].offset;
                if (cordIndex >= CORDS.fields.length) {
                    cordIndex -= CORDS.fields.length;
                }
                [x, y] = CORDS.fields[cordIndex];
            }
        }

        this.indicator.style.left = `${x}%`;
        this.indicator.style.top = `${y}%`;
        this.indicator.style.backgroundColor = this.color;
        if (this.finish) {
            this.indicator.style.backgroundColor = 'black';
        }

        this.indicator.addEventListener('click', () => this.indicatorClick(moves, onClick));
    }
}