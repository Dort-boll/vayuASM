import React, { useState, useEffect, useRef } from 'react';
import { Shield, ChevronRight, Globe, Activity, Database, Cpu, Terminal, ShieldCheck } from 'lucide-react';

interface SecureGatewayProps {
  onUnlock: () => void;
  systemTime: string;
}

export default function SecureGateway({ onUnlock, systemTime }: SecureGatewayProps) {
  // Preloader State
  const [preloaderProgress, setPreloaderProgress] = useState(0);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  // Typewriter Terminal state
  const [twText, setTwText] = useState('');

  // Slider Drag-to-Unlock state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeState, setSwipeState] = useState<'idle' | 'dragging' | 'processing' | 'success'>('idle');
  const [isDrag, setIsDrag] = useState(false);
  const [curX, setCurX] = useState(0);

  // Statistics State
  const [statScanners, setStatScanners] = useState(4.2);
  const [statTargets, setStatTargets] = useState(1204);
  const [scannersSub, setScannersSub] = useState(12402);

  // Cursor Tracking State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorRingPos, setCursorRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. PRELOADER LOADING CYCLE
  useEffect(() => {
    let prog = 0;
    const preInt = setInterval(() => {
      prog += Math.random() * 8 + 4;
      if (prog >= 100) {
        prog = 100;
        clearInterval(preInt);
        setTimeout(() => {
          setIsPreloaderVisible(false);
        }, 600);
      }
      setPreloaderProgress(Math.floor(prog));
    }, 100);
    return () => clearInterval(preInt);
  }, []);

  // 2. STABLE 60FPS THREAT MAP CANVAS ENGINE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let centerX = W / 2;
    let centerY = H / 2;

    class MapNode {
      x: number;
      y: number;
      baseSize: number;
      phase: number;
      constructor(x: number, y: number, s: number) {
        this.x = x;
        this.y = y;
        this.baseSize = s;
        this.phase = Math.random() * Math.PI * 2;
      }
      draw(t: number, context: CanvasRenderingContext2D) {
        const p = Math.sin(t * 0.002 + this.phase) * 0.5 + 0.5;
        const s = this.baseSize + p * 3;
        context.beginPath();
        context.arc(this.x, this.y, s + 10, 0, Math.PI * 2);
        context.fillStyle = `rgba(79,195,247,${0.03 + p * 0.03})`;
        context.fill();
        context.beginPath();
        context.arc(this.x, this.y, s, 0, Math.PI * 2);
        context.fillStyle = `rgba(79,195,247,${0.8 + p * 0.2})`;
        context.fill();
      }
    }

    class MapRing {
      radius: number;
      angle: number;
      speed: number;
      dots: Array<{ offset: number; size: number; color: string }>;
      constructor(r: number, s: number) {
        this.radius = r;
        this.angle = 0;
        this.speed = s;
        this.dots = [];
        const count = 30 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
          this.dots.push({
            offset: Math.random() * Math.PI * 2,
            size: 0.5 + Math.random() * 1.5,
            color: Math.random() > 0.8 ? '255,61,61' : '79,195,247'
          });
        }
      }
      update() {
        this.angle += this.speed;
      }
      draw(context: CanvasRenderingContext2D, cx: number, cy: number) {
        context.beginPath();
        context.arc(cx, cy, this.radius, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(255,255,255,0.015)';
        context.lineWidth = 1;
        context.stroke();
        this.dots.forEach(d => {
          const a = this.angle + d.offset;
          const x = cx + Math.cos(a) * this.radius;
          const y = cy + Math.sin(a) * this.radius;
          context.beginPath();
          context.arc(x, y, d.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(${d.color},0.6)`;
          context.fill();
        });
      }
    }

    class MapAttack {
      sx!: number;
      sy!: number;
      ex!: number;
      ey!: number;
      progress!: number;
      speed!: number;
      tailLength!: number;
      color!: string;
      width!: number;
      constructor() {
        this.reset();
      }
      reset() {
        const a = Math.random() * Math.PI * 2;
        const d = Math.max(W, H);
        this.sx = centerX + Math.cos(a) * d;
        this.sy = centerY + Math.sin(a) * d;
        this.ex = centerX + (Math.random() - 0.5) * 250;
        this.ey = centerY + (Math.random() - 0.5) * 250;
        this.progress = 0;
        this.speed = 0.008 + Math.random() * 0.015;
        this.tailLength = 0.15 + Math.random() * 0.2;
        this.color = Math.random() > 0.5 ? '255,61,61' : '255,202,40';
        this.width = 0.5 + Math.random() * 1.5;
      }
      update() {
        this.progress += this.speed;
        if (this.progress > 1 + this.tailLength) {
          this.reset();
        }
      }
      draw(context: CanvasRenderingContext2D) {
        const hx = this.sx + (this.ex - this.sx) * this.progress;
        const hy = this.sy + (this.ey - this.sy) * this.progress;
        const tp = Math.max(0, this.progress - this.tailLength);
        const tx = this.sx + (this.ex - this.sx) * tp;
        const ty = this.sy + (this.ey - this.sy) * tp;
        const g = context.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, `rgba(${this.color},0)`);
        g.addColorStop(1, `rgba(${this.color},0.8)`);
        context.beginPath();
        context.moveTo(tx, ty);
        context.lineTo(hx, hy);
        context.strokeStyle = g;
        context.lineWidth = this.width;
        context.stroke();
        context.beginPath();
        context.arc(hx, hy, this.width + 0.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color},1)`;
        context.fill();
      }
    }

    class MapWave {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 0.4;
      }
      update() {
        this.radius += 1.5;
        this.alpha -= 0.008;
      }
      draw(context: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255,61,61,${this.alpha})`;
        context.lineWidth = 1;
        context.stroke();
      }
      isDead() {
        return this.alpha <= 0;
      }
    }

    let nodes: MapNode[] = [];
    let rings: MapRing[] = [];
    let attacks: MapAttack[] = [];
    let waves: MapWave[] = [];
    let heartbeat = 1.0;
    let lastBeat = 0;
    let frameCount = 0;

    function init() {
      nodes = [];
      rings = [];
      attacks = [];
      waves = [];
      for (let i = 0; i < 5; i++) {
        nodes.push(new MapNode(centerX + (Math.random() - 0.5) * 300, centerY + (Math.random() - 0.5) * 300, 2 + Math.random() * 2));
      }
      rings.push(new MapRing(Math.min(W, H) * 0.15, 0.0004));
      rings.push(new MapRing(Math.min(W, H) * 0.25, -0.0006));
      rings.push(new MapRing(Math.min(W, H) * 0.35, 0.0002));
      for (let i = 0; i < 35; i++) {
        attacks.push(new MapAttack());
      }
    }

    init();

    let animationId: number;
    function render(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      frameCount++;

      if (t - lastBeat > 1000) {
        lastBeat = t;
        heartbeat = 1.02;
      } else {
        heartbeat += (1.0 - heartbeat) * 0.05;
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(heartbeat, heartbeat);
      ctx.translate(-centerX, -centerY);

      ctx.strokeStyle = 'rgba(255,255,255,0.008)';
      ctx.lineWidth = 1;
      const gs = 100;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      rings.forEach(r => {
        r.update();
        r.draw(ctx, centerX, centerY);
      });
      attacks.forEach(a => {
        a.update();
        a.draw(ctx);
      });
      nodes.forEach(n => n.draw(t, ctx));

      if (frameCount % 60 === 0 && nodes.length > 0) {
        const rn = nodes[Math.floor(Math.random() * nodes.length)];
        waves.push(new MapWave(rn.x, rn.y));
      }

      waves.forEach(w => {
        w.update();
        w.draw(ctx);
      });
      waves = waves.filter(w => !w.isDead());

      ctx.restore();
      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      centerX = W / 2;
      centerY = H / 2;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 3. ADVANCED TYPEWRITER WITH TYPO CORRECTION
  useEffect(() => {
    const textArr = [
      "> Resolving global IPV4 space... [OK]",
      "> Bypassing IDS/IPS signaturess... [WAIT]", 
      "> Bypassing IDS/IPS signatures... [OK]",   
      "> Mapping target topology... [DONE]",
      "> Awaiting operator biometric auth..."
    ];
    let tIdx = 0;
    let cIdx = 0;
    let isDel = false;
    let timer: NodeJS.Timeout;

    function typeLoop() {
      const cur = textArr[tIdx];
      if (!isDel) {
        setTwText(cur.substring(0, cIdx + 1));
        cIdx++;
        if (cIdx === cur.length) {
          isDel = true;
          const waitTime = cur.includes('[WAIT]') ? 800 : 2500;
          timer = setTimeout(typeLoop, waitTime);
          return;
        }
        timer = setTimeout(typeLoop, 20 + Math.random() * 30);
      } else {
        setTwText(cur.substring(0, cIdx - 1));
        cIdx--;
        if (cIdx === 0) {
          isDel = false;
          tIdx = (tIdx + 1) % textArr.length;
          timer = setTimeout(typeLoop, 500);
          return;
        }
        const delTime = cur.includes('[WAIT]') ? 15 : 10000;
        timer = setTimeout(typeLoop, delTime);
      }
    }

    const startTimer = setTimeout(typeLoop, 2000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, []);

  // 4. PREMIUM CURSOR TRACKING
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setShowCursor(true);

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rx = -100, ry = -100;
    let active = true;

    function curLoop() {
      if (!active) return;
      rx += (cursorPos.x - rx) * 0.15;
      ry += (cursorPos.y - ry) * 0.15;
      setCursorRingPos({ x: rx, y: ry });
      requestAnimationFrame(curLoop);
    }
    const rafId = requestAnimationFrame(curLoop);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cursorPos]);

  useEffect(() => {
    if (!showCursor) return;
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    const elements = document.querySelectorAll('button, [role="slider"]');
    elements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      elements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [showCursor, isPreloaderVisible]);

  // 5. RAPID STATS TICK
  const triggerStatTick = () => {
    let currentScanners = 4.2;
    let currentTargets = 1204;
    const interval = setInterval(() => {
      currentScanners += 0.01;
      currentTargets += Math.floor(Math.random() * 5);
      setStatScanners(currentScanners);
      setStatTargets(currentTargets);
      setScannersSub(12402 + currentTargets - 1204);
    }, 50);
    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  // 6. SWIPE TO UNLOCK MECHANICAL TRIGGERS
  const dStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (swipeState !== 'idle') return;
    setIsDrag(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const left = clientX - rect.left - 25;
      const max = rect.width - 60;
      const initialProgress = Math.max(0, Math.min(100, (left / max) * 100));
      setSwipeProgress(initialProgress);
      setCurX(Math.max(0, Math.min(max, left)));
    }
  };

  const dMove = (e: MouseEvent | TouchEvent) => {
    if (!isDrag || swipeState !== 'idle' || !sliderRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = sliderRef.current.getBoundingClientRect();
    const max = rect.width - 60;
    let left = clientX - rect.left - 25;
    if (left > max) left = max + (left - max) * 0.15;
    if (left < 0) left = 0;

    setCurX(left);
    let p = (left / max) * 100;
    if (p > 100) p = 100;
    setSwipeProgress(p);

    if (p > 10 && p < 90 && Math.random() > 0.7) {
      emitDragParticle(rect.left + left + 25, rect.top + 25);
    }
  };

  const dEnd = () => {
    if (!isDrag || swipeState !== 'idle') return;
    setIsDrag(false);

    if (swipeProgress >= 90) {
      setSwipeProgress(100);
      startUnlockSequence();
    } else {
      setSwipeProgress(0);
      setCurX(0);
    }
  };

  const startUnlockSequence = () => {
    setSwipeState('processing');

    setTimeout(() => {
      setSwipeState('success');

      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        spawnSuccessParticles(rect.right - 30, rect.top + 30);
      }

      triggerStatTick();

      setTimeout(() => {
        onUnlock();
      }, 1500);

    }, 1500);
  };

  useEffect(() => {
    if (isDrag) {
      window.addEventListener('mousemove', dMove);
      window.addEventListener('mouseup', dEnd);
      window.addEventListener('touchmove', dMove, { passive: false });
      window.addEventListener('touchend', dEnd);
    }
    return () => {
      window.removeEventListener('mousemove', dMove);
      window.removeEventListener('mouseup', dEnd);
      window.removeEventListener('touchmove', dMove);
      window.removeEventListener('touchend', dEnd);
    };
  }, [isDrag, swipeProgress]);

  // PARTICLES UTILS
  const emitDragParticle = (x: number, y: number) => {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed; width:2px; height:2px; border-radius:50%; background:#4fc3f7; pointer-events:none; z-index:9999; left:${x}px; top:${y}px; opacity:0.6;`;
    document.body.appendChild(p);
    const dx = (Math.random() - 0.5) * 30;
    const dy = (Math.random() - 0.5) * 30;
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 0.6 },
      { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
    ], {
      duration: 400,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => p.remove();
  };

  const spawnSuccessParticles = (x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed; width:3px; height:3px; border-radius:50%; background:#00e676; pointer-events:none; z-index:9999; left:${x}px; top:${y}px;`;
      document.body.appendChild(p);
      const a = (Math.PI * 2 * i) / 30;
      const v = 50 + Math.random() * 60;
      const dx = Math.cos(a) * v;
      const dy = Math.sin(a) * v;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0,.9,.57,1)',
        fill: 'forwards'
      }).onfinish = () => p.remove();
    }
  };

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

    .vayu-mono {
      font-family: 'IBM Plex Mono', monospace !important;
    }
    .vayu-sans {
      font-family: 'Inter', sans-serif !important;
    }

    .login-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255,255,255,0.05);
    }
    
    .login-card::before {
      content: ''; position: absolute; inset: 0; border-radius: 20px; padding: 1px;
      background: linear-gradient(135deg, #4fc3f7, transparent 40%, transparent 60%, #00e676);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      opacity: 0.5;
      animation: breatheBorder 4s ease-in-out infinite;
    }
    @keyframes breatheBorder {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }

    .login-card::after {
      content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%);
      transform: rotate(45deg) translateX(-100%);
      animation: glassSweep 6s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes glassSweep {
      0% { transform: rotate(45deg) translateX(-100%); }
      100% { transform: rotate(45deg) translateX(100%); }
    }

    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .tw-cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      background: #00e676;
      margin-left: 4px;
      vertical-align: text-bottom;
      animation: blink 0.8s infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .animate-spin-custom {
      animation: spin 3s linear infinite;
    }
  `;

  return (
    <div className="vayu-sans select-none relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* 1. PRELOADER */}
      {isPreloaderVisible && (
        <div id="preloader" className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-all duration-500">
          <div className="vayu-sans font-bold text-2xl tracking-[0.2em] mb-12 text-white">VAYU</div>
          <div className="w-[300px] h-[1px] bg-white/10 relative">
            <div 
              className="h-full bg-[#4fc3f7] absolute left-0 top-0 shadow-[0_0_10px_#4fc3f7] transition-all duration-200"
              style={{ width: `${preloaderProgress}%` }}
            ></div>
          </div>
          <div className="vayu-mono text-[10px] text-[#444444] mt-4">{preloaderProgress}%</div>
        </div>
      )}

      {/* 2. PREMIUM CURSOR */}
      {showCursor && (
        <>
          <div 
            className="w-2 h-2 bg-white rounded-full fixed pointer-events-none z-[9999] mix-blend-difference"
            style={{ 
              left: `${cursorPos.x}px`, 
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.3s, height 0.3s, background-color 0.3s'
            }}
          ></div>
          <div 
            className={`w-10 h-10 border rounded-full fixed pointer-events-none z-[9998] transition-all duration-300`}
            style={{ 
              left: `${cursorRingPos.x}px`, 
              top: `${cursorRingPos.y}px`,
              transform: 'translate(-50%, -50%)',
              borderColor: isHovered ? 'rgba(79, 195, 247, 0.4)' : 'rgba(255,255,255,0.3)',
              backgroundColor: isHovered ? 'rgba(79, 195, 247, 0.05)' : 'transparent',
              width: isHovered ? '60px' : '40px',
              height: isHovered ? '60px' : '40px'
            }}
          ></div>
        </>
      )}

      {/* 3. HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/85 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-3 font-bold text-base tracking-wide">
          <div className="w-2 h-2 bg-[#00e676] rounded-full shadow-[0_0_10px_#00e676] animate-pulse"></div>
          VAYU ASM
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 vayu-mono text-[10px] text-white/50">
            <span>IPV4: <strong className="text-white">4.2M</strong></span>
            <span>THREATS: <strong className="text-[#ff3d3d]">12.4%</strong></span>
            <span>NODES: <strong className="text-white">1,204</strong></span>
          </div>
          <button className="vayu-mono text-xs uppercase tracking-wider px-5 py-2 border border-white/10 hover:bg-white hover:text-black transition-all duration-300">
            Request Access
          </button>
        </div>
      </header>

      {/* 4. MAIN CONTAINER */}
      <main className="flex-1 w-full min-h-screen pt-16 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Dynamic Canvas Background */}
        <canvas ref={canvasRef} id="map-canvas" className="absolute inset-0 w-full h-full z-0 bg-[#020205]" />

        {/* LEFT PANEL */}
        <div className="relative z-10 w-full lg:w-[45%] h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 lg:py-24 border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-r from-black/95 via-black/90 to-black/80">
          <div className="vayu-mono text-[10px] uppercase tracking-[0.2em] text-[#4fc3f7] mb-8 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#4fc3f7] shadow-[0_0_5px_#4fc3f7]"></span>
            Real-Time Global Cyber Intelligence
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Internet<br />Background<br /><span className="text-white/40 font-light">Noise.</span>
          </h1>

          <div className="vayu-mono text-xs text-[#00e676] bg-black/50 border border-white/5 rounded-xs p-5 mb-10 min-h-[100px] flex items-center select-text">
            <span>{twText}</span>
            <span className="tw-cursor"></span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="border-t border-white/5 pt-4">
              <div className="vayu-mono text-[9px] text-[#444444] uppercase tracking-wider mb-2">Mass Scanners</div>
              <div className="text-2xl font-semibold text-[#ff3d3d] flex items-baseline gap-1.5 transition-all duration-300">
                {statScanners.toFixed(2)}M <span className="text-[10px] text-[#444444] font-normal">IPs</span>
              </div>
              <div className="vayu-mono text-[9px] text-[#444444] mt-1">+{scannersSub.toLocaleString()} last 24h</div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <div className="vayu-mono text-[9px] text-[#444444] uppercase tracking-wider mb-2">Benign Traffic</div>
              <div className="text-2xl font-semibold text-[#00e676] flex items-baseline gap-1.5">
                78% <span className="text-[10px] text-[#444444] font-normal">Filtered</span>
              </div>
              <div className="vayu-mono text-[9px] text-[#444444] mt-1">Zero false positives</div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <div className="vayu-mono text-[9px] text-[#444444] uppercase tracking-wider mb-2">Active Targets</div>
              <div className="text-2xl font-semibold text-[#ffca28] flex items-baseline gap-1.5">
                {statTargets.toLocaleString()} <span className="text-[10px] text-[#444444] font-normal">Nodes</span>
              </div>
              <div className="vayu-mono text-[9px] text-[#444444] mt-1">Monitored continuously</div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <div className="vayu-mono text-[9px] text-[#444444] uppercase tracking-wider mb-2">Data Ingestion</div>
              <div className="text-2xl font-semibold text-white flex items-baseline gap-1.5">
                10TB <span className="text-[10px] text-[#444444] font-normal">/ Day</span>
              </div>
              <div className="vayu-mono text-[9px] text-[#444444] mt-1">Raw packet analysis</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8 bg-black/60">
          <div className="login-card w-full max-w-[420px] rounded-[20px] p-10 relative overflow-hidden">
            <div className="mb-10 text-center relative z-10">
              <div className="w-14 h-14 mx-auto mb-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center text-[#4fc3f7] relative">
                <Shield className="w-6 h-6" />
                <div className="absolute inset-[-6px] rounded-[20px] border border-transparent border-t-[#4fc3f7]/50 animate-spin-custom"></div>
              </div>
              <h2 className="text-xl font-bold mb-1 tracking-tight">Operator Terminal</h2>
              <p className="vayu-mono text-[9px] text-[#444444] uppercase tracking-[0.15em]">AUTHENTICATE TO ACCESS INTEL GRID</p>
            </div>

            {/* Slider Track */}
            <div 
              ref={sliderRef}
              className={`relative h-16 bg-black/40 border rounded-xl overflow-hidden p-1.5 flex items-center select-none touch-none transition-all duration-300 z-10 ${
                swipeState === 'success' ? 'border-[#00e676]/30 bg-[#00e676]/5 shadow-[0_0_30px_rgba(0,230,118,0.1)]' : 'border-white/5'
              }`}
              onMouseMove={(e) => isDrag && dMove(e.nativeEvent)}
              onTouchMove={(e) => isDrag && e.touches.length > 0 && dMove(e.touches[0] as any)}
            >
              {/* Foreground active progress fill */}
              <div 
                className="absolute top-1 left-1 bottom-1 bg-gradient-to-r from-[#4fc3f7]/0 to-[#4fc3f7]/10 pointer-events-none transition-all duration-75"
                style={{ width: `${swipeProgress}%` }}
              ></div>

              {/* Slider Status Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                {swipeState === 'idle' && (
                  <span className="vayu-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                    DRAG TO UNLOCK TERMINAL
                  </span>
                )}
                {swipeState === 'processing' && (
                  <span className="vayu-mono text-[10px] text-[#ffca28] flex items-center gap-2 font-semibold">
                    <svg className="animate-spin h-3 w-3 text-[#ffca28]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    VERIFYING CREDENTIALS...
                  </span>
                )}
                {swipeState === 'success' && (
                  <span className="vayu-mono text-[10px] text-[#00e676] flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#00e676]" />
                    ACCESS GRANTED
                  </span>
                )}
              </div>

              {/* Slider Thumb Handle */}
              <div
                onMouseDown={dStart}
                onTouchStart={dStart}
                role="slider"
                aria-label="Swipe to login"
                tabIndex={0}
                className={`w-12 h-12 rounded-lg flex items-center justify-center z-20 cursor-grab active:cursor-grabbing transition-all ${
                  swipeState === 'success' 
                    ? 'bg-[#00e676] border-none text-black shadow-[0_0_20px_rgba(0,230,118,0.4)]'
                    : 'bg-white/5 border border-white/20 text-[#8b8b8b] hover:border-[#4fc3f7] hover:text-[#4fc3f7] hover:bg-[#4fc3f7]/5 hover:shadow-[0_0_15px_rgba(79,195,247,0.15)]'
                }`}
                style={{ 
                  transform: `translateX(${curX}px)`,
                  transition: isDrag ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, color 0.2s'
                }}
              >
                {swipeState === 'success' ? (
                  <ShieldCheck className="w-5 h-5 font-bold" />
                ) : (
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </div>
            </div>

            {/* Footer encryption metrics */}
            <div className="flex justify-between items-center font-mono text-[9px] text-[#444444] mt-10 relative z-10 uppercase tracking-widest">
              <span>AES-256-GCM ENCRYPTED</span>
              <div className="flex items-center gap-2 text-[#00e676]">
                <div className="w-1.5 h-1.5 bg-[#00e676] rounded-full shadow-[0_0_8px_#00e676] animate-pulse"></div>
                SECURE TUNNEL
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. FOOTER */}
      <footer className="w-full text-center py-6 border-t border-white/5 z-10 shrink-0 bg-black">
        <div className="vayu-mono text-[10px] text-white/40 uppercase tracking-[0.25em] mb-1">
          POWERED BY <span className="text-white font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] to-[#00e676]">C-S&AW</span> BY <span className="text-[#4fc3f7] font-black">RUDRATECH INC.</span>
        </div>
        <div className="vayu-mono text-[8px] text-white/20 uppercase tracking-widest">
          VAYU THREAT OPERATIONS CONSOLE &bull; PRIVILEGED DATA ENVIRONMENT &bull; LOCAL TIME: {systemTime.substring(11, 19)} UTC
        </div>
      </footer>
    </div>
  );
}
