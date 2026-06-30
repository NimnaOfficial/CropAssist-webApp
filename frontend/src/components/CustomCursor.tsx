"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * CropCursor — A unique agriculture-themed custom cursor.
 * 
 * Renders a canvas-based cursor with:
 * - A tiny crosshair "seed" dot at the exact mouse position
 * - A trailing organic ring that follows with spring-like easing  
 * - Sprouting particle trails that grow upwards like seedlings when moving
 * - On hover over clickable elements, the ring blooms larger with a green glow
 * 
 * All rendered on a single <canvas> for maximum performance.
 */
export default function CropCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[]>([]);
  const lastMouse = useRef({ x: -100, y: -100 });
  const frameId = useRef<number>(0);

  const spawnParticle = useCallback(() => {
    const dx = mouse.current.x - lastMouse.current.x;
    const dy = mouse.current.y - lastMouse.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    if (speed > 3 && particles.current.length < 30) {
      particles.current.push({
        x: mouse.current.x + (Math.random() - 0.5) * 8,
        y: mouse.current.y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.5 + 0.5), // Float upward like a growing sprout
        life: 1,
        maxLife: 30 + Math.random() * 20,
        size: Math.random() * 3 + 1.5,
      });
    }
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      lastMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) isVisible.current = true;
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      );
    };

    const onMouseLeave = () => { isVisible.current = false; };
    const onMouseEnter = () => { isVisible.current = true; };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerleave", onMouseLeave);
    document.addEventListener("pointerenter", onMouseEnter);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isVisible.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      // Spring-follow for the ring
      const ease = 0.12;
      ring.current.x += (mouse.current.x - ring.current.x) * ease;
      ring.current.y += (mouse.current.y - ring.current.y) * ease;

      const hover = isHovering.current;
      const ringSize = hover ? 28 : 18;

      // Spawn particles when moving
      spawnParticle();

      // Update & draw particles (tiny floating seed/leaf shapes)
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.98; // Slow the float
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        
        if (alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = `hsl(${130 + Math.random() * 20}, 70%, 50%)`;
        
        // Draw a tiny leaf shape
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, (p.life * 0.05), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        return true;
      });

      // ─── OUTER RING ───
      ctx.save();
      ctx.strokeStyle = hover ? "rgba(34, 197, 94, 0.7)" : "rgba(34, 197, 94, 0.35)";
      ctx.lineWidth = hover ? 2 : 1.5;
      ctx.beginPath();
      ctx.arc(ring.current.x, ring.current.y, ringSize, 0, Math.PI * 2);
      ctx.stroke();

      // Glow effect on hover
      if (hover) {
        ctx.shadowColor = "rgba(34, 197, 94, 0.4)";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "rgba(34, 197, 94, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ring.current.x, ring.current.y, ringSize + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // ─── CENTER CROSSHAIR SEED ───
      ctx.save();
      const cx = mouse.current.x;
      const cy = mouse.current.y;

      if (hover) {
        // On hover: pulsing filled circle
        ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal: tiny crosshair with a dot
        ctx.fillStyle = "rgba(34, 197, 94, 1)";
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair lines
        ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
        ctx.lineWidth = 1;
        const gap = 5;
        const len = 8;
        // Top
        ctx.beginPath(); ctx.moveTo(cx, cy - gap); ctx.lineTo(cx, cy - gap - len); ctx.stroke();
        // Bottom — a tiny stem
        ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + gap + len + 2); ctx.stroke();
        // Left
        ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - gap, cy); ctx.lineTo(cx - gap - len, cy); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + gap + len, cy); ctx.stroke();

        // Tiny leaf on top-right
        ctx.fillStyle = "rgba(34, 197, 94, 0.6)";
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy - gap - len - 2, 3, 1.5, -0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      frameId.current = requestAnimationFrame(animate);
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onMouseLeave);
      document.removeEventListener("pointerenter", onMouseEnter);
    };
  }, [spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
