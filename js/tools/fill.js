class Fill {
    constructor() {
        this.tolerance = 32;
    }

    fill(e) {
        const point = this.getCanvasPoint(e);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const targetColor = this.getPixel(imageData, point.x, point.y);
        const fillColor = this.hexToRgb(window.appState.currentColor);

        this.floodFill(imageData, point.x, point.y, targetColor, fillColor);
        ctx.putImageData(imageData, 0, 0);

        if (window.timeline) {
            window.timeline.saveCurrentFrame();
        }
    }

    floodFill(imageData, startX, startY, targetColor, fillColor) {
        const pixels = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const stack = [[startX, startY]];

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const pos = (y * width + x) * 4;

            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            if (!this.matchesColor(pixels, pos, targetColor)) continue;

            pixels[pos] = fillColor.r;
            pixels[pos + 1] = fillColor.g;
            pixels[pos + 2] = fillColor.b;
            pixels[pos + 3] = 255;

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    getPixel(imageData, x, y) {
        const pos = (y * imageData.width + x) * 4;
        return {
            r: imageData.data[pos],
            g: imageData.data[pos + 1],
            b: imageData.data[pos + 2],
            a: imageData.data[pos + 3]
        };
    }

    matchesColor(pixels, pos, targetColor) {
        return (
            Math.abs(pixels[pos] - targetColor.r) <= this.tolerance &&
            Math.abs(pixels[pos + 1] - targetColor.g) <= this.tolerance &&
            Math.abs(pixels[pos + 2] - targetColor.b) <= this.tolerance &&
            Math.abs(pixels[pos + 3] - targetColor.a) <= this.tolerance
        );
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    getCanvasPoint(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: Math.floor((e.clientX - rect.left) * scaleX),
            y: Math.floor((e.clientY - rect.top) * scaleY)
        };
    }
}

// Criar instância quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando Fill...');
    window.fill = new Fill();
}); 