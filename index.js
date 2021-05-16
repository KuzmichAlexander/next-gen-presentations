const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/client/index.html';
const PresentationModel = require('./PresentationModel/PresentationState');
const clientType = require("./utils/ClientTypes");

const state = new PresentationModel();

const { Server } = require('ws');

const server = express()
    .use(express.json())
    .use('/client', express.static('client'))
    .post('/accesscode', (req, res) => {
        const {code} = req.body;
        const clientType = accessCodeParser(code);
        // console.log(code, clientType);
        res.send({clientType});
    })
    .use((req, res) => {
        res.sendFile(INDEX, { root: __dirname })
    })
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

function accessCodeParser(code) {
    switch (code) {
        case remoteCode:
            return clientType.remote;
        case watcherCode:
            return clientType.watcher;
        default:
            return clientType.unknown;
    }
}

const remoteCode = 'qqq';
const watcherCode = 'www';

// setInterval(() => {
//     wss.clients.forEach((client) => {
//         client.send(new Date().toTimeString());
//     });
// }, 1000);



