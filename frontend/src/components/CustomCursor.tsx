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

      // ─── MINIMALIST LEAF CURSOR ───
      ctx.save();
      const cx = ring.current.x;
      const cy = ring.current.y;

      if (hover) {
        // On hover: larger glowing dot
        ctx.shadowColor = "rgba(34, 197, 94, 0.8)";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "rgba(34, 197, 94, 1)";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Tiny glowing leaf tip
        ctx.beginPath();
        ctx.ellipse(cx + 4, cy - 4, 5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal: crisp green dot with a subtle leaf
        ctx.shadowColor = "rgba(34, 197, 94, 0.4)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(34, 197, 94, 1)";
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tiny leaf sprout
        ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy - 3, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
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
