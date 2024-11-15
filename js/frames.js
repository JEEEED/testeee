function initializeFrames() {
    console.log('Inicializando frames...');
    if (frames.length === 0) {
        addFrame();
    }
}

function addFrame() {
    console.log('Adicionando novo frame...');
    
    // Criar estrutura do frame
    const frameData = {
        layers: [],
        thumbnail: null
    };

    // Salvar estado atual das camadas
    layers.forEach(layer => {
        frameData.layers.push({
            imageData: layer.canvas.toDataURL(),
            visible: layer.visible
        });
    });

    // Criar elemento visual do frame
    const frameElement = document.createElement('div');
    frameElement.className = 'frame';
    frameElement.innerHTML = `
        <div class="frame-number">${frames.length + 1}</div>
        <canvas class="frame-preview" width="100" height="100"></canvas>
        <div class="frame-controls">
            <button class="frame-delete">🗑️</button>
            <button class="frame-duplicate">📋</button>
        </div>
    `;

    // Adicionar event listeners
    frameElement.addEventListener('click', () => selectFrame(frames.length));
    
    // Atualizar preview
    const previewCanvas = frameElement.querySelector('.frame-preview');
    const previewCtx = previewCanvas.getContext('2d');
    layers.forEach(layer => {
        if (layer.visible) {
            previewCtx.drawImage(
                layer.canvas,
                0, 0, canvas.width, canvas.height,
                0, 0, previewCanvas.width, previewCanvas.height
            );
        }
    });

    frameData.thumbnail = frameElement;
    frames.push(frameData);
    document.getElementById('timeline').appendChild(frameElement);

    // Limpar camadas para o novo frame
    layers.forEach(layer => {
        layer.ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    updateMainCanvas();

    console.log('Frame adicionado. Total de frames:', frames.length);
}

function selectFrame(index) {
    console.log('Selecionando frame:', index);
    if (index < 0 || index >= frames.length) return;

    // Salvar frame atual
    if (currentFrame < frames.length) {
        frames[currentFrame].layers = layers.map(layer => ({
            imageData: layer.canvas.toDataURL(),
            visible: layer.visible
        }));
    }

    currentFrame = index;

    // Carregar novo frame
    const frame = frames[index];
    layers.forEach((layer, i) => {
        if (frame.layers[i]) {
            const img = new Image();
            img.onload = () => {
                layer.ctx.clearRect(0, 0, canvas.width, canvas.height);
                layer.ctx.drawImage(img, 0, 0);
                layer.visible = frame.layers[i].visible;
                updateMainCanvas();
            };
            img.src = frame.layers[i].imageData;
        }
    });

    // Atualizar visual
    document.querySelectorAll('.frame').forEach((f, i) => {
        f.classList.toggle('active', i === index);
    });
}

// Adicionar event listener para o botão de novo frame
document.getElementById('addFrame').addEventListener('click', addFrame); 