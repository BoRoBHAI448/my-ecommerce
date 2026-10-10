"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import { ArrowDown, ArrowRight, ShoppingBag, Sparkles, MoveDown } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

// 5 curated haute couture looks matching the Runwayfront / OSTRANDE aesthetic
const LOOKS = [
  {
    id: 1,
    number: "01",
    season: "FW26",
    collection: "QUIET WEATHER",
    title: "The Folded Collar",
    description: "Sculptural black cashmere cloak · draped structural neckline",
    price: "€3,450",
    priceBdt: "৳ 34,500",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=85",
    link: "/category/women-s",
  },
  {
    id: 2,
    number: "02",
    season: "FW26",
    collection: "QUIET WEATHER",
    title: "Brim and column",
    description: "Felt wide-brim hat · silk column dress in noir",
    price: "€2,170",
    priceBdt: "৳ 21,700",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=85",
    link: "/category/women-s",
  },
  {
    id: 3,
    number: "03",
    season: "FW26",
    collection: "QUIET WEATHER",
    title: "Storm coat",
    description: "Brushed wool, graphite · cashmere crew and smoke acetate",
    price: "€2,350",
    priceBdt: "৳ 23,500",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1600&auto=format&fit=crop&q=85",
    link: "/category/men-s",
  },
  {
    id: 4,
    number: "04",
    season: "FW26",
    collection: "QUIET WEATHER",
    title: "Tailored Minimalist Trench",
    description: "Double-faced bonded wool · raw edge belt and wide sleeve",
    price: "€2,890",
    priceBdt: "৳ 28,900",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=85",
    link: "/category/women-s",
  },
  {
    id: 5,
    number: "05",
    season: "FW26",
    collection: "QUIET WEATHER",
    title: "Monochrome Drape",
    description: "Fluid silk crepe de chine · tailored relaxed trousers",
    price: "€1,920",
    priceBdt: "৳ 19,200",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85",
    link: "/category/men-s",
  },
];

export function ClothHero({ brandName = "OSTRANDE" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { itemCount } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isDropping, setIsDropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1

  // Three.js internal simulation state refs
  const simRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    clothMesh: null,
    clothGeometry: null,
    particles: [],
    constraints: [],
    cols: 32,
    rows: 32,
    clothWidth: 10,
    clothHeight: 12,
    isFalling: false,
    fallVelocity: 0,
    textureLoader: null,
    textures: {},
    time: 0,
    activeLookIndex: 0,
  });

  const currentLook = LOOKS[currentIndex];
  const nextLook = LOOKS[nextIndex];

  // Trigger the silk drop physics
  const triggerDrop = useCallback(() => {
    if (isDropping) return;
    setIsDropping(true);

    const sim = simRef.current;
    if (sim) {
      sim.isFalling = true;
      // unpin all top particles with slight progressive flutter
      sim.particles.forEach((p, idx) => {
        p.pinned = false;
        // give top particles initial downward & forward velocity
        p.vy -= 0.08 + Math.random() * 0.05;
        p.vz += (Math.random() - 0.5) * 0.08;
      });
    }

    // after cloth drops off-screen, advance to next look
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % LOOKS.length;
        setNextIndex((next + 1) % LOOKS.length);
        return next;
      });
      setIsDropping(false);
      setDragProgress(0);

      // Reset cloth position and re-pin top
      if (sim && sim.particles.length > 0) {
        resetClothParticles(sim, (currentIndex + 1) % LOOKS.length);
      }
    }, 1100);
  }, [isDropping, currentIndex]);

  // Reset particles to initial draped rectangle and re-pin
  function resetClothParticles(sim, lookIdx) {
    sim.isFalling = false;
    sim.activeLookIndex = lookIdx;

    const { cols, rows, clothWidth, clothHeight } = sim;
    const dx = clothWidth / (cols - 1);
    const dy = clothHeight / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const p = sim.particles[idx];
        if (!p) continue;

        p.x = c * dx - clothWidth / 2;
        p.y = clothHeight / 2 - r * dy;
        p.z = Math.sin(c * 0.4) * 0.3; // soft initial curve

        p.ox = p.x;
        p.oy = p.y;
        p.oz = p.z;
        p.vx = 0;
        p.vy = 0;
        p.vz = 0;
        p.pinned = r === 0; // pin top row
      }
    }

    // Swap material texture to new look
    if (sim.clothMesh && sim.textures[lookIdx]) {
      sim.clothMesh.material.map = sim.textures[lookIdx];
      sim.clothMesh.material.needsUpdate = true;
    }
  }

  // Set up Three.js interactive cloth physics
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefebe4); // soft alabaster stone

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 3. Lighting (cinematic studio key + soft fill for silk specular sheen)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(5, 12, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.8);
    fillLight.position.set(-6, -4, 8);
    scene.add(fillLight);

    // 4. Cloth Mesh Physics Grid
    const cols = 28;
    const rows = 28;
    const clothWidth = 9.8;
    const clothHeight = 12.5;

    const geometry = new THREE.PlaneGeometry(clothWidth, clothHeight, cols - 1, rows - 1);
    geometry.dynamic = true;

    // Load Look Textures
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    const loadedTextures = {};

    LOOKS.forEach((look, i) => {
      textureLoader.load(
        look.image,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          loadedTextures[i] = tex;
          if (i === 0 && simRef.current.clothMesh) {
            simRef.current.clothMesh.material.map = tex;
            simRef.current.clothMesh.material.needsUpdate = true;
          }
        },
        undefined,
        () => {
          // Graceful fallback for offline / blocked images
        }
      );
    });

    // Satin / Silk Material with realistic subtle sheen
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const clothMesh = new THREE.Mesh(geometry, material);
    scene.add(clothMesh);

    // Particles array
    const particles = [];
    const dx = clothWidth / (cols - 1);
    const dy = clothHeight / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * dx - clothWidth / 2;
        const y = clothHeight / 2 - r * dy;
        const z = Math.sin(c * 0.4) * 0.25;

        particles.push({
          x,
          y,
          z,
          ox: x,
          oy: y,
          oz: z,
          vx: 0,
          vy: 0,
          vz: 0,
          pinned: r === 0, // top clips
        });
      }
    }

    // Structural Constraints
    const constraints = [];
    function addConstraint(p1Idx, p2Idx) {
      const p1 = particles[p1Idx];
      const p2 = particles[p2Idx];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
      constraints.push([p1Idx, p2Idx, dist]);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (c < cols - 1) addConstraint(idx, idx + 1); // horizontal
        if (r < rows - 1) addConstraint(idx, idx + cols); // vertical
        if (c < cols - 1 && r < rows - 1) {
          addConstraint(idx, idx + cols + 1); // shear diag 1
          addConstraint(idx + 1, idx + cols); // shear diag 2
        }
      }
    }

    simRef.current = {
      scene,
      camera,
      renderer,
      clothMesh,
      clothGeometry: geometry,
      particles,
      constraints,
      cols,
      rows,
      clothWidth,
      clothHeight,
      isFalling: false,
      fallVelocity: 0,
      textureLoader,
      textures: loadedTextures,
      time: 0,
      activeLookIndex: 0,
    };

    // 5. Animation Loop (Verlet physics + soft cloth breathing)
    let animationFrameId;
    let lastTime = performance.now();

    function animate(now) {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      const sim = simRef.current;
      sim.time += dt;

      const gravity = sim.isFalling ? -36.0 : -0.8;
      const damping = sim.isFalling ? 0.98 : 0.95;

      // 1. Particle forces & Verlet integration
      const time = sim.time;
      for (let i = 0; i < sim.particles.length; i++) {
        const p = sim.particles[i];
        if (p.pinned) continue;

        // Subtle gentle wind ripple for silk life
        const ripple = Math.sin(time * 3 + p.y * 0.8 + p.x * 0.4) * (sim.isFalling ? 0.8 : 0.12);
        const flutterZ = Math.cos(time * 2.5 + p.x * 0.9) * (sim.isFalling ? 1.2 : 0.08);

        p.vx = (p.x - p.ox) * damping;
        p.vy = (p.y - p.oy) * damping + gravity * dt * dt;
        p.vz = (p.z - p.oz) * damping + (ripple + flutterZ) * dt * dt;

        p.ox = p.x;
        p.oy = p.y;
        p.oz = p.z;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
      }

      // 2. Satisfy Constraints (Relaxation loop)
      const iterations = sim.isFalling ? 3 : 5;
      for (let iter = 0; iter < iterations; iter++) {
        for (let j = 0; j < sim.constraints.length; j++) {
          const [idx1, idx2, restDist] = sim.constraints[j];
          const p1 = sim.particles[idx1];
          const p2 = sim.particles[idx2];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
          const currentDist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
          const diff = (currentDist - restDist) / currentDist;

          const offsetX = dx * 0.5 * diff;
          const offsetY = dy * 0.5 * diff;
          const offsetZ = dz * 0.5 * diff;

          if (!p1.pinned) {
            p1.x += offsetX;
            p1.y += offsetY;
            p1.z += offsetZ;
          }
          if (!p2.pinned) {
            p2.x -= offsetX;
            p2.y -= offsetY;
            p2.z -= offsetZ;
          }
        }
      }

      // 3. Update PlaneGeometry Vertex Buffer
      const posAttr = sim.clothGeometry.attributes.position;
      for (let i = 0; i < sim.particles.length; i++) {
        const p = sim.particles[i];
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
      sim.clothGeometry.computeVertexNormals();

      renderer.render(scene, camera);
    }

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    function handleResize() {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Handle Drag Gesture on Silk
  const touchStartY = useRef(0);
  const handlePointerDown = (e) => {
    touchStartY.current = e.clientY || e.touches?.[0]?.clientY || 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isDropping) return;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    const deltaY = clientY - touchStartY.current;
    if (deltaY > 0) {
      const progress = Math.min(deltaY / 180, 1);
      setDragProgress(progress);

      // Displace top particles downwards with spring
      const sim = simRef.current;
      if (sim && !sim.isFalling) {
        sim.particles.forEach((p, idx) => {
          if (idx < sim.cols) {
            p.y = sim.clothHeight / 2 - progress * 1.8;
          }
        });
      }

      if (progress >= 0.85) {
        setIsDragging(false);
        triggerDrop();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragProgress >= 0.6) {
      triggerDrop();
    } else {
      setDragProgress(0);
      // Reset top row pins
      const sim = simRef.current;
      if (sim && !sim.isFalling) {
        sim.particles.forEach((p, idx) => {
          if (idx < sim.cols) {
            p.y = sim.clothHeight / 2;
          }
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-screen min-h-[720px] max-h-[1050px] bg-[#efebe4] overflow-hidden select-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
    >
      {/* ── 1. Minimalist Haute Couture Header Strip ─────────────────────── */}
      <div className="relative z-30 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[#0e0d0c]/10 text-[#0e0d0c]">
        {/* Left Links */}
        <div className="hidden md:flex items-center gap-7 text-[11px] font-bold tracking-[0.2em] uppercase">
          <Link href="/shop" className="hover:opacity-60 transition-opacity">
            COLLECTIONS
          </Link>
          <Link href="/shop?featured=true" className="hover:opacity-60 transition-opacity">
            CAMPAIGN
          </Link>
          <Link href="/shop" className="hover:opacity-60 transition-opacity">
            SHOP
          </Link>
          <Link href="/about" className="hover:opacity-60 transition-opacity">
            JOURNAL
          </Link>
        </div>

        {/* Center Minimalist Brand Typography */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-black tracking-[0.4em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0e0d0c] opacity-60" />
          <Link href="/" className="hover:opacity-75 transition-opacity">
            {brandName}
          </Link>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0e0d0c] opacity-60" />
        </div>

        {/* Right Links & Bag */}
        <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.2em] uppercase">
          <Link href="/contact" className="hidden sm:inline hover:opacity-60 transition-opacity">
            STORES
          </Link>
          <Link href="/search" className="hidden sm:inline hover:opacity-60 transition-opacity">
            SEARCH
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 hover:opacity-60 transition-opacity"
          >
            <span>BAG ({itemCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Top-Left Editorial Kicker & Interactive Drop Button ────────── */}
      <div className="absolute top-24 sm:top-28 left-6 sm:left-12 z-20 space-y-1.5 text-[#0e0d0c] pointer-events-auto">
        <p className="text-[11px] font-mono tracking-widest uppercase font-semibold text-neutral-600">
          {currentLook.season} — {currentLook.collection}
        </p>
        <p className="text-[11px] font-mono tracking-widest uppercase font-bold text-neutral-900">
          READY-TO-WEAR — #{currentLook.number}-09
        </p>
        <button
          type="button"
          onClick={triggerDrop}
          disabled={isDropping}
          className="mt-3 group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e0d0c]/5 hover:bg-[#0e0d0c] text-[#0e0d0c] hover:text-white border border-[#0e0d0c]/15 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-xs"
        >
          <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          <span>{isDropping ? "DROPPING SILK..." : "PULL THE SILK TO DROP THE NEXT LOOK"}</span>
        </button>
      </div>

      {/* ── 3. Underlying Static Look Image (Revealed when silk drops) ───── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-[620px] sm:max-w-[720px] lg:max-w-[820px] h-[78vh] max-h-[820px] rounded-lg overflow-hidden">
          <Image
            src={nextLook.image}
            alt={nextLook.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter grayscale contrast-105 opacity-90 transition-opacity duration-700"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#efebe4]/80 via-transparent to-[#efebe4]/30" />
        </div>
      </div>

      {/* ── 4. Three.js Realtime 3D Cloth Simulation Canvas ───────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
      />

      {/* ── 5. Bottom Right Floating Look Card ───────────────────────────── */}
      <div className="absolute bottom-28 sm:bottom-32 right-6 sm:right-12 z-20 pointer-events-auto">
        <div className="w-[300px] sm:w-[340px] p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-[#0e0d0c]/10 shadow-2xl space-y-3.5 transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-500">
            <span>LOOK {currentLook.number} / 09</span>
            <button
              onClick={triggerDrop}
              className="flex items-center gap-1 text-[10px] text-neutral-800 hover:text-black font-bold uppercase transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>+ UNROLL LOOK</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight leading-tight">
              {currentLook.title}
            </h3>
            <p className="text-xs text-neutral-500 font-normal leading-relaxed line-clamp-2">
              {currentLook.description}
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="font-mono text-base sm:text-lg font-bold text-neutral-900">
              {currentLook.price}
            </span>
            <Link
              href={currentLook.link}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors group"
            >
              <span>SHOP THE LOOK</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 6. Bottom Giant Edge-to-Edge Typography: OSTRANDE / LIGGLO ────── */}
      <div className="relative z-20 w-full overflow-hidden pointer-events-none -mb-3 sm:-mb-5">
        <h1 className="font-syne font-black text-[17vw] sm:text-[18.2vw] text-[#0e0d0c] leading-none tracking-[-0.04em] uppercase text-center w-full select-none">
          {brandName}
        </h1>
      </div>
    </div>
  );
}
