// Configurações das ferramentas
const tools = {
    brush: {
        name: 'Pincel',
        icon: '🖌️',
        cursor: 'crosshair'
    },
    eraser: {
        name: 'Borracha',
        icon: '🧹',
        cursor: 'crosshair'
    }
};

// Onion Skin
function updateOnionSkin() {
    if (!onionSkinEnabled) {
        updateMainCanvas();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar frame anterior
    if (currentFrame > 0) {
        ctx.globalAlpha = onionSkinOpacity;
        const prevFrame = frames[currentFrame - 1];
        if (prevFrame && prevFrame.layers) {
            prevFrame.layers.forEach(layerData => {
                if (layerData.data) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                        drawCurrentFrame();
                    };
                    img.src = layerData.data;
                }
            });
        }
    }

    drawCurrentFrame();
}

function drawCurrentFrame() {
    // Desenhar camadas atuais com opacidade normal
    ctx.globalAlpha = 1;
    layers.forEach(layer => {
        if (layer.visible) {
            ctx.drawImage(layer.canvas, 0, 0);
        }
    });
}

// Estabilizador de linha
function getStabilizedPoints(points) {
    if (!stabilizer.enabled || points.length < 2) return points;

    const result = [];
    const weight = stabilizer.level / 10; // Converter nível em peso

    for (let i = 0; i < points.length; i++) {
        if (i === 0 || i === points.length - 1) {
            result.push(points[i]);
            continue;
        }

        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const smoothX = curr.x + (next.x - prev.x) * weight;
        const smoothY = curr.y + (next.y - prev.y) * weight;

        result.push({ x: smoothX, y: smoothY });
    }

    return result;
}

// Exportação
function prepareForExport() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');

    // Mesclar todas as camadas visíveis
    layers.forEach(layer => {
        if (layer.visible) {
            exportCtx.globalAlpha = layer.opacity;
            exportCtx.drawImage(layer.canvas, 0, 0);
        }
    });

    return exportCanvas;
}

function exportFrame(format = 'png') {
    const exportCanvas = prepareForExport();
    const dataURL = exportCanvas.toDataURL(`image/${format}`);
    
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `frame_${currentFrame + 1}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Ferramentas auxiliares
function createColorPalette() {
    const defaultColors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
        '#808000', '#008000', '#800080', '#008080', '#000080'
    ];

    const palette = document.createElement('div');
    palette.className = 'color-palette';

    defaultColors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;
        colorButton.onclick = () => {
            currentColor = color;
            document.getElementById('colorPicker').value = color;
        };
        palette.appendChild(colorButton);
    });

    return palette;
}

// Cursores personalizados
function updateCursor() {
    const size = brushSize;
    const cursorCanvas = document.createElement('canvas');
    cursorCanvas.width = size * 2 + 2;
    cursorCanvas.height = size * 2 + 2;
    const cursorCtx = cursorCanvas.getContext('2d');

    cursorCtx.beginPath();
    cursorCtx.arc(size + 1, size + 1, size, 0, Math.PI * 2);
    cursorCtx.strokeStyle = '#000';
    cursorCtx.stroke();
    cursorCtx.beginPath();
    cursorCtx.arc(size + 1, size + 1, size - 1, 0, Math.PI * 2);
    cursorCtx.strokeStyle = '#fff';
    cursorCtx.stroke();

    const cursorUrl = cursorCanvas.toDataURL();
    canvas.style.cursor = `url(${cursorUrl}) ${size + 1} ${size + 1}, crosshair`;
}

// Atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'z':
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                    e.preventDefault();
                    break;
                case 'y':
                    redo();
                    e.preventDefault();
                    break;
                case 's':
                    exportFrame();
                    e.preventDefault();
                    break;
            }
        } else {
            switch(e.key) {
                case '[':
                    if (brushSize > 1) brushSize--;
                    updateCursor();
                    break;
                case ']':
                    brushSize++;
                    updateCursor();
                    break;
                case 'e':
                    currentTool = 'eraser';
                    updateToolButtons();
                    break;
                case 'b':
                    currentTool = 'brush';
                    updateToolButtons();
                    break;
            }
        }
    });
}

function updateToolButtons() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === currentTool);
    });
}

// Inicializar ferramentas
function initializeTools() {
    updateCursor();
    setupKeyboardShortcuts();
    
    // Adicionar paleta de cores
    const toolsContainer = document.querySelector('.tools');
    const palette = createColorPalette();
    toolsContainer.insertBefore(palette, document.getElementById('colorPicker').parentNode);
} 