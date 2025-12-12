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