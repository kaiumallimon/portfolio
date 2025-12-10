'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

export interface Achievement {
  title: string;
  award: string | string[];
  date: string;
  project?: string;
  team?: string;
  image?: string | string[];
}

export interface BentoProps {
  achievements?: Achievement[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string; // e.g. '132, 0, 255'
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '176, 208, 255';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'mb-particle';
  el.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 8;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.45,
  fadeDistance: radius * 0.8
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', `${glow}`);
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const timeoutsRef = useRef<number[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLDivElement[]>([]);
    const particlesInitialized = useRef(false);
    const magnetismTween = useRef<gsap.core.Tween | null>(null);

    const initializeParticles = useCallback(() => {
      if (particlesInitialized.current || !cardRef.current) return;
      const { width, height } = cardRef.current.getBoundingClientRect();
      memoizedParticles.current = Array.from({ length: particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height, glowColor)
      );
      particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      magnetismTween.current?.kill();

      particlesRef.current.forEach(p => {
        try {
          gsap.to(p, {
            scale: 0,
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
              if (p.parentNode) {
                p.parentNode.removeChild(p);
              }
            }
          });

        } catch { }
      });
      particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
      if (!cardRef.current || !isHoveredRef.current) return;
      if (!particlesInitialized.current) initializeParticles();

      memoizedParticles.current.forEach((particle, idx) => {
        const id = window.setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;
          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current!.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' });
          gsap.to(clone, {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }, idx * 80);
        timeoutsRef.current.push(id);
      });
    }, [initializeParticles]);

    useEffect(() => {
      if (disableAnimations || !cardRef.current) return;
      const el = cardRef.current;

      const handleMouseEnter = () => {
        isHoveredRef.current = true;
        animateParticles();
        if (enableTilt) {
          gsap.to(el, { rotateX: 4, rotateY: 4, duration: 0.28, ease: 'power2.out', transformPerspective: 800 });
        }
      };

      const handleMouseLeave = () => {
        isHoveredRef.current = false;
        clearAllParticles();
        if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
        if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.25, ease: 'power2.out' });
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableTilt && !enableMagnetism) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;
          gsap.to(el, { rotateX, rotateY, duration: 0.12, ease: 'power2.out', transformPerspective: 800 });
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.04;
          const magnetY = (y - centerY) * 0.04;
          magnetismTween.current?.kill();
          magnetismTween.current = gsap.to(el, { x: magnetX, y: magnetY, duration: 0.25, ease: 'power2.out' });
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!clickEffect) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );
        const ripple = document.createElement('div');
        ripple.className = 'mb-ripple';
        ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 12;
        background: radial-gradient(circle, rgba(${glowColor},0.35) 0%, rgba(${glowColor},0.15) 30%, transparent 70%);
      `;
        el.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('click', handleClick);

      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('click', handleClick);
        clearAllParticles();
      };
    }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, clickEffect, glowColor, enableMagnetism]);

    return (
      <div ref={cardRef} className={`${className} relative overflow-hidden`} style={{ ...style, position: 'relative' }}>
        {children}
      </div>
    );
  };

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({ gridRef, disableAnimations = false, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'mb-global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.16) 0%,
        rgba(${glowColor}, 0.08) 20%,
        rgba(${glowColor}, 0.02) 45%,
        transparent 70%);
      z-index: 6;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.mb-section') as HTMLElement | null;
      const rect = section?.getBoundingClientRect();
      const mouseInside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        gridRef.current.querySelectorAll('.mb-card').forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;
      const cards = Array.from(gridRef.current.querySelectorAll('.mb-card')) as HTMLElement[];

      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const distance = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.08, ease: 'power2.out' });

      const targetOpacity = minDistance <= proximity ? 0.8 : (minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0);
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.18 : 0.45, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.mb-card').forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  achievements = [],
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [activeImageIndexes, setActiveImageIndexes] = useState<number[]>(() => achievements.map(() => 0));
  const hoverTimers = useRef<Array<number | null>>([]);

  useEffect(() => {
    setActiveImageIndexes(achievements.map(() => 0));
    hoverTimers.current.forEach(t => t && window.clearInterval(t));
    hoverTimers.current = [];
  }, [achievements]);

  useEffect(() => () => {
    hoverTimers.current.forEach(t => t && window.clearInterval(t));
  }, []);

  const startImageCycle = useCallback((idx: number, length: number) => {
    if (length <= 1) return;
    window.clearInterval(hoverTimers.current[idx] ?? undefined);
    hoverTimers.current[idx] = window.setInterval(() => {
      const imgEl = document.querySelector(`[data-card-idx="${idx}"] .mb-visual-img`);
      if (imgEl) {
        gsap.to(imgEl, {
          x: -100,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            setActiveImageIndexes(prev => {
              const next = [...prev];
              const len = length;
              next[idx] = len ? ((prev[idx] ?? 0) + 1) % len : 0;
              return next;
            });
            gsap.fromTo(imgEl, 
              { x: 100, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
          }
        });
      } else {
        setActiveImageIndexes(prev => {
          const next = [...prev];
          const len = length;
          next[idx] = len ? ((prev[idx] ?? 0) + 1) % len : 0;
          return next;
        });
      }
    }, 2500);
  }, []);

  const stopImageCycle = useCallback((idx: number) => {
    if (hoverTimers.current[idx]) {
      window.clearInterval(hoverTimers.current[idx]!);
      hoverTimers.current[idx] = null;
    }
  }, []);

  return (
    <>
      <style>{`
        .mb-section { --glow-x: 50%; --glow-y: 50%; --glow-intensity: 0; --glow-radius: 200px; --glow-color: ${glowColor}; }
        .mb-grid { display: flex; flex-direction: column; gap: 18px; width: 100%; }

        .mb-card {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          padding: 16px;
          min-height: 220px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #f5f5f5;
          box-shadow: none;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          backdrop-filter: none;
        }

        .mb-card:hover { transform: translateY(-6px); }

        .mb-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          border-radius: inherit;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.72)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.28)) 25%,
            transparent 60%);
          pointer-events: none;
          z-index: 3;
          mix-blend-mode: screen;
          opacity: 1;
          transition: opacity .18s ease;
        }

        .mb-card-row { display:flex; flex-direction:column; gap:14px; height:100%; }
        @media(min-width:768px){ .mb-card-row { flex-direction:row; align-items:stretch; } .mb-card-row--reverse { flex-direction: row-reverse; } }
        .mb-card-row--reverse .mb-content { align-items: flex-start; }
        .mb-card-row:not(.mb-card-row--reverse) .mb-content { align-items: flex-end; }

        .mb-visual { position:relative; flex:0 0 48%; min-height:350px; border-radius:12px; overflow:hidden; z-index:2; background:#0e0e10; }
        @media(max-width:767px){ .mb-visual { flex:1; min-height:220px; } }
        .mb-visual-img { object-fit: cover; filter: saturate(1.1) brightness(1.02); }
        .mb-visual-placeholder { width:100%; height:100%; background: radial-gradient(circle at 24% 24%, rgba(176,208,255,0.18), transparent 46%),
          radial-gradient(circle at 82% 32%, rgba(120,180,220,0.2), transparent 44%),
          linear-gradient(145deg, rgba(12,14,18,0.9), rgba(8,10,14,0.92)); }
        .mb-visual-overlay { position:absolute; inset:0; background: linear-gradient(145deg, rgba(6,8,12,0.05), rgba(6,8,12,0.28)); z-index:2; }
        .mb-visual-dots { position:absolute; left:50%; bottom:12px; transform: translateX(-50%); display:flex; gap:6px; z-index:4; }
        .mb-visual-dot { width:8px; height:8px; border-radius:999px; background: rgba(255,255,255,0.28); border:1px solid rgba(0,0,0,0.25); box-shadow: 0 0 6px rgba(0,0,0,0.35); }
        .mb-visual-dot--active { background: rgba(255,255,255,0.9); width:10px; height:10px; }

        .mb-content { position: relative; z-index: 4; display:flex; flex-direction:column; gap:10px; flex:1; }
        .mb-title { font-weight:700; font-size:1.08rem; letter-spacing: -0.2px; color:#f7f7f7; }
        .mb-sub { color: rgba(235,235,235,0.88); font-size:0.9rem; }
        .mb-small { color: rgba(225,225,225,0.7); font-size:0.82rem; }

        .mb-particle { will-change: transform, opacity; }
        .mb-ripple { border-radius: 50%; }

        .mb-award-block { display:flex; flex-direction:column; gap:6px; }
        .mb-award-list { margin: 0; padding-left: 18px; list-style: disc; color: rgba(235,235,235,0.88); font-size:0.9rem; }
        .mb-award-item { margin: 0; padding: 0; }

        .mb-chip-row { display:flex; flex-wrap:wrap; gap:8px; }
        .mb-pill { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius: 999px; background: rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.07); font-size:0.78rem; color: rgba(240,240,240,0.9); }
        .mb-pill--ghost { background: rgba(255,255,255,0.03); color: rgba(232,232,232,0.84); }
        .mb-meta-row { display:flex; flex-wrap:wrap; gap:8px; margin-top: auto; }

      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <section className="mb-section">
        <div ref={gridRef} className="mb-grid">
          {achievements.length === 0 && (
            <div className="mb-card">
              <div className="mb-content">
                <div className="mb-title">No achievements yet</div>
                <div className="mb-small">Add items to the achievements prop to show them here.</div>
              </div>
            </div>
          )}

          {achievements.map((item, index) => {
            const images = Array.isArray(item.image) ? item.image : item.image ? [item.image] : [];
            const hasImage = images.length > 0;
            const activeIdx = activeImageIndexes[index] ?? 0;
            const currentImage = hasImage ? images[activeIdx % images.length] : undefined;

            return (
              <ParticleCard
                key={index}
                className={`mb-card ${enableBorderGlow ? 'mb-card--glow' : ''}`}
                style={{ backgroundColor: 'transparent' }}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div
                  className={`mb-card-row ${index % 2 === 1 ? 'mb-card-row--reverse' : ''}`}
                  data-card-idx={index}
                  onMouseEnter={() => startImageCycle(index, images.length)}
                  onMouseLeave={() => stopImageCycle(index)}
                >
                  <div className="mb-visual" aria-hidden>
                    {currentImage ? (
                      <Image
                        src={currentImage}
                        alt={item.title}
                        fill
                        sizes="(min-width:1024px) 45vw, 100vw"
                        className="mb-visual-img"
                        priority={index < 2}
                      />
                    ) : (
                      <div className="mb-visual-placeholder" />
                    )}
                    <div className="mb-visual-overlay" />
                    {images.length > 1 && (
                      <div className="mb-visual-dots">
                        {images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`mb-visual-dot ${dotIdx === activeIdx ? 'mb-visual-dot--active' : ''}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-content">
                    <div className="mb-chip-row">
                      {item.project && <span className="mb-pill">Project: {item.project}</span>}
                      {item.team && <span className="mb-pill">Team: {item.team}</span>}
                    </div>

                    <div className="mb-title">{item.title}</div>

                    <div className="mb-award-block">
                      {Array.isArray(item.award) ? (
                        <ul className="mb-award-list">
                          {item.award.map((a, i) => (
                            <li key={i} className="mb-award-item">{a}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mb-sub">{item.award}</div>
                      )}
                    </div>

                    <div className="mb-meta-row">
                      <span className="mb-pill mb-pill--ghost">{item.date}</span>
                    </div>
                  </div>
                </div>
              </ParticleCard>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MagicBento;
