const ws = require('ws');

const wss = new ws.Server({
    port: 777
}, () => console.log('ws server started'))

wss.on('connection', () => {
    console.log('кто-то подключился');
});
