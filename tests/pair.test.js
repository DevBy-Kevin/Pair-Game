import { Pair, EachBox } from '../components/pair.js';

class TestRunner {
    constructor() {
        this.passedTests = 0;
        this.failedTests = 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    async runTest(testName, testFn) {
        try {
            await testFn();
            console.log(`✅ ${testName} : Succès`);
            this.passedTests++;
        } catch (error) {
            console.error(`❌ ${testName} : Échec`);
            console.error('   Erreur:', error.message);
            this.failedTests++;
        }
    }

    summary() {
        console.log('\n=== Résumé des tests ===');
        console.log(`Tests réussis: ${this.passedTests}`);
        console.log(`Tests échoués: ${this.failedTests}`);
        console.log('=====================\n');
    }
}

const runner = new TestRunner();

// Configuration initiale pour les tests
function createMockContainer() {
    const container = document.createElement('div');
    container.dataset.boxnumber = '4';
    container.dataset.imgtype = 'book';
    container.dataset.endpoint = 'https://pixabay.com/api/?key=';
    return container;
}

// Tests de la classe Pair
async function testPairConstructor() {
    await runner.runTest('Construction Pair - Paramètres valides', () => {
        const container = createMockContainer();
        const pair = new Pair(container);
        runner.assert(pair instanceof Pair, 'L\'instance devrait être créée correctement');
    });

    await runner.runTest('Construction Pair - Paramètres invalides', () => {
        let errorThrown = false;
        try {
            new Pair(null);
        } catch {
            errorThrown = true;
        }
        runner.assert(errorThrown, 'Devrait lever une erreur avec un élément invalide');
    });
}

// Tests de la classe EachBox
async function testEachBox() {
    await runner.runTest('Construction EachBox - Création des éléments', () => {
        const mockImage = {
            id: 1,
            previewURL: 'test.jpg',
            tags: 'test'
        };
        const box = new EachBox(mockImage);
        runner.assert(box.elements.length === 2, 'Devrait créer deux éléments');
        runner.assert(box.elements[0].dataset.id === '1', 'L\'ID devrait être correctement défini');
    });

    await runner.runTest('EachBox - Gestion du clic', () => {
        const mockImage = {
            id: 1,
            previewURL: 'test.jpg',
            tags: 'test'
        };
        const box = new EachBox(mockImage);
        const element = box.elements[0];
        
        // Simuler un clic
        const clickEvent = new Event('click');
        element.dispatchEvent(clickEvent);
        
        runner.assert(element.classList.contains('visible'), 'La carte devrait être visible après le clic');
    });
}

// Tests d'intégration
async function testGameLogic() {
    await runner.runTest('Logique de jeu - Paires correspondantes', () => {
        const container = createMockContainer();
        document.body.appendChild(container);
        
        const pair = new Pair(container);
        // Vérifier que les cartes correspondantes sont bien gérées
        // Simuler la découverte d'une paire...
        
        document.body.removeChild(container);
    });
}

// Exécution des tests
async function runAllTests() {
    console.log('=== Démarrage des tests ===\n');
    
    await testPairConstructor();
    await testEachBox();
    await testGameLogic();
    
    runner.summary();
}

// Lancer les tests quand le DOM est prêt
document.addEventListener('DOMContentLoaded', runAllTests);