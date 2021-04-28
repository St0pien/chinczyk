const express = require('express');
const session = require('express-session');
const path = require('path');
const Player = require('./game/Player');
const { getFreeGame } = require('./utils');


const app = express();
const PORT = 3000 | process.env.PORT;

app.use(express.json());
app.use(session({
    secret: 'XyYRGaTQdPqkVP5fdfdMv44R3Le8Rwc49mQSOFWOGnAgB3KuYZuUo5eSoQVR',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}))

const games = [];

app.get('/', (req, res) => {
    if (req.session.nick) {
        res.redirect('/game');
    } else {
        res.sendFile(path.join(__dirname, 'static', 'index.html'));
    }
});

app.get('/game', (req, res) => {
    if (!req.session.nick) {
        res.redirect('/');
    } else {
        if (!req.session.gameid || !req.session.playerid) {
            const game = getFreeGame(games);
            const player= new Player(req.session.nick);
            req.session.playerid = player.id;
            game.addPlayer(player);
            req.session.gameid = game.id;
        }

        res.sendFile(path.join(__dirname, 'static', 'game', 'index.html'));
    }
});

app.use(express.static(path.join(__dirname, 'static')));

app.post('/api/nick', (req, res) => {
    const { nick } = req.body;

    if (nick) {
        req.session.nick = nick;
        res.send({
            status: "OK"
        })
        return;
    }

    res.status(400)
    res.send({
        status: ":<"
    });
});

app.get('/api/game/status', (req, res) => {
    const { gameid } = req.session;
    if (!gameid) {
        res.status(400);
        res.send("You haven't started any game");
        return;
    }

    const game = games.find(game => game.id == gameid);
    if (game) {
        const player = game.getPlayer(req.session.playerid);
        if (player) {
            const status = { player, game: game.getState() };
            res.send(JSON.stringify(status));
            return;
        }
    }

    res.send('No game :<');
});

app.post('/api/player/status', (req, res) => {
    const { gameid } = req.session;
    if (!gameid) {
        res.status(400);
        res.send("You haven't started any game");
    }

    const game = games.find(game => game.id == gameid);
    if (game) {
        game.updatePlayerStatus(req.session.playerid, req.body.ready);
        res.send({ status: `Your status updated` });
        return;
    }

    res.send("No game :<");

});

app.post('/api/player/move', (req, res) => {
    const { gameid } = req.session;
    if (!gameid) {
        res.status(400);
        res.send("You haven't started any game");
    }

    const game = games.find(g => g.id == gameid);
    if (game) {
        if (game.currentPlayer.id == req.session.playerid) {
            game.makeMove(req.body.id);
            res.send({ status: "OK" });
            return;
        }
    }

    res.send("Stop it!");
});

app.get('/api/game/dice', (req, res) => {
    const { gameid } = req.session;
    if (!gameid) {
        res.status(400);
        res.send("You haven't started any game");
    }

    const game = games.find(game => game.id == gameid);
    if (game) {
        if (game.currentPlayer.id == req.session.playerid) {
            const value = game.rollDice();
            res.send(JSON.stringify({
                movesToMake: value
            }));
            return;
        }
    }

    res.send("Stop it!");
});

app.get('/api/game/leave', (req, res) => {
    const { gameid } = req.session;
    if (!gameid) {
        res.status(400);
        res.send("You haven't started any game");
        return;
    }

    const game = games.find(game => game.id == gameid);
    if (game) {
        game.removePlayer(req.session.playerid);
        if (game.currentPlayer && game.currentPlayer.id == req.session.playerid) {
            game.nextPlayer();
        }
        req.session.gameid = null;
        req.session.playerid = null;
    }

    res.send('OK');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 