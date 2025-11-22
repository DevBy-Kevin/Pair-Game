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
    /**@type {String} */
    #endpoint
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
        this.#loading(element)
    }

    /**
     * 
     * @param {HTMLElement} elt 
     */
    async #loading(elt) {
        try {
            let images = await fetchJSON(this.#endpoint);
            images = images.hits
            for (const img of images) {
                const box = new EachBox(img)
                box.elements.forEach(element => elt.append(element))
            }
        } catch (error) {
            console.log(error)
            /**@type {HTMLDivElement} */
            const message = createElement('div', {
                'class': 'error alert'
            })
            message.innerText = 'Chargement Impossible, Vérifier votre connexion et ressayer';
            elt.append(message)
        }
    }

}


export class EachBox {
    // Shared state across all EachBox instances so the "previous clicked"
    // card is remembered globally within the game container.
    static lastElementDataId = null
    static lastElementId = null
    /**@type {boolean} */
    static isLocked = false;
    /**@type {number} */
    static globalCounter = 0

    /**@type {HTMLCollection} */
    #elements = []
    /**@type {Boolean} */
    #isVisible = false
    /**@type {Function} */
    #clickListener = null

    /**
     * 
     * @param {Object} img 
     */
    constructor(img) {
        for (let i = 0; i < 2; i++) {
            EachBox.globalCounter++
            const box = cloneTemplate('box').firstElementChild
            defineAttribut(box, {
                'data-id': img.id,
                'id': `box-${EachBox.globalCounter}`
            })
            const image = box.querySelector('img')
            defineAttribut(image, {
                'src': img.previewURL, //webformatURL largeImageURL
                'alt': img.tags
            })
            this.#elements.push(box)
        }
        this.#clickListener = (e) => this.#onClick(e)
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
        
        if ((EachBox.lastElementDataId === box.dataset.id) && (EachBox.lastElementId !== box.getAttribute('id')) && (this.#isVisible)) {
            this.#isPair(container)
        } else {
            setTimeout(() => {
                this.#closeOtherBoxes(box)
            }, 800)
        }

        /**Pour gérer les second retrouvés : mettre à jour l'état partagé */
        EachBox.lastElementDataId = box.dataset.id
        EachBox.lastElementId = box.getAttribute('id')

        //Gestion de plusieurs clique
        setTimeout(() => {
            EachBox.isLocked = false
        }, 800)
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
        console.log('ça marche !!!!!!')
        currentContainer.querySelectorAll(`[data-id="${EachBox.lastElementDataId}"]`).forEach(box => {
            box.removeEventListener('click', this.#clickListener)
            box.classList.add('success')
        })
        EachBox.globalCounter++
        currentContainer.querySelectorAll('.success').forEach(box => box.style.order = `-${EachBox.globalCounter}`);
    }
}