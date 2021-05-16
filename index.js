const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/client/index.html';
const PresentationModel = require('./PresentationModel/PresentationState');
const clientTypes = require("./utils/ClientTypes");

const state = new PresentationModel();

const { Server } = require('ws');

const server = express()
    .use(express.json())
    .use('/client', express.static('client'))
    .post('/accesscode', (req, res) => {
        const {code} = req.body;
        const clientType = accessCodeParser(code);
        let message = clientType === clientTypes.unknown ? 'Неверный код доступа' : 'success';

        console.log(code, clientType, message);
        res.send({clientType, message});
    })
    .use((req, res) => {
        res.sendFile(INDEX, { root: __dirname })
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));


const wss = new Server({ server });

wss.on('connection', (ws) => {
    broadcast();

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
            return clientTypes.remote;
        case watcherCode:
            return clientTypes.watcher;
        default:
            return clientTypes.unknown;
    }
}

const remoteCode = 'qqq';
const watcherCode = 'www';
