class LayerManager {
    constructor() {
        this.layers = [];
        this.currentLayer = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addLayer').addEventListener('click', () => this.addLayer());
    }

    addLayer() {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = canvas.width;
        layerCanvas.height = canvas.height;

        const layer = {
            id: Date.now(),
            name: `Camada ${this.layers.length + 1}`,
            canvas: layerCanvas,
            ctx: layerCanvas.getContext('2d'),
            visible: true,
            opacity: 1
        };

        this.layers.push(layer);
        this.currentLayer = this.layers.length - 1;
        this.updateLayersList();
    }

    updateLayersList() {
        const layersList = document.getElementById('layersList');
        layersList.innerHTML = '';

        // Mostrar camadas de cima para baixo
        this.layers.slice().reverse().forEach((layer, reversedIndex) => {
            const index = this.layers.length - 1 - reversedIndex;
            const layerElement = this.createLayerElement(layer, index);
            layersList.appendChild(layerElement);
        });
    }

    createLayerElement(layer, index) {
        const div = document.createElement('div');
        div.className = 'layer-item' + (index === this.currentLayer ? ' active' : '');
        div.innerHTML = `
            <button class="layer-visibility" title="Mostrar/Ocultar">
                <i class="fas ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
            </button>
            <input type="text" class="layer-name" value="${layer.name}">
            <input type="range" class="layer-opacity" min="0" max="100" value="${layer.opacity * 100}">
            <button class="layer-delete" title="Excluir Camada">🗑️</button>
        `;

        // Event listeners
        div.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('input')) {
                this.selectLayer(index);
            }
        });

        div.querySelector('.layer-visibility').addEventListener('click', () => {
            this.toggleLayerVisibility(index);
        });

        div.querySelector('.layer-name').addEventListener('change', (e) => {
            layer.name = e.target.value;
        });

        div.querySelector('.layer-opacity').addEventListener('input', (e) => {
            layer.opacity = e.target.value / 100;
            updateCanvas();
        });

        div.querySelector('.layer-delete').addEventListener('click', () => {
            this.deleteLayer(index);
        });

        return div;
    }

    selectLayer(index) {
        if (index < 0 || index >= this.layers.length) return;
        this.currentLayer = index;
        this.updateLayersList();
    }

    toggleLayerVisibility(index) {
        const layer = this.layers[index];
        layer.visible = !layer.visible;
        this.updateLayersList();
        updateCanvas();
    }

    deleteLayer(index) {
        if (this.layers.length <= 1) return; // Manter pelo menos uma camada

        this.layers.splice(index, 1);
        if (this.currentLayer >= this.layers.length) {
            this.currentLayer = this.layers.length - 1;
        }

        this.updateLayersList();
        updateCanvas();
    }

    mergeVisibleLayers() {
        const mergedCanvas = document.createElement('canvas');
        mergedCanvas.width = canvas.width;
        mergedCanvas.height = canvas.height;
        const mergedCtx = mergedCanvas.getContext('2d');

        this.layers.forEach(layer => {
            if (layer.visible) {
                mergedCtx.globalAlpha = layer.opacity;
                mergedCtx.drawImage(layer.canvas, 0, 0);
            }
        });

        return mergedCanvas;
    }
}

const layerManager = new LayerManager(); 