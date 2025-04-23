import { Noise } from "noisejs";

export function generatePerlinTexture(
    width: number,
    height: number,
    scale: number,
    baseColor: { r: number; g: number; b: number }
): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Can't get 2D context");

    const noise = new Noise(Math.random());

    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = noise.perlin2(x / scale, y / scale);
            const brightness = (value + 1) / 2;

            const r = baseColor.r * brightness;
            const g = baseColor.g * brightness;
            const b = baseColor.b * brightness;

            const index = (x + y * width) * 4;
            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}
