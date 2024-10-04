/**
 * Manages the scenes and interactions within the weather art studio.
 */
class WeatherArtStudio {
    constructor() {
        this.currentScene = 'sunny';
        this.scenes = {
            'sunny': [],
            'cloudy': [],
            'rainy': [],
            'snowy': []
        };
        this.dragContainer = document.getElementById('weather-scene');
        this.initEventListeners();
    }

    /**
     * Initializes event listeners for scene changes, file uploads, and showcase button.
     */
    initEventListeners() {
        document.getElementById('sceneSelector').addEventListener('change', () => this.changeScene());
        document.getElementById('upload-drawing').addEventListener('change', (e) => this.loadDrawing(e));
        document.querySelector('.showcase-button').addEventListener('click', () => this.openShowcase());
    }

    /**
     * Changes the current scene based on user selection.
     */
    changeScene() {
        const sceneSelector = document.getElementById('sceneSelector');
        this.currentScene = sceneSelector.value;
        this.updateScene();
    }

    /**
     * Updates the scene by clearing and re-rendering the draggable images.
     */
    updateScene() {
        this.clearContainer();
        this.renderScene();
    }

    /**
     * Clears all child elements from the drag container.
     */
    clearContainer() {
        this.dragContainer.innerHTML = '';
    }

    /**
     * Renders the current scene's images within the drag container.
     */
    renderScene() {
        this.scenes[this.currentScene].forEach(img => {
            this.dragContainer.appendChild(img);
            this.makeDraggable(img);
        });
    }

    /**
     * Loads and displays a user-uploaded image as part of the current scene.
     * @param {Event} e The event associated with the file input change.
     */
    loadDrawing(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.classList.add('draggable-image');
                img.style.cursor = 'grab';
                img.style.position = 'absolute';
                this.scenes[this.currentScene].push(img);
                this.renderScene();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file to load.');
        }
    }

    /**
     * Makes an element draggable within the container.
     * @param {HTMLElement} element The element to make draggable.
     */
    makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });

        element.addEventListener('dragstart', e => e.preventDefault());
    }

    /**
     * Displays the showcase area.
     */
    openShowcase() {
        const showcaseContainer = document.getElementById('showcase-area');
        showcaseContainer.style.display = 'block';
    }
}

// Initialize the WeatherArtStudio instance to handle the functionality.
new WeatherArtStudio();
