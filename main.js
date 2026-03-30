import { Pair } from "./components/pair.js"
import { fetchJSON } from "./fonctions/api.js"
import { cloneTemplate, loadingScreen, toggleVisibility } from "./fonctions/dom.js"

/**@type {HTMLElement} */
const container = document.querySelector('.container')

container.dataset.boxnumber = 6;
container.dataset.imgtype = 'jump';

// Objet qui gère l'instance de Pair (permet la mise à jour)
const gameManager = {
    pair: new Pair(container),
    setPair(newPair) {
        this.pair = newPair;
    }
}

/** Selection des rubriques */
const buttons = document.querySelectorAll('.difficulties, .themes');
toggleVisibility(buttons, '.button', gameManager, container);

/** Gestion des screens */
/** Construction objet */
const buttonScreen = {
    start_button: "screen_game",
    restart_button: "screen_welcome"
}
loadingScreen(buttonScreen, gameManager, container);