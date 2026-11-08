// Pixel-art sprite definitions and drawing helpers for Kaium's Cover Pixel Runner
// Pure numeric/string matrices, zero image files, rendered directly to canvas.

export interface PixelSprite {
  width: number;
  height: number;
  rows: string[];
}

export type ThemeMode = 'light' | 'dark';

// Character color palette mapping
// S = Skin, H = Hair, G = Glasses, B = Suit, W = White collar, T = Purple tie, P = Pants, F = Shoes
export const getPalette = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  return {
    '.': 'transparent',
    'S': '#f59e0b', // Warm golden skin
    's': '#fde68a', // Skin highlight
    'H': isDark ? '#09090b' : '#18181b', // Jet black hair
    'G': '#38bdf8', // Cyan glasses frame/reflection
    'g': '#0284c7', // Glasses shadow
    'B': isDark ? '#27272a' : '#18181b', // Charcoal dark suit
    'b': isDark ? '#3f3f46' : '#27272a', // Suit highlight
    'W': '#ffffff', // White shirt
    'T': '#a855f7', // Purple tie
    't': '#7e22ce', // Purple tie shadow
    'P': isDark ? '#18181b' : '#09090b', // Pants
    'F': isDark ? '#09090b' : '#000000', // Dress shoes
    'L': isDark ? '#71717a' : '#52525b', // Laptop case
    'C': '#34d399', // Glowing emerald code screen
    'R': '#ef4444', // Red (alert/bug/failed)
    'r': '#b91c1c', // Dark red
    'Y': '#eab308', // Yellow (warning/candle)
    'y': '#ca8a04', // Dark yellow
    'K': isDark ? '#ffffff' : '#09090b', // Primary text/contrast
    'X': isDark ? '#a1a1aa' : '#52525b', // Secondary contrast
    'O': '#f97316', // Orange (Slack/hazard)
    'M': '#ec4899', // Magenta (Slack)
    'E': '#10b981', // Green (success)
  };
};

export type PaletteKey = keyof ReturnType<typeof getPalette>;

// 12px wide x 16px high character sprites
export const CHARACTER_SPRITES = {
  idle: {
    width: 12,
    height: 16,
    rows: [
      '....HHHH....',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HsGsGsGH..',
      '..HSSSSSSH..',
      '....SSSS....',
      '..bBWTWBb...',
      '..BBBTBBb...',
      '..BBBTBBB...',
      '..BBBBBBB...',
      '...PP.PP....',
      '...PP.PP....',
      '...PP.PP....',
      '...PP.PP....',
      '...FF.FF....',
      '..FFF.FFF...',
    ],
  },
  walk1: {
    width: 12,
    height: 16,
    rows: [
      '....HHHH....',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HsGsGsGH..',
      '..HSSSSSSH..',
      '....SSSS....',
      '..bBWTWBb...',
      '..BBBTBBb...',
      '..BBBTBBB...',
      '..BBBBBBB...',
      '...PPPP.....',
      '...PP.PP....',
      '..PP...PP...',
      '..PP...PP...',
      '.FFF...FFF..',
      'FFFF...FFFF.',
    ],
  },
  walk2: {
    width: 12,
    height: 16,
    rows: [
      '....HHHH....',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HsGsGsGH..',
      '..HSSSSSSH..',
      '....SSSS....',
      '..bBWTWBb...',
      '..BBBTBBb...',
      '..BBBTBBB...',
      '..BBBBBBB...',
      '.....PPPP...',
      '....PP.PP...',
      '...PP...PP..',
      '...PP...PP..',
      '..FFF...FFF.',
      '.FFFF...FFFF',
    ],
  },
  jump: {
    width: 12,
    height: 16,
    rows: [
      '....HHHH....',
      '..HHHHHHHH..',
      '..HsGsGsGH..',
      '..HSSSSSSH..',
      '.SbBWTWBbS..',
      '.SBBBTBBBS..',
      '..BBBTBBB...',
      '..BBBBBBB...',
      '...PPPPPP...',
      '..PPPPPPPP..',
      '..PP....PP..',
      '..PP....PP..',
      '..FF....FF..',
      '.FFF....FFF.',
      '............',
      '............',
    ],
  },
  duck: {
    width: 14,
    height: 10,
    rows: [
      '.....HHHH.....',
      '...HHHHHHHH...',
      '...HsGsGsGH...',
      '...HSSSSSSH...',
      '..bBWTWBb.....',
      '..BBBTBBb.LL..',
      '.BBBBBBBBBLL..',
      '.PPPPPPPPPPP..',
      'FFFF.....FFFF.',
      'FFFFF...FFFFFF',
    ],
  },
  sitLaptop: {
    width: 14,
    height: 16,
    rows: [
      '....HHHH......',
      '..HHHHHHHH....',
      '..HHSSSSHH....',
      '..HsGsGsGH....',
      '..HSSSSSSH....',
      '....SSSS......',
      '..bBWTWBb.....',
      '..BBBTBBb..C..',
      '..BBBTBBB.LL..',
      '..BBBBBBBBBLL.',
      '..PPPPPPPPPP..',
      '..PPPPPPPPPP..',
      '....PP....PP..',
      '....PP....PP..',
      '....FF....FF..',
      '...FFF...FFF..',
    ],
  },
  sleep: {
    width: 14,
    height: 16,
    rows: [
      '....HHHH......',
      '..HHHHHHHH....',
      '..HHSSSSHH....',
      '..HHs--sHH....',
      '..HSSSSSSH....',
      '....SSSS......',
      '..bBWTWBb.....',
      '..BBBTBBb.....',
      '..BBBTBBB.....',
      '..BBBBBBBB....',
      '..PPPPPPPPPP..',
      '..PPPPPPPPPP..',
      '....PP....PP..',
      '....PP....PP..',
      '...FFF...FFF..',
      '..FFFF..FFFF..',
    ],
  },
};

// Obstacles for the endless runner
export const OBSTACLES = {
  bug: {
    width: 8,
    height: 6,
    rows: [
      '.R....R.',
      '..RRRR..',
      '.RrRRrR.',
      'RRRRRRRR',
      'R.R..R.R',
      '.R....R.',
    ],
  },
  semicolon: {
    width: 5,
    height: 11,
    rows: [
      '.KKK.',
      '.KKK.',
      '.....',
      '.....',
      '.KKK.',
      '.KKK.',
      '..KK.',
      '..KK.',
      '.KK..',
      '.K...',
      '.....',
    ],
  },
  block404: {
    width: 14,
    height: 9,
    rows: [
      'KKKKKKKKKKKKKK',
      'K............K',
      'K.K.K.KKK.K.K.K',
      'K.K.K.K.K.K.K.K',
      'K.KKK.K.K.KKK.K',
      'K...K.K.K...K.K',
      'K...K.KKK...K.K',
      'K............K',
      'KKKKKKKKKKKKKK',
    ],
  },
  mergeConflict: {
    width: 16,
    height: 18,
    rows: [
      'R.R.............',
      '..R.R...........',
      '....R.R.........',
      '..R.R...........',
      'R.R.............',
      '................',
      '.KKKK.KKKK.KKKK.',
      '.K....K..K.K..K.',
      '.KK...KKKK.K..K.',
      '.K....K..K.K..K.',
      '................',
      '..YYYYYYYYYYYY..',
      '..YYYYYYYYYYYY..',
      '................',
      '....X.X.........',
      '..X.X...........',
      'X.X.............',
      '..X.X...........',
    ],
  },
  deployFriday: {
    width: 14,
    height: 18,
    rows: [
      '.....YYYY.....',
      '....YYYYYY....',
      '...YY.RR.YY...',
      '..YY..RR..YY..',
      '.YY...RR...YY.',
      '.YY...RR...YY.',
      'YY....RR....YY',
      'YY..........YY',
      'YY....RR....YY',
      'YYYYYYYYYYYYYY',
      '......KK......',
      '......KK......',
      '......KK......',
      '......KK......',
      '......KK......',
      '......KK......',
      '.....KKKK.....',
      '....KKKKKK....',
    ],
  },
  slackBird: {
    width: 12,
    height: 8,
    rows: [
      '....OOMM....',
      '...OOMMMME..',
      '..OOMMMMEECC',
      '.OOMMMMMEECC',
      '..EEMMMMEECC',
      '...EEMMEECC.',
      '....EECC....',
      '.....CC.....',
    ],
  },
  flyingUndefined: {
    width: 18,
    height: 8,
    rows: [
      'XXXXXXXXXXXXXXXXXX',
      'X................X',
      'X.u.n.d.e.f.i.n..X',
      'X.u.n.d.e.f.i.n..X',
      'X.u.n.d.e.f.i.n..X',
      'X.u.n.d.e.f.i.n..X',
      'X................X',
      'XXXXXXXXXXXXXXXXXX',
    ],
  },
  coffeeCup: {
    width: 9,
    height: 9,
    rows: [
      '..XX..XX.',
      '...XX..XX',
      '.KKKKKK..',
      '.KyyyyK.K',
      '.KyyyyKKK',
      '.KyyyyK.K',
      '.KyyyyK..',
      '..KKKK...',
      '.KKKKKK..',
    ],
  },
  candle: {
    width: 7,
    height: 11,
    rows: [
      '...Y...',
      '..YYY..',
      '..YYY..',
      '...K...',
      '..WWW..',
      '..WWW..',
      '..WWW..',
      '..WWW..',
      '..WWW..',
      '.WWWWW.',
      '.WWWWW.',
    ],
  },
};

// Draw a pixel sprite to a 2D canvas context at integer coordinates
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: PixelSprite,
  x: number,
  y: number,
  palette: Record<string, string>,
  scale = 1,
  flipX = false
) {
  const roundedX = Math.round(x);
  const roundedY = Math.round(y);

  for (let r = 0; r < sprite.rows.length; r++) {
    const row = sprite.rows[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      const color = palette[char];
      if (!color || color === 'transparent') continue;

      ctx.fillStyle = color;
      const targetCol = flipX ? sprite.width - 1 - c : c;
      ctx.fillRect(
        roundedX + targetCol * scale,
        roundedY + r * scale,
        scale,
        scale
      );
    }
  }
}
