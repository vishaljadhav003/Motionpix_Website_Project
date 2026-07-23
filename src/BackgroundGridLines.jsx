import { useEffect, useMemo, useRef } from "react";
import "./BackgroundGridLines.css";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clamp01 = (value) => clamp(value, 0, 1);
const smooth01 = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export default function BackgroundGridLines() {
  const svgRef = useRef(null);
  const pathsRef = useRef([]);

  const percentsDesktop = useMemo(() => [8, 26, 50, 74, 97], []);
  const percentsMobile = useMemo(() => [18, 50, 82], []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const getPercents = () => {
      const isMobile = (window.innerWidth || 0) < 768;
      return isMobile ? percentsMobile : percentsDesktop;
    };

    const pointsToPath = (points) => {
      if (points.length < 2) return "";

      const d = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;

        d.push(
          `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(
            2
          )} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
      }

      return d.join(" ");
    };

    const ropeWeight = (t, tGrab) => {
      const endFade = Math.sin(Math.PI * t);
      const dist = Math.abs(t - tGrab);
      const nearGrab = smooth01(clamp01(1 - dist / 0.45));
      return endFade * nearGrab;
    };

    const size = { w: 0, h: 0 };
    let percents = getPercents();
    const state = [];
    const MAX_LINES = 5;

    const buildState = () => {
      percents = getPercents();
      state.length = 0;

      for (let i = 0; i < percents.length; i++) {
        state.push({
          x: 0,
          vx: 0,
          tx: 0,
          a: 0,
          ta: 0,
          wasActive: false,
          kick: 0,
        });
      }

      for (let i = 0; i < MAX_LINES; i++) {
        const path = pathsRef.current[i];
        if (!path) continue;

        if (i < percents.length) {
          path.style.display = "block";
        } else {
          path.style.display = "none";
          path.setAttribute("d", "");
        }
      }
    };

    const updateSize = () => {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;

      size.w = Math.max(1, Math.floor(vw));
      size.h = Math.max(1, Math.floor(vh));

      svg.setAttribute("viewBox", `0 0 ${size.w} ${size.h}`);
    };

    updateSize();
    buildState();

    let px = -9999;
    let py = size.h * 0.5;
    let lastX = px;
    let lastY = py;
    let lastT = performance.now();
    let motion = 0;
    let motionTarget = 0;

    const SPEED_GAIN = 1.8;
    const MOTION_EASE = 0.07;
    const SPEED_DEADZONE = 0.015;

    const SPRING_K = 0.07;
    const DAMPING = 0.92;
    const MAX_V = 34;
    const EASE_A = 0.1;
    const SNAP_MULT = 1.15;
    const KICK_AMOUNT = 0.14;
    const KICK_DECAY = 0.92;
    const SEGMENTS = 36;

    const RADIUS_X = () => clamp(size.w * 0.12, 90, 190);
    const MAX_PULL = () => clamp(size.w * 0.06, 28, 92);

    const updatePointer = (clientX, clientY) => {
      px = clientX;
      py = clientY;

      const now = performance.now();
      const dt = Math.max(16, now - lastT);

      const dx = px - lastX;
      const dy = py - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      const s = Math.max(0, speed - SPEED_DEADZONE);
      motionTarget = clamp01(s * SPEED_GAIN);

      lastX = px;
      lastY = py;
      lastT = now;
    };

    const onPointerMove = (e) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (!e.touches?.length) return;
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onPointerLeave = () => {
      px = -9999;
      motionTarget = 0;
    };

    const onResize = () => {
      updateSize();
      const nextPercents = getPercents();
      const changed =
        nextPercents.length !== percents.length ||
        nextPercents.some((v, i) => v !== percents[i]);

      if (changed) buildState();
    };

    let raf = 0;

    const drawStatic = () => {
      for (let i = 0; i < percents.length; i++) {
        const pathEl = pathsRef.current[i];
        if (!pathEl) continue;

        const xBase = (percents[i] / 100) * size.w;
        const points = [];

        for (let s = 0; s <= SEGMENTS; s++) {
          const t = s / SEGMENTS;
          points.push({ x: xBase, y: t * size.h });
        }

        pathEl.setAttribute("d", pointsToPath(points));
        pathEl.style.opacity = "0.18";
      }
    };

    const animate = () => {
      motion = lerp(motion, motionTarget, MOTION_EASE);

      const rx = RADIUS_X();
      const maxPull = MAX_PULL();

      let activeIdx = -1;
      let bestDx = Infinity;

      if (px > -1000) {
        for (let i = 0; i < percents.length; i++) {
          const xBase = (percents[i] / 100) * size.w;
          const dx = Math.abs(px - xBase);
          if (dx < bestDx) {
            bestDx = dx;
            activeIdx = i;
          }
        }
      }

      const tGrab = clamp01(py / size.h);

      for (let i = 0; i < percents.length; i++) {
        const pathEl = pathsRef.current[i];
        if (!pathEl) continue;

        const xBase = (percents[i] / 100) * size.w;
        const isActiveLine = i === activeIdx && px > -1000;
        const dx = Math.abs(px - xBase);
        const ax = smooth01(clamp01(1 - dx / rx));
        const aTarget = isActiveLine ? ax * motion : 0;

        state[i].ta = aTarget;

        const raw = px - xBase;
        const pull = clamp(raw, -maxPull, maxPull) * aTarget;
        state[i].tx = pull;

        const nowActive = aTarget > 0.01;
        const justActivated = nowActive && !state[i].wasActive;
        state[i].wasActive = nowActive;

        if (justActivated) {
          state[i].vx += (state[i].tx - state[i].x) * SNAP_MULT;
          state[i].kick = state[i].tx * KICK_AMOUNT;
        }

        state[i].a = lerp(state[i].a, state[i].ta, EASE_A);
        state[i].kick *= KICK_DECAY;

        const target = state[i].tx + state[i].kick;
        const force = (target - state[i].x) * SPRING_K;

        state[i].vx = (state[i].vx + force) * DAMPING;
        state[i].vx = clamp(state[i].vx, -MAX_V, MAX_V);
        state[i].x += state[i].vx;

        const points = [];
        for (let s = 0; s <= SEGMENTS; s++) {
          const t = s / SEGMENTS;
          const y = t * size.h;
          const weight = ropeWeight(t, tGrab) * state[i].a;

          points.push({
            x: xBase + state[i].x * weight,
            y,
          });
        }

        pathEl.setAttribute("d", pointsToPath(points));
        pathEl.style.opacity = String(0.18 + 0.55 * state[i].a);
      }

      raf = requestAnimationFrame(animate);
    };

    if (prefersReduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [percentsDesktop, percentsMobile]);

  return (
    <div className="bg-lines-wrapper" aria-hidden="true">
      <svg
        ref={svgRef}
        className="bg-lines-svg"
        preserveAspectRatio="none"
        role="presentation"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            ref={(el) => {
              pathsRef.current[i] = el;
            }}
            className="bg-path"
            d=""
          />
        ))}
      </svg>
    </div>
  );
}