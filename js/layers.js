function initializeLayers() {
    console.log('Inicializando camadas...');
    if (layers.length === 0) {
        addLayer();
    }
}

function addLayer() {
    console.log('Adicionando nova camada...');
    
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = canvas.width;
    layerCanvas.height = canvas.height;
    
    const layer = {
        id: Date.now(),
        canvas: layerCanvas,
        ctx: layerCanvas.getContext('2d'),
        visible: true
    };
    
    layers.push(layer);
    currentLayer = layers.length - 1;
    
    console.log('Nova camada adicionada:', currentLayer);
    return layer;
}

function updateMainCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    layers.forEach(layer => {
        if (layer.visible) {
            ctx.drawImage(layer.canvas, 0, 0);
        }
    });
} 