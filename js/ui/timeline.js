class Timeline {
    constructor() {
        // Elementos do DOM
        this.container = document.getElementById('framesContainer');
        this.addFrameBtn = document.getElementById('addFrame');
        this.playButton = document.getElementById('playButton');
        
        // Estado local
        this.frames = [];
        this.isPlaying = false;
        
        this.setupEventListeners();
        this.addFrame(); // Criar primeiro frame
        
        console.log('Timeline inicializada');
    }

    setupEventListeners() {
        // Adicionar frame
        this.addFrameBtn.addEventListener('click', () => {
            console.log('Clique no botão de adicionar frame');
            this.addFrame();
        });
        
        // Play/Pause
        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.togglePlay());
        }
    }

    addFrame() {
        console.log('Adicionando novo frame...');
        
        // Salvar frame atual
        if (this.frames.length > 0) {
            this.saveCurrentFrame();
        }
        
        // Criar novo frame
        const frameData = {
            id: Date.now(),
            imageData: null
        };
        
        // Limpar canvas
        window.ctx.fillStyle = '#FFFFFF';
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        
        this.frames.push(frameData);
        window.appState.currentFrame = this.frames.length - 1;
        
        this.updateFramesContainer();
        console.log('Frame adicionado, total:', this.frames.length);
    }

    saveCurrentFrame() {
        const currentIndex = window.appState.currentFrame;
        if (currentIndex >= 0 && currentIndex < this.frames.length) {
            this.frames[currentIndex].imageData = window.canvas.toDataURL();
            this.updateFramesContainer();
        }
    }

    updateFramesContainer() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        this.frames.forEach((frame, index) => {
            const frameEl = this.createFrameElement(frame, index);
            this.container.appendChild(frameEl);
        });
    }

    createFrameElement(frame, index) {
        const frameEl = document.createElement('div');
        frameEl.className = 'frame';
        if (index === window.appState.currentFrame) {
            frameEl.classList.add('active');
        }
        
        frameEl.innerHTML = `
            <div class="frame-number">${index + 1}</div>
            <canvas class="frame-preview" width="120" height="90"></canvas>
        `;
        
        // Preview
        if (frame.imageData) {
            const preview = frameEl.querySelector('.frame-preview');
            const previewCtx = preview.getContext('2d');
            const img = new Image();
            img.onload = () => {
                previewCtx.drawImage(
                    img, 
                    0, 0, window.canvas.width, window.canvas.height,
                    0, 0, preview.width, preview.height
                );
            };
            img.src = frame.imageData;
        }
        
        // Evento de clique
        frameEl.addEventListener('click', () => this.selectFrame(index));
        
        return frameEl;
    }

    selectFrame(index) {
        if (index === window.appState.currentFrame) return;
        
        this.saveCurrentFrame();
        window.appState.currentFrame = index;
        
        if (this.frames[index].imageData) {
            const img = new Image();
            img.onload = () => {
                window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
                window.ctx.drawImage(img, 0, 0);
            };
            img.src = this.frames[index].imageData;
        }
        
        this.updateFramesContainer();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playButton = document.getElementById('playButton');
        
        if (this.isPlaying) {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            this.playAnimation();
        } else {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    playAnimation() {
        if (!this.isPlaying) return;
        if (this.frames.length <= 1) {
            this.isPlaying = false;
            return;
        }

        const nextFrame = (window.appState.currentFrame + 1) % this.frames.length;
        this.selectFrame(nextFrame);

        setTimeout(() => {
            if (this.isPlaying) {
                requestAnimationFrame(() => this.playAnimation());
            }
        }, 1000 / window.appState.fps);
    }
}

// Criar instância quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando Timeline...');
    window.timeline = new Timeline();
}); 