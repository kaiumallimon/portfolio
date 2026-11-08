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

    // 2. Camera setup - Orthographic Camera for true 30° Isometric Projection
    // Looking down from (-22, 11.5, -22) produces exact 30° slants along Z and X axes
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 360;
    const aspect = width / height;
    const frustumSize = width < 640 ? 15 : 12.5;

    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    const baseCamX = -22;
    const baseCamY = 11.5;
    const baseCamZ = -22;

    camera.position.set(baseCamX, baseCamY, baseCamZ);
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

    // 4. Procedural hatched texture for top (+Y) faces
    function createHatchTexture(dark: boolean) {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = dark ? "#141416" : "#ffffff";
      ctx.fillRect(0, 0, 64, 64);

      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.28)" : "rgba(0, 0, 0, 0.24)";
      ctx.lineWidth = 1.5;
      for (let i = -64; i < 128; i += 7) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 64, 64);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1.5, 1.5);
      return tex;
    }

    const hatchTexture = createHatchTexture(isDark);

    // Materials
    const edgeColor = isDark ? 0xf4f4f5 : 0x18181b;
    const sideColor = isDark ? 0x141416 : 0xf4f4f5;

    const topMaterial = new THREE.MeshBasicMaterial({
      map: hatchTexture,
      side: THREE.DoubleSide,
    });

    const sideMaterial = new THREE.MeshBasicMaterial({
      color: sideColor,
      side: THREE.DoubleSide,
    });

    // BoxGeometry face materials: [+X, -X, +Y (top), -Y, +Z, -Z]
    const materials = [
      sideMaterial, // right
      sideMaterial, // left
      topMaterial,  // top (hatched!)
      sideMaterial, // bottom
      sideMaterial, // front
      sideMaterial, // back
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      linewidth: 1.5,
    });

    const dashedLineMat = new THREE.LineDashedMaterial({
      color: isDark ? 0x3f3f46 : 0xd4d4d8,
      dashSize: 0.35,
      gapSize: 0.25,
      linewidth: 1,
    });

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 5. Ground grid in foreground & background (30° isometric lines on floor y=0)
    const gridGroup = new THREE.Group();
    mainGroup.add(gridGroup);

    // Longitudinal and transversal dashed lines across floor
    for (let x = -10; x <= 10; x += 2.5) {
      const pts = [new THREE.Vector3(x, 0, -12), new THREE.Vector3(x, 0, 12)];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, dashedLineMat);
      line.computeLineDistances();
      gridGroup.add(line);
    }

    for (let z = -12; z <= 12; z += 2.5) {
      const pts = [new THREE.Vector3(-10, 0, z), new THREE.Vector3(10, 0, z)];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, dashedLineMat);
      line.computeLineDistances();
      gridGroup.add(line);
    }

    // Prominent dashed projection line extending along the 30° axis through the back edges
    const axisPts = [new THREE.Vector3(-3.5, 0, -14), new THREE.Vector3(-3.5, 0, 14)];
    const axisGeom = new THREE.BufferGeometry().setFromPoints(axisPts);
    const axisLineMat = new THREE.LineDashedMaterial({
      color: isDark ? 0x71717a : 0x71717a,
      dashSize: 0.45,
      gapSize: 0.25,
      linewidth: 1,
    });
    const axisLine = new THREE.Line(axisGeom, axisLineMat);
    axisLine.computeLineDistances();
    gridGroup.add(axisLine);

    // 6. Helper to create floored architectural block slabs
    const slabHeight = 0.75;
    function createFlooredSlab(w: number, d: number, x: number, z: number, rotY = 0) {
      const geom = new THREE.BoxGeometry(w, slabHeight, d);
      const mesh = new THREE.Mesh(geom, materials);
      // Position centered at y = slabHeight / 2 so the bottom rests on y = 0
      mesh.position.set(x, slabHeight / 2, z);
      mesh.rotation.y = rotY;

      const edges = new THREE.EdgesGeometry(geom, 25);
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(wireframe);

      return mesh;
    }

    // 7. Build floored architectural letters KAL stepped along the 30° diagonal
    const kalLetters = new THREE.Group();
    mainGroup.add(kalLetters);

    // --- LETTER K (Lower-left at z = -4.2) ---
    const zK = -4.2;
    // Main vertical spine on floor (running along X)
    kalLetters.add(createFlooredSlab(3.4, 0.85, -2.5, zK));
    // Upper arm angled out
    kalLetters.add(createFlooredSlab(2.0, 0.85, -1.2, zK + 1.1, Math.PI / 4));
    // Lower arm angled out
    kalLetters.add(createFlooredSlab(2.0, 0.85, -1.2, zK - 1.1, -Math.PI / 4));

    // --- LETTER A (Center at z = 0) ---
    const zA = 0;
    // Left column
    kalLetters.add(createFlooredSlab(3.4, 0.85, -1.2, zA));
    // Right column
    kalLetters.add(createFlooredSlab(3.4, 0.85, 1.2, zA));
    // Top crossbar (running along Z)
    kalLetters.add(createFlooredSlab(0.85, 2.0, 0.45, zA));
    // Middle crossbar
    kalLetters.add(createFlooredSlab(0.7, 1.55, -0.4, zA));

    // --- LETTER L (Upper-right at z = +4.5) ---
    const zL = 4.5;
    // Main spine on floor
    kalLetters.add(createFlooredSlab(3.4, 0.85, 0.2, zL));
    // Base slab extending along Z
    kalLetters.add(createFlooredSlab(0.85, 2.4, 1.45, zL + 0.8));

    // 8. Mouse interaction state
    let targetTiltX = 0;
    let targetTiltZ = 0;
    let currentTiltX = 0;
    let currentTiltZ = 0;
    let scaleMultiplier = 1.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;

      targetTiltX = -normY * 0.12;
      targetTiltZ = normX * 0.14;
    };

    const handleMouseLeave = () => {
      targetTiltX = 0;
      targetTiltZ = 0;
    };

    const handleClick = () => {
      playTactileClickSound();
      scaleMultiplier = 0.92; // subtle tactile recoil
      setClicked(true);
      setTimeout(() => setClicked(false), 240);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 360;
      const asp = w / h;
      const fSize = w < 640 ? 15 : 12.5;

      camera.left = (-fSize * asp) / 2;
      camera.right = (fSize * asp) / 2;
      camera.top = fSize / 2;
      camera.bottom = -fSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Theme mutation observer
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      lineMaterial.color.setHex(darkNow ? 0xf4f4f5 : 0x18181b);
      sideMaterial.color.setHex(darkNow ? 0x141416 : 0xf4f4f5);
      dashedLineMat.color.setHex(darkNow ? 0x3f3f46 : 0xd4d4d8);
      topMaterial.map = createHatchTexture(darkNow);
      topMaterial.needsUpdate = true;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 9. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lerping to mouse tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltZ += (targetTiltZ - currentTiltZ) * 0.08;

      mainGroup.rotation.x = currentTiltX;
      mainGroup.rotation.z = currentTiltZ;

      // Spring physics on click scale
      scaleMultiplier += (1.0 - scaleMultiplier) * 0.14;
      mainGroup.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

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
      sideMaterial.dispose();
      dashedLineMat.dispose();
      axisLineMat.dispose();
      hatchTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer select-none flex items-center justify-center overflow-hidden"
      title="Click for a sound"
      role="button"
      tabIndex={0}
      aria-label="Interactive 3D isometric KAL monogram floored and angled with foreground grid. Click for sound."
    >
      {/* 30° Isometric Angle Arc Annotation on the top right */}
      <div
        className="absolute top-4 right-6 pointer-events-none select-none flex items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500"
        aria-hidden="true"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          className="text-zinc-400 dark:text-zinc-500"
        >
          {/* Reference horizontal and 30° lines with arc */}
          <line x1="2" y1="30" x2="30" y2="30" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="2" y1="30" x2="28" y2="14" strokeWidth="1" />
          <path d="M 18 30 A 16 16 0 0 0 16 20" strokeWidth="1" />
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
