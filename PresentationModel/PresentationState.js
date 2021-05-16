const commands = require('../utils/commands')

class PresentationState {
    #currentFrame = 0;

    #nextFrame() {
        this.#currentFrame += 1;
    }

    #prevFrame() {
        this.#currentFrame -= 1;
    }

    commandHandler(command) {
        switch (command) {
            case commands.next:
                this.#nextFrame();
                break;
            case commands.prev:
                this.#prevFrame();
                break;
            case commands.toStart:
                this.#currentFrame = 0;
                break;
            default:
                break;
        }
    }

    getCurrentFrame() {
        return this.#currentFrame;
    }
}

module.exports = PresentationState;
