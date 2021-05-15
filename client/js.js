const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);
let el;

ws.onmessage = function (event) {
    el = document.getElementById('server-time');
    el.innerHTML = 'Server time: ' + event.data;
};
