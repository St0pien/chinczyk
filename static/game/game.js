import HttpClient from "../utils/httpclient.js";
import PlayerBar from "./components/PlayerBar.js";
import Board from "./components/Board.js";
import Dice from "./components/Dice.js";
import WinScreen from "./components/WinnerScreen.js";

class App {
    constructor() {
        this.httpClient = new HttpClient("/api/game/");
        this.playerBar = new PlayerBar(".players");
        this.board = new Board('.board', '/assets/board.png');
        this.dice = new Dice('.dice', '/assets/dice/');
        this.winScreen = new WinScreen();
    }

    init() {
        const callback = async () => {
            const status = await this.httpClient.get('status');
            this.playerBar.update(status);
            this.board.update(status);
            this.dice.update(status);
            this.winScreen.update(status);
            console.log(status);
        }
        callback();
        this.interval = setInterval(callback, 1000);
    }
}

const app = new App();
app.init();
