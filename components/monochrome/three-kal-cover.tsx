"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Synthesized mechanical tactile click sound (Web Audio API)
function playTactileClickSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    // High frequency snap + low resonant woodblock-style impulse
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.055);
  } catch {}
}

export function ThreeKalCover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains("dark");

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - Orthographic Camera for true architectural projection
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 340;
    const aspect = width / height;
    const frustumSize = width < 640 ? 14 : 11.5;

    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    // Front-centered camera looking along -Z
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create procedural hatched texture for top surfaces matching blueprint drawing
    function createHatchTexture(dark: boolean) {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = dark ? "#18181b" : "#ffffff";
      ctx.fillRect(0, 0, 64, 64);

      ctx.strokeStyle = dark ? "rgba(255,255,255,0.24)" : "rgba(0,0,0,0.22)";
      ctx.lineWidth = 1.5;
      for (let i = -64; i < 128; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 64, 64);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      return tex;
    }

    const hatchTexture = createHatchTexture(isDark);

    // Materials
    const edgeColor = isDark ? 0xf4f4f5 : 0x18181b;
    const faceColor = isDark ? 0x18181b : 0xfbfbfb;
    const frontFaceColor = isDark ? 0x202024 : 0xffffff;

    const topMaterial = new THREE.MeshBasicMaterial({
      map: hatchTexture,
      side: THREE.DoubleSide,
    });

    const frontMaterial = new THREE.MeshBasicMaterial({
      color: frontFaceColor,
      side: THREE.DoubleSide,
    });

    const sideMaterial = new THREE.MeshBasicMaterial({
      color: faceColor,
      side: THREE.DoubleSide,
    });

    // BoxGeometry material faces order: [+X, -X, +Y (top), -Y, +Z (front), -Z]
    const materials = [
      sideMaterial,  // right (+X)
      sideMaterial,  // left (-X)
      topMaterial,   // top (+Y hatched)
      sideMaterial,  // bottom (-Y)
      frontMaterial, // front (+Z)
      sideMaterial,  // back (-Z)
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      linewidth: 1.5,
    });

    // Helper to create an architectural block with crisp edge outlines
    function createBlock(w: number, h: number, d: number, x: number, y: number, z: number, rotZ = 0) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, materials);
      mesh.position.set(x, y, z);
      mesh.rotation.z = rotZ;

      const edges = new THREE.EdgesGeometry(geom, 25);
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(wireframe);

      return mesh;
    }

    // 5. Build isometric architectural letters KAL
    const kalGroup = new THREE.Group();

    // --- LETTER K ---
    // Spine
    kalGroup.add(createBlock(0.85, 4.0, 1.2, -4.0, 0, 0));
    // Upper diagonal
    kalGroup.add(createBlock(2.2, 0.85, 1.2, -2.8, 1.05, 0, Math.PI / 4));
    // Lower diagonal
    kalGroup.add(createBlock(2.2, 0.85, 1.2, -2.8, -1.05, 0, -Math.PI / 4));

    // --- LETTER A ---
    // Left upright
    kalGroup.add(createBlock(0.85, 4.0, 1.2, -1.1, 0, 0));
    // Right upright
    kalGroup.add(createBlock(0.85, 4.0, 1.2, 1.1, 0, 0));
    // Top bar
    kalGroup.add(createBlock(2.2, 0.85, 1.2, 0, 1.575, 0));
    // Middle crossbar
    kalGroup.add(createBlock(1.4, 0.65, 1.2, 0, -0.2, 0));

    // --- LETTER L ---
    // Vertical spine
    kalGroup.add(createBlock(0.85, 4.0, 1.2, 2.9, 0, 0));
    // Bottom base
    kalGroup.add(createBlock(2.4, 0.85, 1.2, 3.7, -1.575, 0));

    scene.add(kalGroup);

    // Initial base orientation: calibrated for optimal architectural readability and ~30° isometric slant
    const baseRotX = 0.44; // ~25° downward tilt to show top hatched surfaces clearly
    const baseRotY = -0.48; // ~-27.5° azimuth angle for 3D depth and readability
    const baseRotZ = 0.05;  // subtle dynamic axis alignment

    kalGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    kalGroup.position.set(0, 0, 0);

    // Mouse tracking state
    let targetRotationX = baseRotX;
    let targetRotationY = baseRotY;
    let currentRotationX = baseRotX;
    let currentRotationY = baseRotY;
    let scaleMultiplier = 1.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;

      // Gentle interactive tilt around base orientation
      targetRotationY = baseRotY + normX * 0.28;
      targetRotationX = baseRotX - normY * 0.2;
    };

    const handleMouseLeave = () => {
      targetRotationX = baseRotX;
      targetRotationY = baseRotY;
    };

    const handleClick = () => {
      playTactileClickSound();
      scaleMultiplier = 0.91; // subtle recoil/bounce spring
      setClicked(true);
      setTimeout(() => setClicked(false), 250);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 340;
      const asp = w / h;
      const fSize = w < 640 ? 14 : 11.5;

      camera.left = (-fSize * asp) / 2;
      camera.right = (fSize * asp) / 2;
      camera.top = fSize / 2;
      camera.bottom = -fSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Listen for theme mutations to update material colors
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      lineMaterial.color.setHex(darkNow ? 0xf4f4f5 : 0x18181b);
      frontMaterial.color.setHex(darkNow ? 0x202024 : 0xffffff);
      sideMaterial.color.setHex(darkNow ? 0x18181b : 0xfbfbfb);
      topMaterial.map = createHatchTexture(darkNow);
      topMaterial.needsUpdate = true;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 6. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lerp to mouse rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      kalGroup.rotation.x = currentRotationX;
      kalGroup.rotation.y = currentRotationY;
      kalGroup.rotation.z = baseRotZ;

      // Spring physics on scale
      scaleMultiplier += (1.0 - scaleMultiplier) * 0.14;
      kalGroup.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      lineMaterial.dispose();
      topMaterial.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
      hatchTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer select-none flex items-center justify-center"
      title="Click for a sound"
      role="button"
      tabIndex={0}
      aria-label="Interactive 3D isometric KAL monogram. Click for sound."
    >
      {/* 30° Isometric Angle Arc Annotation on the top right */}
      <div
        className="absolute top-4 right-6 pointer-events-none select-none flex items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500"
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          className="text-zinc-400 dark:text-zinc-600"
        >
          {/* Subtle arc and angle lines */}
          <line x1="2" y1="26" x2="26" y2="26" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="2" y1="26" x2="24" y2="10" strokeWidth="1" />
          <path d="M 16 26 A 14 14 0 0 0 14 17" strokeWidth="1" />
        </svg>
        <span>30°</span>
      </div>

      {/* Handwritten Annotation with arrow pointing to the 3D model */}
      <div
        className="pointer-events-none absolute font-mono text-xs text-zinc-500 dark:text-zinc-400 select-none bottom-6 right-4 hidden md:flex items-center gap-2"
        aria-hidden="true"
      >
        <div className="text-right leading-tight italic font-serif">
          <span>follows your cursor</span>
          <br />
          <span className="text-[11px] text-zinc-400">click for a sound</span>
        </div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          className="text-zinc-400 dark:text-zinc-600 -rotate-12"
        >
          <path
            d="M 6 6 Q 22 8 20 24 M 14 20 L 20 24 L 24 18"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
