class Exporter {
    constructor() {
        this.setupExportButtons();
    }

    setupExportButtons() {
        // Adicionar botões de exportação ao DOM
        const exportContainer = document.createElement('div');
        exportContainer.className = 'export-buttons';
        exportContainer.innerHTML = `
            <button id="exportPNG" title="Exportar PNG">
                <i class="fas fa-file-image"></i> PNG
            </button>
            <button id="exportSequence" title="Exportar Sequência PNG">
                <i class="fas fa-images"></i> Sequência
            </button>
            <button id="exportGIF" title="Exportar GIF">
                <i class="fas fa-film"></i> GIF
            </button>
        `;

        document.querySelector('.timeline-controls').appendChild(exportContainer);

        // Adicionar event listeners
        document.getElementById('exportPNG').onclick = () => this.exportPNG();
        document.getElementById('exportSequence').onclick = () => this.exportSequence();
        document.getElementById('exportGIF').onclick = () => this.exportGIF();
    }

    exportPNG() {
        // Mesclar todas as camadas visíveis
        const mergedCanvas = layerManager.mergeVisibleLayers();
        
        // Criar link de download
        const link = document.createElement('a');
        link.download = `frame-${state.currentFrame + 1}.png`;
        link.href = mergedCanvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async exportSequence() {
        // Criar ZIP
        const zip = new JSZip();
        const currentFrame = state.currentFrame;

        // Salvar cada frame
        for (let i = 0; i < frames.length; i++) {
            timeline.selectFrame(i);
            await new Promise(resolve => setTimeout(resolve, 100)); // Esperar carregar
            
            const mergedCanvas = layerManager.mergeVisibleLayers();
            const imageData = mergedCanvas.toDataURL('image/png').split(',')[1];
            
            // Adicionar ao ZIP com nome padronizado
            const fileName = `frame-${String(i + 1).padStart(4, '0')}.png`;
            zip.file(fileName, imageData, {base64: true});
        }

        // Gerar e baixar ZIP
        zip.generateAsync({type: 'blob'}).then(content => {
            const link = document.createElement('a');
            link.download = 'animation-sequence.zip';
            link.href = URL.createObjectURL(content);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            // Voltar para o frame original
            timeline.selectFrame(currentFrame);
        });
    }

    exportGIF() {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
        });

        const exportButton = document.getElementById('exportGIF');
        const originalText = exportButton.innerHTML;
        exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
        exportButton.disabled = true;

        // Salvar frame atual
        const currentFrame = state.currentFrame;
        let processedFrames = 0;

        // Adicionar cada frame ao GIF
        frames.forEach((frame, index) => {
            timeline.selectFrame(index);
            
            setTimeout(() => {
                const mergedCanvas = layerManager.mergeVisibleLayers();
                gif.addFrame(mergedCanvas, {delay: 1000 / state.fps});
                processedFrames++;

                if (processedFrames === frames.length) {
                    gif.render();
                }
            }, 100 * index);
        });

        // Quando o GIF estiver pronto
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'animation.gif';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Restaurar botão e frame
            exportButton.innerHTML = originalText;
            exportButton.disabled = false;
            timeline.selectFrame(currentFrame);
        });

        // Em caso de erro
        gif.on('error', function(error) {
            console.error('Erro ao gerar GIF:', error);
            exportButton.innerHTML = originalText;
            exportButton.disabled = false;
            timeline.selectFrame(currentFrame);
        });
    }

    // Utilitários
    addCSSStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .export-buttons {
                display: flex;
                gap: 10px;
            }

            .export-buttons button {
                padding: 5px 10px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .export-buttons button:hover {
                background: var(--accent-color);
            }

            .export-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .export-buttons i {
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar exportador
const exporter = new Exporter();
exporter.addCSSStyles(); 