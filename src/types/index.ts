export type CameraAngle = 'front' | 'back' | 'side' | 'cuff-detail';

export type LightingMode = 'soft-studio' | 'natural-daylight' | 'golden-hour' | 'runway-spotlight';

export type WeaveId = 
  | 'satin-silk'
  | 'herringbone-tweed'
  | 'plain-weave'
  | 'jacquard-silk'
  | 'linen-slub'
  | 'silk-twill';

export interface WeaveItem {
  id: WeaveId;
  name: string;
  category: string;
  weightGsm: number;
  sheen: number; // 0 to 1
  drapeTension: number; // 0 to 1
  threadDensity: string;
  description: string;
  origin: string;
  weaveStructure: 'warp-faced satin' | '2x2 herringbone' | '1x1 tabby' | 'figured jacquard' | 'plain slub' | '2x1 twill';
  microTexture: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  pantone: string;
  category: 'Atelier Signature' | 'Earth & Mineral' | 'Opulent Jewel';
  hsl: { h: number; s: number; l: number };
}

export interface PatternItem {
  id: string;
  name: string;
  category: 'Botanical' | 'Geometric' | 'Classic' | 'Atelier Artisanal' | 'Solid';
  thumbnailUrl: string;
  repeatSizeCm: number;
  style: string;
  svgPattern?: string;
  isSolid?: boolean;
}

export type GarmentZone = 'all' | 'cuff' | 'collar' | 'bodice' | 'sleeves';

export type ButtonFinish = 'mother-of-pearl' | 'brushed-brass' | 'carved-horn' | 'silk-covered';

export interface StudioState {
  weave: WeaveId;
  selectedColor: ColorSwatch;
  secondaryWeftColor?: string;
  isShotSilk: boolean;
  pattern: string; // pattern id
  patternScale: number; // percentage 50 - 250
  patternRotation: number; // 0 - 360
  patternOpacity: number; // 0 - 1
  cameraAngle: CameraAngle;
  lighting: LightingMode;
  sheenAdjust: number; // -50 to +50
  buttonFinish: ButtonFinish;
  activeZone: GarmentZone;
  selectedSize: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: number;
  title: string;
  detail: string;
  category: 'weave' | 'color' | 'pattern' | 'lighting' | 'angle' | 'detail';
  state: StudioState;
}

export interface CartItem {
  id: string;
  title: string;
  weaveName: string;
  colorName: string;
  pantone: string;
  colorHex: string;
  patternName: string;
  buttonFinish: string;
  size: string;
  price: number;
  quantity: number;
  thumbnail: string;
  timestamp: number;
}
