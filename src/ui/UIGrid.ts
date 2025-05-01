import Phaser from "phaser";

export class UIGrid {
    drawGridOverlay({
        scene,
        x,
        y,
        cellWidth,
        cellHeight,
        rows,
        cols,
        color = 0xffffff,
        alpha = 0.2,
        originX = 0.5,
        originY = 0.5,
        drawBorder = true
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        cellWidth: number;
        cellHeight: number;
        rows: number;
        cols: number;
        color?: number;
        alpha?: number;
        originX?: number;
        originY?: number;
        drawBorder?: boolean;
    }) {
        const graphics = scene.add.graphics();
        graphics.lineStyle(1, color, alpha);

        const totalWidth = cols * cellWidth;
        const totalHeight = rows * cellHeight;

        const offsetX = x - totalWidth * originX;
        const offsetY = y - totalHeight * originY;

        // Vertical lines
        for (let col = 0; col <= cols; col++) {
            const cx = offsetX + col * cellWidth;
            graphics.moveTo(cx, offsetY);
            graphics.lineTo(cx, offsetY + totalHeight);
        }

        // Horizontal lines
        for (let row = 0; row <= rows; row++) {
            const cy = offsetY + row * cellHeight;
            graphics.moveTo(offsetX, cy);
            graphics.lineTo(offsetX + totalWidth, cy);
        }

        graphics.strokePath();

        if (!drawBorder) {
            // Border
            const maskGraphics = scene.add.graphics();
            maskGraphics.fillStyle(0xffffff, 1);
            maskGraphics.fillRect(offsetX, offsetY, totalWidth - 1, totalHeight - 1);
            const mask = maskGraphics.createGeometryMask();
            graphics.setMask(mask);
        }

        return graphics;
    }
}

export const uiGrid = new UIGrid();