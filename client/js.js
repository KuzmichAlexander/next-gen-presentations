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
});

function createModal() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('modal-wrapper');
    document.body.appendChild(wrapper);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    wrapper.appendChild(modal);

    const title = document.createElement('h1');
    title.classList.add('modal-title');
    title.textContent = 'Код доступа:';
    modal.appendChild(title);

    const form = document.createElement('form');
    modal.appendChild(form);

    const input = document.createElement('input');
    input.classList.add('modal-input');
    input.placeholder = '4RR4e33iwrwe3$$';
    form.appendChild(input);

    const button = document.createElement('button');
    button.type = 'submit';
    button.classList.add('modal-button');
    button.textContent = 'Подключиться';
    form.appendChild(button);

    form.addEventListener('submit', codeRequest);

    modal.addEventListener('click', function (e){
        e.stopPropagation();
    })

    wrapper.addEventListener('click', function (){
        wrapper.remove();
    })

    async function codeRequest(e) {
        e.preventDefault();
        const {data} = await axios.post('/accesscode', {code: input.value});
        console.log(data);
    }
}



createModal();
