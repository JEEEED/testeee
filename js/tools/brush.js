class Brush {
    constructor() {
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Vincular eventos do canvas
        this.bindEvents();
    }

    bindEvents() {
        const canvas = document.getElementById('canvas');
        
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Prevenir comportamento padrão de arrastar
        canvas.addEventListener('dragstart', (e) => e.preventDefault());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const point = this.getCanvasPoint(e);
        this.lastX = point.x;
        this.lastY = point.y;
        this.drawPoint(point.x, point.y); // Para desenhar pontos únicos
    }

    draw(e) {
        if (!this.isDrawing) return;

        const point = this.getCanvasPoint(e);
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = window.appState.currentColor;
        ctx.lineWidth = window.appState.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        this.lastX = point.x;
        this.lastY = point.y;
    }

    drawPoint(x, y) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, window.appState.brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = window.appState.currentColor;
        ctx.fill();
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        // Salvar o frame atual quando parar de desenhar
        if (window.timeline) {
            window.timeline.saveCurrentFrame();
        }
    }

    getCanvasPoint(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
}

// Criar instância do pincel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando Brush...');
    window.brush = new Brush();
}); 