import { Pair } from "./components/pair.js"
import { fetchJSON } from "./fonctions/api.js"
import { cloneTemplate } from "./fonctions/dom.js"

// const boxNumber = prompt('Combien de case en voulez vous ?')
// const imgType = prompt("Quel type d'images aimeriez-vous ?")
const boxNumber = 4
const imgType = "click"

/**@type {HTMLElement} */
const container = document.querySelector('.container')

container.dataset.boxnumber = boxNumber;
container.dataset.imgtype = imgType;

new Pair(container)