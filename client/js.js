const HOST = location.origin.replace(/^http/, 'ws')
let socket;

function socketConnect() {
    socket = new WebSocket(HOST);
}

function setRemoteController () {
    socketConnect();
    renderSlideCounter();

    socket.onmessage = function (event) {
        const {data: currSlide} = event;
        document.getElementById('current-frame').innerHTML = `Текущий слайд: ${currSlide}`;
    };

    drawRemote(socket);
}

function renderSlideCounter() {
    const currentSlideCounter = document.createElement('div');
    currentSlideCounter.id = 'current-frame';
    document.body.appendChild(currentSlideCounter);
}

function createModal() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('modal-wrapper');
    document.body.appendChild(wrapper);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    wrapper.appendChild(modal);

    const title = document.createElement('h1');
    title.classList.add('modal-title');
    title.textContent = 'Код доступа к сиськам:';
    modal.appendChild(title);

    const form = document.createElement('form');
    modal.appendChild(form);

    const input = document.createElement('input');
    input.classList.add('modal-input');
    input.placeholder = '4RR4e33iwrwe3$$';
    // input.value = 'qqq';
    form.appendChild(input);
    input.focus();
    input.addEventListener('input', clearWarnMessage);

    const button = document.createElement('button');
    button.type = 'submit';
    button.classList.add('modal-button');
    button.textContent = 'Подключиться';
    form.appendChild(button);

    form.addEventListener('submit', codeRequest);

    modal.addEventListener('click', function (e){
        e.stopPropagation();
    })

    wrapper.addEventListener('click', closeModal)

    function closeModal(){
        wrapper.remove();
    }

    async function codeRequest(e) {
        e.preventDefault();
        const {data} = await axios.post('/accesscode', {code: input.value});
        switch (data.clientType) {
            case "remote":
                closeModal();
                setRemoteController();
                break;
            case "watcher":
                const {data: slides} = await axios.get('/presentationSlides/0');
                closeModal();
                renderSlides(slides);
                break;
            case "unknown":
                setWarnMessage(modal, data.message);
                break;
            default:
                throw new Error('This client type is not defined');
        }
    }
}

function renderSlides(slides) {
    socketConnect();

    socket.onmessage = function (event) {
        const {data: currSlide} = event;
        window.location.hash = currSlide;
    };

    const slidesContainer = document.createElement('div');
    slidesContainer.classList.add('slides-container');
    slides.forEach((slideImage, index) => {
        const slide = document.createElement('div');
        slide.classList.add('presentation-slide');
        slide.id = index;
        slide.style.backgroundColor = `rgb(${Math.trunc(Math.random() * 255)} ${Math.trunc(Math.random() * 255)} ${Math.trunc(Math.random() * 255)})`
        //slide.style.backgroundImage = `url(${slideImage})`;
        slidesContainer.appendChild(slide);
    });
    document.body.appendChild(slidesContainer);
}

function setWarnMessage(ctx, message) {
    const warnMessage = document.createElement('p');
    warnMessage.classList.add('message-warn');
    warnMessage.textContent = message;
    ctx.appendChild(warnMessage);
}

function clearWarnMessage() {
    const node = document.querySelector('.message-warn');
    if (node) {
        node.remove();
    }
}

function drawRemote(socket) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('remote-controller-wrapper');

    const nextButton = document.createElement('div');
    nextButton.classList.add('remote-button', 'remote-controller-next');
    wrapper.appendChild(nextButton);
    nextButton.addEventListener("click", function (){
        const message = {
            command: 'next'
        }
        socket.send(JSON.stringify(message));
    })

    const triangleUp = document.createElement('div');
    triangleUp.classList.add('triangle-up', 'triangle');
    nextButton.appendChild(triangleUp);

    const prevButton = document.createElement('div');
    prevButton.classList.add('remote-button', 'remote-controller-prev');
    wrapper.appendChild(prevButton);
    prevButton.addEventListener("click", function (){
        const message = {
            command: 'prev'
        }
        socket.send(JSON.stringify(message));
    })

    const triangleDown = document.createElement('div');
    triangleDown.classList.add('triangle-down', 'triangle');
    prevButton.appendChild(triangleDown);

    document.body.appendChild(wrapper);
}

createModal();
