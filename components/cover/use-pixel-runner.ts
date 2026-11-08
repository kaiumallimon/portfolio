// Hook & state machine driving the Cover Pixel Avatar & Endless Runner Game
// Features idle walking, climbing/sitting on the 'L' with laptop, random Dhaka-timezone jokes/events,
// and Chrome-dino-style endless runner with commit scoring and retro audio.

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CHARACTER_SPRITES,
  OBSTACLES,
  drawSprite,
  getPalette,
  ThemeMode,
  PixelSprite,
} from './sprites';
import { retroAudio } from './audio';

export type GameMode = 'idle' | 'running' | 'gameover';

interface ObstacleEntity {
  id: number;
  type: 'bug' | 'semicolon' | 'block404' | 'mergeConflict' | 'deployFriday' | 'slackBird' | 'flyingUndefined';
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: PixelSprite;
  isFlying: boolean;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  color?: string;
  lifetime: number;
}

const HIGH_SCORE_KEY = 'kal_runner_high_score';

export function usePixelRunner(theme: ThemeMode) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High score state (lazy initialized from localStorage)
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(() => retroAudio.getMuted());
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);
  const [speechBubble, setSpeechBubble] = useState<{ text: string; x: number; y: number } | null>(null);

  // Internal game engine references (mutable without re-rendering every frame)
  const engineRef = useRef({
    mode: 'idle' as GameMode,
    width: 320,
    height: 100,
    scale: 2,
    theme: theme,
    isHovered: false,
    isFocused: false,

    // Character state
    char: {
      x: 30,
      y: 70,
      vx: 0.6,
      vy: 0,
      isGrounded: true,
      isDucking: false,
      isJumping: false,
      state: 'walk' as 'idle' | 'walk' | 'walk1' | 'walk2' | 'sitLaptop' | 'jump' | 'duck' | 'sleep',
      facingLeft: false,
      animTimer: 0,
      walkFrame: 0,
      // Idle choreographies
      idleTimer: 0,
      targetX: 60,
      subState: 'walking' as 'walking' | 'paused' | 'going_to_L' | 'on_L' | 'squashing_bug' | 'coffee_break' | 'load_shedding',
      onLTimer: 0,
      nightSleeping: false,
    },

    // Runner game state
    speed: 2.8,
    score: 0,
    highScore: 0,
    distance: 0,
    obstacles: [] as ObstacleEntity[],
    floatingTexts: [] as FloatingText[],
    floorOffset: 0,
    nextObstacleDist: 90,
    nextObstacleId: 1,

    // Random events in idle
    eventTimer: 0,
    candleFlicker: false,
    candleX: 0,
    candleTimer: 0,
    bugEvent: null as { x: number; y: number; squashed: boolean; timer: number } | null,
    coffeeEvent: null as { x: number; y: number; active: boolean; timer: number } | null,

    // Sleep bubbles ("z"s)
    zTimer: 0,
    zList: [] as { x: number; y: number; size: number; alpha: number }[],

    // Performance & Lifecycle
    isRunning: true,
    reducedMotion: false,
    nextMilestone: 100,
  });

  // Sync high score and check reduced motion on mount
  useEffect(() => {
    engineRef.current.highScore = highScore;

    // Check reduced motion
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      engineRef.current.reducedMotion = media.matches;
      const handler = (e: MediaQueryListEvent) => {
        engineRef.current.reducedMotion = e.matches;
      };
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [highScore]);

  // Update theme reference inside engine
  useEffect(() => {
    engineRef.current.theme = theme;
  }, [theme]);

  // Dhaka night-time check (Asia/Dhaka timezone)
  const isDhakaNight = useCallback(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        hour12: false,
      });
      const hour = parseInt(formatter.format(new Date()), 10);
      // Night is between 11 PM (23) and 6 AM (6)
      return hour >= 23 || hour < 6;
    } catch {
      return false;
    }
  }, []);

  // Start Runner Game
  const startRunnerGame = useCallback(() => {
    const e = engineRef.current;
    if (e.mode === 'running') return;

    e.mode = 'running';
    setGameMode('running');
    e.score = 0;
    setCurrentScore(0);
    e.speed = 2.8;
    e.distance = 0;
    e.obstacles = [];
    e.floatingTexts = [];
    e.nextObstacleDist = 80;
    e.nextMilestone = 100;
    setMilestoneMsg(null);
    setSpeechBubble(null);

    // Reposition player at running starting spot
    e.char.x = 28;
    e.char.y = e.height - 24;
    e.char.vy = 0;
    e.char.isGrounded = true;
    e.char.isDucking = false;
    e.char.isJumping = false;
    e.char.facingLeft = false;
    e.char.state = 'walk';

    retroAudio.playScore();
  }, []);

  // Restart after game over
  const restartRunnerGame = useCallback(() => {
    startRunnerGame();
  }, [startRunnerGame]);

  // Return to Idle mode
  const returnToIdle = useCallback(() => {
    const e = engineRef.current;
    e.mode = 'idle';
    setGameMode('idle');
    e.char.y = e.height - 24;
    e.char.vy = 0;
    e.char.isGrounded = true;
    e.char.isDucking = false;
    e.char.isJumping = false;
    e.char.subState = 'walking';
    e.char.idleTimer = 0;
    setMilestoneMsg(null);
    setSpeechBubble(null);
  }, []);

  // Sound toggle
  const toggleSound = useCallback(() => {
    const muted = retroAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Show a speech bubble over character
  const triggerSpeechBubble = useCallback((text: string, durationMs = 2800) => {
    const e = engineRef.current;
    setSpeechBubble({
      text,
      x: e.char.x,
      y: Math.max(10, e.char.y - 18),
    });
    setTimeout(() => {
      setSpeechBubble(prev => (prev?.text === text ? null : prev));
    }, durationMs);
  }, []);

  // Character Click / Interact
  const handleCharacterClick = useCallback((clientX: number, clientY: number) => {
    const e = engineRef.current;

    if (e.mode === 'idle') {
      // Check if click was on or near the tiny character
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickCanvasX = (clientX - rect.left) / (rect.width / e.width);
        const clickCanvasY = (clientY - rect.top) / (rect.height / e.height);

        const dist = Math.hypot(clickCanvasX - (e.char.x + 6), clickCanvasY - (e.char.y + 8));

        // If clicked on character directly, start game!
        if (dist < 26) {
          startRunnerGame();
          return;
        }
      }

      // If clicked generally within cover, trigger funny developer quote bubble!
      const quotes = [
        "works on my machine",
        "git push --force",
        "404: sleep not found",
        "have you tried restarting?",
        "TODO: fix this later",
        "deploying straight to prod",
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      triggerSpeechBubble(randomQuote);
      retroAudio.playScore();
    } else if (e.mode === 'running') {
      // Tap on mobile triggers jump!
      if (e.char.isGrounded) {
        e.char.vy = -6.8;
        e.char.isGrounded = false;
        e.char.isJumping = true;
        retroAudio.playJump();
      }
    }
  }, [startRunnerGame, triggerSpeechBubble]);

  // Jump Action
  const triggerJump = useCallback(() => {
    const e = engineRef.current;
    if (e.mode === 'idle') {
      startRunnerGame();
      return;
    }
    if (e.mode === 'running' && e.char.isGrounded) {
      e.char.vy = -6.8;
      e.char.isGrounded = false;
      e.char.isJumping = true;
      e.char.isDucking = false;
      retroAudio.playJump();
    }
  }, [startRunnerGame]);

  // Duck Action
  const setDucking = useCallback((ducking: boolean) => {
    const e = engineRef.current;
    if (e.mode === 'running') {
      if (ducking && !e.char.isDucking) {
        retroAudio.playDuck();
      }
      e.char.isDucking = ducking;
    }
  }, []);

  // Main Canvas Game Loop & Animation Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const e = engineRef.current;
    let animationFrameId = 0;
    let gameOverTimeout = 0;

    // Responsive Canvas Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) continue;

        // Use internal virtual resolution (scaled 2x for crisp pixel density)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        // Store virtual game dimensions
        e.width = Math.round(width / 2);
        e.height = Math.round(height / 2);
        e.scale = 2;
      }
    });
    resizeObserver.observe(container);

    // IntersectionObserver to pause loop when cover is scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      entries => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        e.isRunning = isVisible && !document.hidden;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      e.isRunning = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Keyboard handlers (Strictly scoped: Space/Arrow keys only hijack when focused or running)
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === ' ' || ev.key === 'ArrowUp' || ev.key === 'w' || ev.key === 'W') {
        if (e.mode === 'running' || e.isFocused || e.isHovered) {
          ev.preventDefault();
          triggerJump();
        }
      } else if (ev.key === 'ArrowDown' || ev.key === 's' || ev.key === 'S') {
        if (e.mode === 'running') {
          ev.preventDefault();
          setDucking(true);
        }
      }
    };

    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === 'ArrowDown' || ev.key === 's' || ev.key === 'S') {
        setDucking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop tick
    const tick = () => {
      if (!e.isRunning) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const palette = getPalette(e.theme);
      const isDark = e.theme === 'dark';

      // Clear virtual canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale to integer virtual coordinates
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.scale(dpr * 2, dpr * 2);

      const floorY = e.height - 20;

      // -------------------------------------------------------------
      // 1. IDLE MODE LOGIC
      // -------------------------------------------------------------
      if (e.mode === 'idle') {
        const night = isDhakaNight();
        e.char.nightSleeping = night;

        if (e.reducedMotion) {
          // Static character when reduced motion is preferred
          e.char.x = Math.round(e.width * 0.45);
          e.char.y = floorY - 16;
          drawSprite(ctx, CHARACTER_SPRITES.idle, e.char.x, e.char.y, palette, 1, false);
          animationFrameId = requestAnimationFrame(tick);
          return;
        }

        e.char.animTimer++;
        if (e.char.animTimer % 8 === 0) {
          e.char.walkFrame = (e.char.walkFrame + 1) % 2;
        }

        // Night time sleepy behavior
        if (night) {
          e.char.state = 'sleep';
          e.char.y = floorY - 16;
          e.zTimer++;
          if (e.zTimer % 35 === 0) {
            e.zList.push({
              x: e.char.x + 8,
              y: e.char.y - 4,
              size: 5,
              alpha: 0.9,
            });
          }
        } else {
          // Daytime Idle Choreography
          e.char.idleTimer++;

          // Every ~15 seconds, pick a new activity
          if (e.char.idleTimer % 650 === 0) {
            const roll = Math.random();
            if (roll < 0.35) {
              // Sit on the "L" of KAL and code on laptop!
              e.char.subState = 'going_to_L';
              e.char.targetX = Math.round(e.width * 0.72);
            } else if (roll < 0.6) {
              // Random Bug Crawl Event
              e.bugEvent = {
                x: e.width + 10,
                y: floorY - 6,
                squashed: false,
                timer: 0,
              };
              e.char.subState = 'squashing_bug';
            } else if (roll < 0.8) {
              // Coffee Break Event
              e.coffeeEvent = {
                x: Math.round(e.width * 0.4),
                y: floorY - 9,
                active: true,
                timer: 0,
              };
              e.char.subState = 'coffee_break';
            } else {
              // Load Shedding Candle Event
              e.candleFlicker = true;
              e.candleX = e.char.x + 14;
              e.candleTimer = 180;
              e.char.subState = 'load_shedding';
              triggerSpeechBubble("load-shedding again...", 2500);
            }
          }

          // Handle Choreography Sub-states
          if (e.char.subState === 'going_to_L') {
            const dx = e.char.targetX - e.char.x;
            if (Math.abs(dx) > 3) {
              e.char.vx = dx > 0 ? 0.7 : -0.7;
              e.char.facingLeft = dx < 0;
              e.char.x += e.char.vx;
              e.char.state = e.char.walkFrame === 0 ? 'walk1' : 'walk2';
            } else {
              // Hop onto the "L" shelf
              e.char.subState = 'on_L';
              e.char.onLTimer = 400; // ~7 seconds of typing on laptop
              e.char.y = floorY - 28; // On top of the "L" ledge
              e.char.state = 'sitLaptop';
            }
          } else if (e.char.subState === 'on_L') {
            e.char.state = 'sitLaptop';
            e.char.y = floorY - 28;
            e.char.onLTimer--;
            if (e.char.onLTimer <= 0) {
              // Jump off "L" and return to walking
              e.char.y = floorY - 16;
              e.char.subState = 'walking';
              e.char.targetX = Math.round(e.width * 0.3);
            }
          } else if (e.char.subState === 'squashing_bug' && e.bugEvent) {
            e.bugEvent.x -= 0.6;
            // Draw bug crawling
            drawSprite(ctx, OBSTACLES.bug, e.bugEvent.x, e.bugEvent.y, palette, 1, false);

            const dist = Math.abs(e.char.x - e.bugEvent.x);
            if (!e.bugEvent.squashed) {
              if (dist > 8) {
                const dir = e.bugEvent.x > e.char.x ? 1 : -1;
                e.char.vx = dir * 0.9;
                e.char.facingLeft = dir < 0;
                e.char.x += e.char.vx;
                e.char.state = e.char.walkFrame === 0 ? 'walk1' : 'walk2';
              } else {
                // Squash!
                e.bugEvent.squashed = true;
                e.char.state = 'jump';
                retroAudio.playSquash();
                triggerSpeechBubble("bug fixed! (0 errors)", 2200);
              }
            } else {
              e.bugEvent.timer++;
              if (e.bugEvent.timer > 80) {
                e.bugEvent = null;
                e.char.subState = 'walking';
              }
            }
          } else if (e.char.subState === 'coffee_break' && e.coffeeEvent) {
            drawSprite(ctx, OBSTACLES.coffeeCup, e.coffeeEvent.x, e.coffeeEvent.y, palette, 1, false);
            const dx = e.coffeeEvent.x - e.char.x;
            if (Math.abs(dx) > 6) {
              e.char.vx = dx > 0 ? 0.7 : -0.7;
              e.char.facingLeft = dx < 0;
              e.char.x += e.char.vx;
              e.char.state = e.char.walkFrame === 0 ? 'walk1' : 'walk2';
            } else {
              e.coffeeEvent.timer++;
              e.char.state = 'idle';
              if (e.coffeeEvent.timer === 15) {
                retroAudio.playCoffee();
                triggerSpeechBubble("+10 energy", 2000);
              }
              if (e.coffeeEvent.timer > 100) {
                e.coffeeEvent = null;
                e.char.subState = 'walking';
              }
            }
          } else if (e.char.subState === 'load_shedding') {
            if (e.candleFlicker) {
              drawSprite(ctx, OBSTACLES.candle, e.candleX, floorY - 11, palette, 1, false);
              e.candleTimer--;
              if (e.candleTimer <= 0) {
                e.candleFlicker = false;
                e.char.subState = 'walking';
                triggerSpeechBubble("power restored!", 2000);
              }
            }
          } else {
            // Normal gentle strolling back and forth
            e.char.x += e.char.vx;
            e.char.y = floorY - 16;
            e.char.state = e.char.walkFrame === 0 ? 'walk1' : 'walk2';

            if (e.char.x < 15) {
              e.char.vx = 0.5;
              e.char.facingLeft = false;
            } else if (e.char.x > e.width - 25) {
              e.char.vx = -0.5;
              e.char.facingLeft = true;
            }
          }
        }

        // Floating "Z"s for night sleep
        if (e.zList.length > 0) {
          ctx.fillStyle = isDark ? '#ffffff' : '#18181b';
          ctx.font = '8px monospace';
          for (let i = e.zList.length - 1; i >= 0; i--) {
            const z = e.zList[i];
            z.y -= 0.35;
            z.x += Math.sin(z.y * 0.1) * 0.3;
            z.alpha -= 0.012;
            if (z.alpha <= 0) {
              e.zList.splice(i, 1);
              continue;
            }
            ctx.globalAlpha = Math.max(0, z.alpha);
            ctx.fillText('z', z.x, z.y);
          }
          ctx.globalAlpha = 1;
        }

        // Draw character in idle mode
        const sprite =
          e.char.state === 'sitLaptop'
            ? CHARACTER_SPRITES.sitLaptop
            : e.char.state === 'sleep'
            ? CHARACTER_SPRITES.sleep
            : e.char.state === 'walk1'
            ? CHARACTER_SPRITES.walk1
            : e.char.state === 'walk2'
            ? CHARACTER_SPRITES.walk2
            : CHARACTER_SPRITES.idle;

        drawSprite(ctx, sprite, e.char.x, e.char.y, palette, 1, e.char.facingLeft);
      }

      // -------------------------------------------------------------
      // 2. RUNNER GAME LOGIC
      // -------------------------------------------------------------
      else if (e.mode === 'running') {
        e.distance += e.speed;
        e.score = Math.floor(e.distance / 12);
        setCurrentScore(e.score);

        // Gradually speed up
        if (e.speed < 5.8) {
          e.speed += 0.0004;
        }

        // Check milestones
        if (e.score >= e.nextMilestone) {
          retroAudio.playMilestone();
          if (e.nextMilestone === 100) {
            setMilestoneMsg("Senior Dev Unlocked!");
            e.nextMilestone = 500;
          } else if (e.nextMilestone === 500) {
            setMilestoneMsg("Works on My Machine!");
            e.nextMilestone = 1000;
          } else {
            setMilestoneMsg(`Level Up: ${e.score} Commits!`);
            e.nextMilestone += 500;
          }
          setTimeout(() => setMilestoneMsg(null), 3000);
        }

        // Floor scroll illusion
        e.floorOffset = (e.floorOffset + e.speed) % 14;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(e.width, floorY);
        ctx.stroke();

        // Little pixel hash marks on floor
        for (let fx = -e.floorOffset; fx < e.width; fx += 14) {
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
          ctx.fillRect(Math.round(fx), floorY, 2, 2);
        }

        // Player physics
        if (!e.char.isGrounded) {
          e.char.vy += 0.36; // Gravity
          e.char.y += e.char.vy;

          if (e.char.y >= floorY - 16) {
            e.char.y = floorY - 16;
            e.char.vy = 0;
            e.char.isGrounded = true;
            e.char.isJumping = false;
          }
        }

        // Walk frame cycle
        e.char.animTimer++;
        if (e.char.animTimer % 6 === 0) {
          e.char.walkFrame = (e.char.walkFrame + 1) % 2;
        }

        // Select sprite
        let playerSprite = CHARACTER_SPRITES.idle;
        let playerY = e.char.y;
        let playerW = 12;
        let playerH = 16;

        if (e.char.isJumping) {
          playerSprite = CHARACTER_SPRITES.jump;
        } else if (e.char.isDucking) {
          playerSprite = CHARACTER_SPRITES.duck;
          playerY = floorY - 10;
          playerW = 14;
          playerH = 10;
        } else {
          playerSprite = e.char.walkFrame === 0 ? CHARACTER_SPRITES.walk1 : CHARACTER_SPRITES.walk2;
        }

        // Draw Player
        drawSprite(ctx, playerSprite, e.char.x, playerY, palette, 1, false);

        // Spawn obstacles
        e.nextObstacleDist -= e.speed;
        if (e.nextObstacleDist <= 0) {
          const types: ObstacleEntity['type'][] = [
            'bug',
            'semicolon',
            'block404',
            'mergeConflict',
            'deployFriday',
            'slackBird',
            'flyingUndefined',
          ];
          const chosen = types[Math.floor(Math.random() * types.length)];
          const isFlying = chosen === 'slackBird' || chosen === 'flyingUndefined';

          let spr: PixelSprite = OBSTACLES.bug;
          let obsH = 6;
          let obsW = 8;
          let obsY = floorY - 6;

          if (chosen === 'semicolon') {
            spr = OBSTACLES.semicolon;
            obsH = 11;
            obsW = 5;
            obsY = floorY - 11;
          } else if (chosen === 'block404') {
            spr = OBSTACLES.block404;
            obsH = 9;
            obsW = 14;
            obsY = floorY - 9;
          } else if (chosen === 'mergeConflict') {
            spr = OBSTACLES.mergeConflict;
            obsH = 18;
            obsW = 16;
            obsY = floorY - 18;
          } else if (chosen === 'deployFriday') {
            spr = OBSTACLES.deployFriday;
            obsH = 18;
            obsW = 14;
            obsY = floorY - 18;
          } else if (chosen === 'slackBird') {
            spr = OBSTACLES.slackBird;
            obsH = 8;
            obsW = 12;
            obsY = floorY - 24; // Flying obstacle (must duck!)
          } else if (chosen === 'flyingUndefined') {
            spr = OBSTACLES.flyingUndefined;
            obsH = 8;
            obsW = 18;
            obsY = floorY - 23; // Flying obstacle (must duck!)
          }

          e.obstacles.push({
            id: e.nextObstacleId++,
            type: chosen,
            x: e.width + 10,
            y: obsY,
            width: obsW,
            height: obsH,
            sprite: spr,
            isFlying,
          });

          // Next obstacle gap (scales with speed)
          e.nextObstacleDist = Math.max(75, 120 + Math.random() * 80 - e.speed * 4);
        }

        // Draw and test collision for obstacles
        const pLeft = e.char.x + 2;
        const pRight = e.char.x + playerW - 2;
        const pTop = playerY + 2;
        const pBottom = playerY + playerH;

        for (let i = e.obstacles.length - 1; i >= 0; i--) {
          const obs = e.obstacles[i];
          obs.x -= e.speed;

          drawSprite(ctx, obs.sprite, obs.x, obs.y, palette, 1, false);

          // AABB Collision check
          const oLeft = obs.x + 1;
          const oRight = obs.x + obs.width - 1;
          const oTop = obs.y + 1;
          const oBottom = obs.y + obs.height;

          const collides =
            pRight > oLeft &&
            pLeft < oRight &&
            pBottom > oTop &&
            pTop < oBottom;

          if (collides) {
            // GAME OVER!
            e.mode = 'gameover';
            setGameMode('gameover');
            retroAudio.playGameOver();

            // Check high score
            if (e.score > e.highScore) {
              e.highScore = e.score;
              setHighScore(e.score);
              try {
                localStorage.setItem(HIGH_SCORE_KEY, String(e.score));
              } catch {}
            }

            // Return to idle automatically after 6 seconds if not restarted
            clearTimeout(gameOverTimeout);
            gameOverTimeout = window.setTimeout(() => {
              returnToIdle();
            }, 6000);
            break;
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < -10) {
            e.obstacles.splice(i, 1);
          }
        }

        // HUD: Commits score in pixel style
        ctx.fillStyle = isDark ? '#ffffff' : '#09090b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${e.score} commits`, e.width - 12, 16);

        if (e.highScore > 0) {
          ctx.fillStyle = isDark ? '#71717a' : '#a1a1aa';
          ctx.font = '8px monospace';
          ctx.fillText(`best: ${e.highScore}`, e.width - 12, 26);
        }
      }

      // -------------------------------------------------------------
      // 3. GAME OVER OVERLAY
      // -------------------------------------------------------------
      else if (e.mode === 'gameover') {
        // Red dim overlay
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)';
        ctx.fillRect(0, 0, e.width, e.height);

        // "BUILD FAILED" in retro red font
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BUILD FAILED', e.width / 2, e.height / 2 - 12);

        // Final score
        ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
        ctx.font = '9px monospace';
        ctx.fillText(`${e.score} commits · best: ${Math.max(e.score, e.highScore)}`, e.width / 2, e.height / 2 + 2);

        ctx.fillStyle = isDark ? '#a1a1aa' : '#71717a';
        ctx.font = '8px monospace';
        ctx.fillText('press space or tap to git revert', e.width / 2, e.height / 2 + 15);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(gameOverTimeout);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [theme, triggerJump, setDucking, isDhakaNight, returnToIdle, triggerSpeechBubble]);

  return {
    canvasRef,
    containerRef,
    gameMode,
    currentScore,
    highScore,
    isMuted,
    milestoneMsg,
    speechBubble,
    startRunnerGame,
    restartRunnerGame,
    returnToIdle,
    toggleSound,
    triggerJump,
    handleCharacterClick,
    onMouseEnter: () => {
      engineRef.current.isHovered = true;
    },
    onMouseLeave: () => {
      engineRef.current.isHovered = false;
    },
    onFocus: () => {
      engineRef.current.isFocused = true;
    },
    onBlur: () => {
      engineRef.current.isFocused = false;
    },
  };
}
