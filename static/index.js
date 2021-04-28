import Client from './utils/httpclient.js';

const nickButton = document.querySelector('#nickButton');
const nickInput = document.querySelector('#nickInput');
const client = new Client('/api/');

const post = () => {
    client.post({
        nick: nickInput.value
    }, 'nick/').then(data => {
        if (data.status == "OK") {
            location.replace('/game');
        }
    });
}

nickButton.addEventListener('click', () => {
    post();
});

addEventListener('keydown', e => {
    if (e.key == "Enter") {
        post();
    }
});
