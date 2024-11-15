// Variáveis de desenho
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Funções principais de desenho
function startDrawing(e) {
    console.log('Iniciando desenho...');
    isDrawing = true;
    const point = getCanvasPoint(e);
    lastX = point.x;
    lastY = point.y;
    
    if (!layers[currentLayer]) {
        console.error('Camada atual não existe!');
        return;
    }
    
    const layerCtx = layers[currentLayer].ctx;
    layerCtx.beginPath();
    layerCtx.moveTo(point.x, point.y);
    drawPoint(layerCtx, point.x, point.y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    
    if (!layers[currentLayer]) {
        console.error('Camada atual não existe!');
        return;
    }
    
    const layerCtx = layers[currentLayer].ctx;
    drawPoint(layerCtx, point.x, point.y);
    
    lastX = point.x;
    lastY = point.y;
    
    updateMainCanvas();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    
    // Salvar o estado do frame atual
    saveCurrentFrame();
}

// Funções auxiliares
function getCanvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function drawPoint(ctx, x, y) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
    } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Adicionar event listeners diretamente ao canvas
function setupDrawingListeners() {
    console.log('Configurando event listeners de desenho...');
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

// Chamar setup quando o documento carregar
document.addEventListener('DOMContentLoaded', setupDrawingListeners);

// Função para atualizar o preview do frame
function updateFramePreview(frameElement, index) {
    const previewCanvas = frameElement.querySelector('.frame-preview');
    const ctx = previewCanvas.getContext('2d');
    
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    layers.forEach(layer => {
        if (layer.visible) {
            ctx.drawImage(
                layer.canvas,
                0, 0, canvas.width, canvas.height,
                0, 0, previewCanvas.width, previewCanvas.height
            );
        }
    });
}

// Função para atualizar o canvas principal
function updateMainCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    layers.forEach(layer => {
        if (layer.visible) {
            ctx.drawImage(layer.canvas, 0, 0);
        }
    });
} 