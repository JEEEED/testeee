// Estado global da aplicação
window.appState = {
    currentTool: 'brush',
    currentColor: '#000000',
    brushSize: 5,
    isDrawing: false,
    currentFrame: 0,
    currentLayer: 0,
    fps: 12,
    onionSkin: {
        enabled: false,
        opacity: 0.3
    }
};

// Elementos globais
window.canvas = document.getElementById('canvas');
window.ctx = canvas.getContext('2d');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando aplicação...');
    setupTools();
    setupToolEvents();
});

function setupTools() {
    const tools = document.querySelectorAll('.tool-btn');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            // Remover classe active de todas as ferramentas
            tools.forEach(t => t.classList.remove('active'));
            // Adicionar classe active na ferramenta selecionada
            tool.classList.add('active');
            // Atualizar ferramenta atual
            window.appState.currentTool = tool.dataset.tool;
            console.log('Ferramenta selecionada:', window.appState.currentTool);
        });
    });

    // Configurar color picker
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.addEventListener('change', (e) => {
            window.appState.currentColor = e.target.value;
            console.log('Cor selecionada:', window.appState.currentColor);
        });
    }

    // Configurar brush size
    const brushSize = document.getElementById('brushSize');
    if (brushSize) {
        brushSize.addEventListener('input', (e) => {
            window.appState.brushSize = parseInt(e.target.value);
            console.log('Tamanho do pincel:', window.appState.brushSize);
        });
    }
}

function setupToolEvents() {
    const canvas = document.getElementById('canvas');

    // Mousedown
    canvas.addEventListener('mousedown', (e) => {
        console.log('Ferramenta atual:', window.appState.currentTool); // Debug
        
        switch(window.appState.currentTool) {
            case 'brush':
                window.brush.startDrawing(e);
                break;
            case 'eraser':
                console.log('Iniciando borracha...'); // Debug
                window.eraser.startErasing(e);
                break;
            case 'fill':
                window.fill.fill(e);
                break;
        }
    });

    // Mousemove
    canvas.addEventListener('mousemove', (e) => {
        switch(window.appState.currentTool) {
            case 'brush':
                window.brush.draw(e);
                break;
            case 'eraser':
                window.eraser.erase(e);
                break;
        }
    });

    // Mouseup
    canvas.addEventListener('mouseup', () => {
        switch(window.appState.currentTool) {
            case 'brush':
                window.brush.stopDrawing();
                break;
            case 'eraser':
                window.eraser.stopErasing();
                break;
        }
    });

    // Mouseout
    canvas.addEventListener('mouseout', () => {
        switch(window.appState.currentTool) {
            case 'brush':
                window.brush.stopDrawing();
                break;
            case 'eraser':
                window.eraser.stopErasing();
                break;
        }
    });
}
    