import * as THREE from 'three';
import type { CharacterType } from '../storyboard/types';


// Helper to draw pixel rectangles on a 64x64 canvas
function fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Generates procedural pixel-perfect 64x64 textures for standard Minecraft characters
export function generateCharacterSkinCanvas(type: CharacterType): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Clear with transparent
  ctx.clearRect(0, 0, 64, 64);

  if (type === 'steve') {
    // === STEVE SKIN ===
    const skinTone = '#c68c53';
    const skinShadow = '#a87342';
    const hairColor = '#3a2312';
    const eyeWhite = '#ffffff';
    const eyeBlue = '#2b3990';
    const shirtTeal = '#00a3a9';
    const shirtShadow = '#007b80';
    const pantsBlue = '#2b3b80';
    const pantsShadow = '#1d2757';
    const shoeGrey = '#535353';

    // Head (0,0 to 32,16)
    // Top & Bottom hair/neck
    fillRect(ctx, 8, 0, 8, 8, hairColor);
    fillRect(ctx, 16, 0, 8, 8, skinTone);
    // Right, Front, Left, Back
    fillRect(ctx, 0, 8, 8, 8, skinTone); // Right
    fillRect(ctx, 0, 8, 8, 3, hairColor);
    fillRect(ctx, 8, 8, 8, 8, skinTone); // Front Face
    fillRect(ctx, 8, 8, 8, 2, hairColor); // Hair fringe
    fillRect(ctx, 8, 10, 1, 1, hairColor);
    fillRect(ctx, 15, 10, 1, 1, hairColor);
    // Eyes
    fillRect(ctx, 9, 11, 2, 1, eyeWhite);
    fillRect(ctx, 10, 11, 1, 1, eyeBlue);
    fillRect(ctx, 13, 11, 2, 1, eyeWhite);
    fillRect(ctx, 13, 11, 1, 1, eyeBlue);
    // Nose & mouth/beard
    fillRect(ctx, 11, 12, 2, 1, skinShadow);
    fillRect(ctx, 10, 13, 4, 1, '#663b1e');
    fillRect(ctx, 11, 14, 2, 1, '#472813');

    fillRect(ctx, 16, 8, 8, 8, skinTone); // Left
    fillRect(ctx, 16, 8, 8, 3, hairColor);
    fillRect(ctx, 24, 8, 8, 8, hairColor); // Back

    // Torso (16,16 to 40,32)
    fillRect(ctx, 20, 16, 8, 4, shirtTeal); // Top shoulder
    fillRect(ctx, 28, 16, 8, 4, shirtShadow); // Bottom waist
    fillRect(ctx, 16, 20, 4, 12, shirtTeal); // Right side
    fillRect(ctx, 20, 20, 8, 12, shirtTeal); // Front
    // V-neck skin
    fillRect(ctx, 23, 20, 2, 2, skinTone);
    fillRect(ctx, 28, 20, 4, 12, shirtTeal); // Left side
    fillRect(ctx, 32, 20, 8, 12, shirtTeal); // Back

    // Right Arm (40,16 to 56,32)
    fillRect(ctx, 44, 16, 4, 4, shirtTeal); // Top shoulder
    fillRect(ctx, 48, 16, 4, 4, skinTone); // Bottom fist
    fillRect(ctx, 40, 20, 4, 4, shirtTeal); // Sleeve
    fillRect(ctx, 40, 24, 4, 8, skinTone); // Arm
    fillRect(ctx, 44, 20, 4, 4, shirtTeal);
    fillRect(ctx, 44, 24, 4, 8, skinTone);
    fillRect(ctx, 48, 20, 4, 4, shirtTeal);
    fillRect(ctx, 48, 24, 4, 8, skinTone);
    fillRect(ctx, 52, 20, 4, 4, shirtTeal);
    fillRect(ctx, 52, 24, 4, 8, skinTone);

    // Left Arm (32,48 to 48,64)
    fillRect(ctx, 36, 48, 4, 4, shirtTeal);
    fillRect(ctx, 40, 48, 4, 4, skinTone);
    fillRect(ctx, 32, 52, 4, 4, shirtTeal);
    fillRect(ctx, 32, 56, 4, 8, skinTone);
    fillRect(ctx, 36, 52, 4, 4, shirtTeal);
    fillRect(ctx, 36, 56, 4, 8, skinTone);
    fillRect(ctx, 40, 52, 4, 4, shirtTeal);
    fillRect(ctx, 40, 56, 4, 8, skinTone);
    fillRect(ctx, 44, 52, 4, 4, shirtTeal);
    fillRect(ctx, 44, 56, 4, 8, skinTone);

    // Right Leg (0,16 to 16,32)
    fillRect(ctx, 4, 16, 4, 4, pantsBlue);
    fillRect(ctx, 8, 16, 4, 4, shoeGrey);
    fillRect(ctx, 0, 20, 4, 10, pantsBlue);
    fillRect(ctx, 0, 30, 4, 2, shoeGrey);
    fillRect(ctx, 4, 20, 4, 10, pantsBlue);
    fillRect(ctx, 4, 30, 4, 2, shoeGrey);
    fillRect(ctx, 8, 20, 4, 10, pantsBlue);
    fillRect(ctx, 8, 30, 4, 2, shoeGrey);
    fillRect(ctx, 12, 20, 4, 10, pantsBlue);
    fillRect(ctx, 12, 30, 4, 2, shoeGrey);

    // Left Leg (16,48 to 32,64)
    fillRect(ctx, 20, 48, 4, 4, pantsBlue);
    fillRect(ctx, 24, 48, 4, 4, shoeGrey);
    fillRect(ctx, 16, 52, 4, 10, pantsBlue);
    fillRect(ctx, 16, 62, 4, 2, shoeGrey);
    fillRect(ctx, 20, 52, 4, 10, pantsBlue);
    fillRect(ctx, 20, 62, 4, 2, shoeGrey);
    fillRect(ctx, 24, 52, 4, 10, pantsBlue);
    fillRect(ctx, 24, 62, 4, 2, shoeGrey);
    fillRect(ctx, 28, 52, 4, 10, pantsBlue);
    fillRect(ctx, 28, 62, 4, 2, shoeGrey);

  } else if (type === 'alex') {
    // === ALEX SKIN ===
    const skinTone = '#f0c09e';
    const hairColor = '#d9631e';
    const eyeGreen = '#1e7f3c';
    const shirtGreen = '#527c38';
    const pantsBrown = '#513d29';
    const boots = '#443224';

    // Head
    fillRect(ctx, 8, 0, 8, 8, hairColor);
    fillRect(ctx, 16, 0, 8, 8, skinTone);
    fillRect(ctx, 0, 8, 8, 8, hairColor);
    fillRect(ctx, 8, 8, 8, 8, skinTone);
    fillRect(ctx, 8, 8, 8, 3, hairColor);
    // Eyes
    fillRect(ctx, 9, 11, 2, 1, '#ffffff');
    fillRect(ctx, 10, 11, 1, 1, eyeGreen);
    fillRect(ctx, 13, 11, 2, 1, '#ffffff');
    fillRect(ctx, 13, 11, 1, 1, eyeGreen);
    fillRect(ctx, 16, 8, 8, 8, hairColor);
    fillRect(ctx, 24, 8, 8, 8, hairColor);

    // Torso
    fillRect(ctx, 20, 16, 8, 4, shirtGreen);
    fillRect(ctx, 28, 16, 8, 4, '#385526');
    fillRect(ctx, 16, 20, 4, 12, shirtGreen);
    fillRect(ctx, 20, 20, 8, 12, shirtGreen);
    fillRect(ctx, 28, 20, 4, 12, shirtGreen);
    fillRect(ctx, 32, 20, 8, 12, shirtGreen);

    // Arms
    fillRect(ctx, 40, 20, 16, 12, skinTone);
    fillRect(ctx, 40, 20, 16, 4, shirtGreen);
    fillRect(ctx, 32, 52, 16, 12, skinTone);
    fillRect(ctx, 32, 52, 16, 4, shirtGreen);

    // Legs
    fillRect(ctx, 0, 20, 16, 12, pantsBrown);
    fillRect(ctx, 0, 29, 16, 3, boots);
    fillRect(ctx, 16, 52, 16, 12, pantsBrown);
    fillRect(ctx, 16, 61, 16, 3, boots);

  } else if (type === 'zombie') {
    // === ZOMBIE SKIN ===
    const greenSkin = '#447432';
    const darkGreen = '#305423';
    const shirtBlue = '#00a3a9';
    const pantsPurple = '#3c3258';

    // Head
    fillRect(ctx, 0, 0, 32, 16, greenSkin);
    // Mottled hair
    fillRect(ctx, 8, 0, 8, 8, darkGreen);
    fillRect(ctx, 8, 8, 8, 2, darkGreen);
    // Dark sunken eyes
    fillRect(ctx, 9, 11, 2, 1, '#000000');
    fillRect(ctx, 13, 11, 2, 1, '#000000');
    // Nose
    fillRect(ctx, 11, 12, 2, 1, darkGreen);

    // Torso (Cyan/Teal shirt)
    fillRect(ctx, 16, 16, 24, 16, shirtBlue);

    // Arms (Green zombie arms)
    fillRect(ctx, 40, 16, 16, 16, greenSkin);
    fillRect(ctx, 40, 20, 16, 4, shirtBlue); // Torn sleeve
    fillRect(ctx, 32, 48, 16, 16, greenSkin);
    fillRect(ctx, 32, 52, 16, 4, shirtBlue);

    // Legs (Purple/dark pants)
    fillRect(ctx, 0, 16, 16, 16, pantsPurple);
    fillRect(ctx, 16, 48, 16, 16, pantsPurple);

  } else if (type === 'creeper') {
    // === CREEPER SKIN ===
    // Mottled green camouflage pattern
    const greens = ['#45a83a', '#54b948', '#388e2f', '#2a7023', '#68cd5a'];
    for (let y = 0; y < 64; y += 2) {
      for (let x = 0; x < 64; x += 2) {
        const color = greens[(x * 7 + y * 13) % greens.length];
        fillRect(ctx, x, y, 2, 2, color);
      }
    }

    // Iconic Creeper Face on Front of Head (x: 8 to 16, y: 8 to 16)
    // Eyes: 2x2 black
    fillRect(ctx, 9, 10, 2, 2, '#000000');
    fillRect(ctx, 13, 10, 2, 2, '#000000');
    // Nose bridge: 2x1 black
    fillRect(ctx, 11, 12, 2, 1, '#000000');
    // Mouth outer/down:
    fillRect(ctx, 10, 13, 4, 2, '#000000');
    fillRect(ctx, 9, 14, 2, 2, '#000000');
    fillRect(ctx, 13, 14, 2, 2, '#000000');
  }

  return canvas;
}

// Create a Three.js texture with NearestFilter (crisp pixel aesthetic)
export function createPixelTexture(source: HTMLCanvasElement | HTMLImageElement): THREE.CanvasTexture | THREE.Texture {
  const texture = new THREE.CanvasTexture(source);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Load custom user skin from base64 Data URL or File Blob
export function loadCustomSkinTexture(dataUrl: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;

      // Handle legacy 64x32 skins by converting them to 64x64
      if (img.height === 32) {
        ctx.drawImage(img, 0, 0);
        // Duplicate arms and legs to the lower 64x64 half
        // Right Leg -> Left Leg
        ctx.drawImage(canvas, 0, 16, 16, 16, 16, 48, 16, 16);
        // Right Arm -> Left Arm
        ctx.drawImage(canvas, 40, 16, 16, 16, 32, 48, 16, 16);
      } else {
        ctx.drawImage(img, 0, 0, 64, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve(texture);
    };
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });
}
