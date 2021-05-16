const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/client/index.html';
const PresentationModel = require('./PresentationModel/PresentationState');

const state = new PresentationModel();

const { Server } = require('ws');

const server = express()
    .use('/client', express.static('client'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const {command} = JSON.parse(message);
        state.commandHandler(command);

        broadcast();
    });

    ws.on('close', () => console.log('Client disconnected'));
});

function broadcast () {
    wss.clients.forEach(client => {
        client.send(state.getCurrentFrame().toString())
    });
}

// setInterval(() => {
//     wss.clients.forEach((client) => {
//         client.send(new Date().toTimeString());
//     });
// }, 1000);



