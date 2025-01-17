const fs = require('fs');
const { createCanvas } = require('canvas');

// Criar icon.png (1024x1024)
const iconCanvas = createCanvas(1024, 1024);
const iconCtx = iconCanvas.getContext('2d');
iconCtx.fillStyle = '#f4511e';
iconCtx.fillRect(0, 0, 1024, 1024);
fs.writeFileSync('./assets/icon.png', iconCanvas.toBuffer());

// Criar splash.png (2048x2048)
const splashCanvas = createCanvas(2048, 2048);
const splashCtx = splashCanvas.getContext('2d');
splashCtx.fillStyle = '#f4511e';
splashCtx.fillRect(0, 0, 2048, 2048);
fs.writeFileSync('./assets/splash.png', splashCanvas.toBuffer());

// Criar adaptive-icon.png (1024x1024)
const adaptiveCanvas = createCanvas(1024, 1024);
const adaptiveCtx = adaptiveCanvas.getContext('2d');
adaptiveCtx.fillStyle = '#f4511e';
adaptiveCtx.fillRect(0, 0, 1024, 1024);
fs.writeFileSync('./assets/adaptive-icon.png', adaptiveCanvas.toBuffer()); 