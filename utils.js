const Game = require("./game/Game");

function getFreeGame(games) {
    let game = games.find(game => game.isFree());
    if (!game) {
        game = new Game();
        games.push(game);
    }

    return game;
}

module.exports = {
    getFreeGame
}
