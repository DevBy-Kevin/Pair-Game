import { fetchJSON } from "../fonctions/api.js";
import { cloneTemplate, createElement, defineAttribut } from "../fonctions/dom.js";

export class Pair {

    /**@type {string} */
    #API_KEY = '53003120-dc599f4b1a43daab957c1ed40';
    /**@type {number} */
    #boxNumber
    /**@type {string} */
    #imgType
    /**@type {HTMLElement} */
    #container
    /**@type {Array} */
    #boxes = []
    /**@type {String} */
    #endpoint
    /**@type {number|null} */
    #timer = null
    // /**@type {HTMLTemplateElement} */
    // #template
    // /**@type {HTMLElement} */
    // #target

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.#container = element
        this.#boxNumber = element.dataset.boxnumber
        this.#imgType = element.dataset.imgtype
        this.#endpoint = element.dataset.endpoint + this.#API_KEY + `&q=${encodeURIComponent(this.#imgType)}&per_page=${this.#boxNumber}`
        // this.#template = element.dataset.template
        // this.#target = document.querySelector(element.dataset.target)
        this.#loading(element) //A revérifier si #container ou element
    }

    /**
     * La fonction de chargement des images et de création des boxes avec gestion d'erreur
     * @param {HTMLElement} elt 
     */
    async #loading(elt) {
        try {
            let images = await fetchJSON(this.#endpoint);
            images = images.hits
            for (const img of images) {
                const box = new EachBox(img)
                box.elements.forEach(box => this.#boxes.push(box))
                // box.elements.forEach(element => elt.append(element))
            }
            this.#randomPosition(this.#boxes, elt); //Mélanger les boxes et les inserer dans le DOM
            this.#countDown(Number(document.querySelector('.difficulties .button.active')?.dataset.time) || 30); // temps en secondes
        } catch (error) {
            console.log(error)
            /**@type {HTMLDivElement} */
            const message = createElement('div', {
                'class': 'error alert'
            })
            message.innerHTML = 'Chargement Impossible, Vérifier votre connexion et ressayer <span class="delete">⛌</span>';
            elt.append(message)
        }
    }

    /**
     * Mélanger les boxes et les inserer dans le DOM
     * @param {Array} boxes 
     * @param {HTMLElement} container 
     */
    #randomPosition(boxes, container) { //Ca peut y aller si on fait de EachBox un composant enfant de Pair, sinon il faudrait faire une fonction de mélange dans EachBox qui mélangerait son propre tableau d'éléments (this.#elements) et le renverrait pour l'insertion dans le DOM  
        for (let i = boxes.length - 1; i > 0; i--) { // Avec aussi pour l'avantage de l'utiliser lors de la difficulté "difficile si l'utilisateur l'active" pour mélanger les boxes déjà présentes
            const j = Math.floor(Math.random() * (i + 1));
            [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
        }

        // Réinsertion dans le DOM dans le nouvel ordre
        boxes.forEach(el => container.appendChild(el));
    }

    /**
     * @param {number} remainingTime 
     * @returns {number}
     */
    #countDown(remainingTime) {
        this.#timer = setInterval(() => {
            if (remainingTime <= 0 || !(document.querySelector('.box:not(.success)'))) { //Il faut éviter le cas où le temps est exactement à 0 et que le joueur vient de trouver la dernière paire, ce qui serait une victoire
                clearInterval(this.#timer);
                this.#gameResult(remainingTime);
                return;
            }

            remainingTime--;

            // Formatage du temps en minutes et seconds
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            // Mise à jour de l'affichage du temps
            const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            document.querySelectorAll('span.time').forEach(span => span.innerText = time);
        }, 1000);

        return remainingTime;
    }

    /**
     * Arrête la partie et nettoie le décompteur
     * //parce que si on ne nettoie pas le timer, il continue de tourner en arrière plan 
     * et peut causer des problèmes de performance ou de logique dans le jeu 
     * si le joueur recommence une partie ou change de difficulté/thème, 
     * ce qui réinitialise le timer sans nettoyer l'ancien.
     */
    stop() {
        if (this.#timer !== null) {
            clearInterval(this.#timer);
            this.#timer = null;
        }
    }

    /**
     * @param {number} Time
     */
    #gameResult(Time) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('screen_hide');
        })
        /** GAME OVER */
        if (Time <= 0) { //Il faut éviter le cas où le temps est exactement à 0 et que le joueur vient de trouver la dernière paire, ce qui serait une victoire
            document.querySelector('.screen_gameover').classList.remove('screen_hide');
            return;
        }
        /** GAME WIN */
        document.querySelector('.screen_victory').classList.remove('screen_hide');
    }

}


export class EachBox { //extends Pair
    // Shared state across all EachBox instances so the "previous clicked"
    // card is remembered globally within the game container.
    static lastElementDataId = null
    static lastElementId = null
    // compteur pour générer des id uniques à la création des boxes
    /**@type {number} */
    static creationCounter = 0
    // compteur séparé pour ordonner les paires trouvées
    /**@type {number} */
    static pairOrderCounter = 0
    // compteur pour compter le nombre de coup de tentatives
    /**@type {number} */
    static strokesCounter = 0

    /**@type {boolean} */
    static isLocked = false;
    /**@type {HTMLCollection} */
    #elements = []
    /**@type {Boolean} */
    #isVisible = false
    /**@type {Function} */
    #clickListener = null

    /**
     * LA CONSTRUCTION DE CHAQUE BOX AVEC LES DEUX IMAGES (face et dos) ET LEURS ATTRIBUTS
     * @param {Object} img 
     */
    constructor(img) {
        for (let i = 0; i < 2; i++) {
            EachBox.creationCounter++
            const box = cloneTemplate('box').firstElementChild
            defineAttribut(box, {
                'data-id': img.id,
                'id': `box-${EachBox.creationCounter}`
            })
            const image = box.querySelector('img')
            defineAttribut(image, {
                'src': img.previewURL, //webformatURL largeImageURL previewURL
                'alt': img.tags // Si possible mettre une contrôle en place pour éviter les alt trop long qui pourraient casser la mise en page
            })
            this.#elements.push(box)
        }

        this.#clickListener = (e) => this.#onClick(e); // Nécessaire pour pouvoir faire référence à la même fonction lors de l'ajout et de la suppression d'évenements
        this.#elements.forEach(elt => elt.addEventListener('click', this.#clickListener))
    }


    /**
     * Return the two boxes for their insertions
     * @return {HTMLElement} 
     */
    get elements() {
        return this.#elements
    }

    /**
     * @param {PointerEvent} event 
     */
    #onClick(event) {
        //La gestion de plusieurs clique
        if (EachBox.isLocked) return;
        EachBox.isLocked = true;

        const box = event.currentTarget
        const container = box.parentElement

        /**Si cliqué la révélation */
        event.preventDefault();
        box.querySelectorAll('*').forEach(elt => {
            elt.classList.toggle('display')
        });
        box.classList.toggle('visible')

        //Savoir si la carte précédente est visible avec le lastElemendId (static proprety) commun à tous
        this.#isVisible = container.querySelector(`#${EachBox.lastElementId}`)?.classList.contains('visible');

        if ((EachBox.lastElementDataId === box.dataset.id) && // ceci teste si les deux cartes ont le même data-id, donc sont une paire
            (EachBox.lastElementId !== box.getAttribute('id')) && // ceci teste si les deux cartes ne sont pas la même carte (évite de cliquer deux fois sur la même carte pour faire une paire)
            (this.#isVisible)) { // ceci teste si la carte précédente est encore visible, donc que le joueur a cliqué deux cartes différentes et que les deux cartes sont une paire
            this.#isPair(container)
        } else {
            setTimeout(() => {
                this.#closeOtherBoxes(box)
            }, 500) //800 A revoir après
        }

        /**Pour gérer les stats */
        //Le mieux serait de renvoyer les données et de les mettre à jour dans main.js pour éviter de faire du code métier dans le composant, mais pour l'instant je vais faire comme ça pour aller plus vite, à revoir après
        EachBox.strokesCounter++;
        const strokes = EachBox.strokesCounter < 10 ? '0' + EachBox.strokesCounter : EachBox.strokesCounter;
        document.querySelectorAll('span.strokes').forEach(span => span.innerText = strokes)
        document.querySelector('#precision').innerText = `${Math.ceil(((Number(document.querySelector('.difficulties .button.active')?.dataset.difficulty) || 6) / EachBox.strokesCounter) * 100)}%`

        /**Pour gérer les second retrouvés : mettre à jour l'état partagé */
        EachBox.lastElementDataId = box.dataset.id
        EachBox.lastElementId = box.getAttribute('id')

        //Gestion de plusieurs clique
        setTimeout(() => {
            EachBox.isLocked = false
        }, 500) //800
    }

    /**
     * @param {HTMLElement} currentBox 
     */
    #closeOtherBoxes(currentBox) {
        const container = currentBox.parentElement
        container.querySelectorAll('.box:not(.success)').forEach(sibling => { //sibling === frères
            if ((sibling !== currentBox)) {
                sibling.querySelector('.click-text').classList.remove('display')
                sibling.querySelector('.img').classList.add('display')
                sibling.classList.remove('visible') //Pour s'assurer
            }
        })
    }

    #isPair(currentContainer) {
        currentContainer.querySelectorAll(`[data-id="${EachBox.lastElementDataId}"]`).forEach(matchedBox => {
            matchedBox.removeEventListener('click', this.#clickListener);
            matchedBox.classList.add('success');

            // incrémenter le compteur de paires trouvées et appliquer l'ordre
            EachBox.pairOrderCounter++;
            matchedBox.style.order = `-${EachBox.pairOrderCounter}`;
        })
    }
}