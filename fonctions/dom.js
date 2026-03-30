import { Pair, EachBox } from "../components/pair.js";
/**
 * @param {string} tagName 
 * @param {Object} attributes 
 */
export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);
    defineAttribut(element, attributes);
    return element;
}

/**
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function cloneTemplate(id) {
    return document.getElementById(id).content.cloneNode(true);
}

/**
 * @param {HTMLElement} tagName 
 * @param {Object} attributes 
 */
export function defineAttribut(tagName, attributes = {}) {
    for (const [attribut, value] of Object.entries(attributes)) {
        tagName.setAttribute(attribut, value);
    }
}

/**
 * Permet de gérer la visibilité des éléments d'une liste de parents en fonction d'un enfant cliqué,
 *  et de mettre à jour les données du container en conséquence
 * @param {NodeList} parents 
 * @param {HTMLElement} child 
 * @param {Object} gameManager
 * @param {HTMLElement} container
 */
export function toggleVisibility(parents, child, gameManager, container) {
    parents.forEach(parent => {
        parent.querySelectorAll(child).forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                /** Gestion de l'active */
                parent.querySelectorAll(child).forEach(el => el.classList.remove('active'));
                element.classList.add('active');

                /** Mise à jour des infos */
                udapteContainerData(container);

                /** Rechargement de la partie */
                const newPair = rechargeContainer(gameManager.pair, container);
                gameManager.setPair(newPair);
            });
        });
    });
}


/**
 * Met à jour les données du container en fonction des éléments actifs dans les rubriques de difficulté et de thème
 * @param {HTMLElement} container 
 */
export function udapteContainerData(container) {
    const difficulty =
        document.querySelector('.difficulties .button.active')?.dataset.difficulty;
    container.dataset.boxnumber = (() => {
        const value = Number(difficulty) / 2;
        return Number.isNaN(value) ? 6 : value;
    })();
    container.dataset.imgtype =
        document.querySelector('.themes .button.active')?.dataset.theme ?? 'animals'; 
}


/**
 * @param {Object} objet 
 * @param {Object} gameManager
 * @param {HTMLElement} container
 */
export function loadingScreen(objet = {}, gameManager, container) {
    for (const [id, screen] of Object.entries(objet)) {
        document.querySelectorAll(`#${id}`).forEach(el => el.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.screen').forEach(s => {
                s.classList.add('screen_hide');
            })
            document.getElementById(screen).classList.remove('screen_hide');

            // Si le bouton cliqué est le bouton de redémarrage, recharger la partie
            if (id === 'restart_button') {
                const newPair = rechargeContainer(gameManager.pair, container);
                gameManager.setPair(newPair);
            }
        }))
    }
}

/**
 * Utilisée pour recharger le container après un changement (proprement arrête l'ancienne partie et en crée une nouvelle)
 * @param {Pair} componentPair 
 * @param {HTMLElement} container 
 */
export function rechargeContainer(componentPair, container) {
    // Arrêter l'ancienne partie
    componentPair.stop();
    
    // Réinitialiser les compteurs statiques
    EachBox.creationCounter = 0;
    EachBox.pairOrderCounter = 0;
    EachBox.strokesCounter = 0;
    EachBox.lastElementDataId = null;
    EachBox.lastElementId = null;
    EachBox.isLocked = false;
    
    // Réinitialiser les affichages
    document.querySelectorAll('span.time').forEach(span => span.innerText = '00:00');
    document.querySelectorAll('span.strokes').forEach(span => span.innerText = '00');
    document.querySelector('#precision').innerText = '00%';
    
    // Vider et recréer le conteneur
    container.replaceChildren();
    
    // Créer une nouvelle partie
    return new Pair(container);
}