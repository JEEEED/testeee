class Eraser {
    constructor() {
        this.isErasing = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    startErasing(e) {
        this.isErasing = true;
        const point = this.getCanvasPoint(e);
        this.lastX = point.x;
        this.lastY = point.y;
        this.erasePoint(point.x, point.y);
    }

    erase(e) {
        if (!this.isErasing) return;

        const point = this.getCanvasPoint(e);
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = window.appState.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();

        this.lastX = point.x;
        this.lastY = point.y;
    }

    erasePoint(x, y) {
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, window.appState.brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();
    }

    stopErasing() {
        if (!this.isErasing) return;
        this.isErasing = false;
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

window.eraser = new Eraser(); 