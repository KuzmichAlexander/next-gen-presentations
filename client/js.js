const HOST = location.origin.replace(/^http/, 'ws')
const socket = new WebSocket(HOST);
let el;

socket.onmessage = function (event) {
    el = document.getElementById('server-time');
    el.innerHTML = event.data;
};

document.addEventListener('click', () => {
    const message = {
        command: 'next'
    }
    socket.send(JSON.stringify(message));
})
