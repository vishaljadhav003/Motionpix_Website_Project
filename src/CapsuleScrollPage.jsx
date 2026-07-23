import React, { useEffect, useRef, useState } from "react";
import "./CapsuleScrollPage.css";

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export default function CapsuleScrollPage() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const railRef = useRef(null);

  const durationRef = useRef(0);
  const safeStartRef = useRef(0.06);
  const safeEndRef = useRef(0.06);

  const targetRef = useRef(0);
  const currentRef = useRef(0);

  const rafRef = useRef(0);
  const seekingRef = useRef(false);
  const lastTsRef = useRef(0);

  const pinnedRef = useRef(false);
  const justEnteredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const syncingScrollRef = useRef(false);

  const [dragProgress, setDragProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const rail = railRef.current;

    if (!section || !pin || !canvas || !video || !rail) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.pause();

    const getAvailableHeight = () => {
      const navH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
        ) || 0;

      return Math.max(1, (window.innerHeight || 1) - navH);
    };

    const resizeCanvas = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCover = () => {
      const cw = canvas.clientWidth || 1;
      const ch = canvas.clientHeight || 1;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      if (!video.videoWidth || !video.videoHeight) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      const cr = cw / ch;
      const vr = vw / vh;

      let dw, dh, dx, dy;

      if (vr > cr) {
        dh = ch;
        dw = ch * vr;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / vr;
        dx = 0;
        dy = (ch - dh) / 2;
      }

      ctx.drawImage(video, dx, dy, dw, dh);
    };

    const seekTo = (t) => {
      const d = durationRef.current;
      if (!d) return;
      if (seekingRef.current) return;

      const delta = Math.abs(video.currentTime - t);

      if (delta < 1 / 24) {
        drawCover();
        return;
      }

      seekingRef.current = true;

      try {
        if (typeof video.fastSeek === "function") {
          video.fastSeek(t);
        } else {
          video.currentTime = t;
        }
      } catch {
        seekingRef.current = false;
      }
    };

    const onSeeked = () => {
      seekingRef.current = false;
      drawCover();
    };

    const getSectionMetrics = () => {
      const rect = section.getBoundingClientRect();
      const availableH = getAvailableHeight();
      const total = Math.max(1, rect.height - availableH);
      const scrolled = clamp(-rect.top, 0, total);

      return {
        rect,
        total,
        scrolled,
        availableH,
      };
    };

    const getProgress = () => {
      const { total, scrolled } = getSectionMetrics();
      return clamp01(scrolled / total);
    };

    const setPinned = (nextPinned) => {
      if (pinnedRef.current === nextPinned) return;

      if (!pinnedRef.current && nextPinned) {
        justEnteredRef.current = true;
      }

      pinnedRef.current = nextPinned;
      pin.classList.toggle("isPinned", nextPinned);
    };

    const applyProgress = (p) => {
      const d = durationRef.current;
      if (!d) return;

      const safeP = clamp01(p);
      const s = safeStartRef.current;
      const e = safeEndRef.current;

      targetRef.current = s + safeP * (e - s);
      setDragProgress(safeP);
    };

    const syncWindowScrollToProgress = (p) => {
      const safeP = clamp01(p);
      const rect = section.getBoundingClientRect();
      const availableH = getAvailableHeight();
      const total = Math.max(1, section.offsetHeight - availableH);

      const sectionTopAbs = window.scrollY + rect.top;
      const nextScrollY = sectionTopAbs + safeP * total;

      syncingScrollRef.current = true;
      window.scrollTo({
        top: nextScrollY,
        behavior: "auto",
      });

      requestAnimationFrame(() => {
        syncingScrollRef.current = false;
      });
    };

    const updatePinnedAndTarget = () => {
      const rect = section.getBoundingClientRect();
      const availableH = getAvailableHeight();

      const inView = rect.top < availableH && rect.bottom > 0;
      setPinned(inView);

      const d = durationRef.current;
      if (!d) return;

      if (isDraggingRef.current) return;

      const p = getProgress();
      applyProgress(p);

      if (justEnteredRef.current) {
        justEnteredRef.current = false;
        currentRef.current = targetRef.current;
        seekTo(currentRef.current);
      }
    };

    const tick = (ts) => {
      rafRef.current = 0;

      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 1 / 60;
      lastTsRef.current = ts;

      const smoothSpeed = 4.2;
      const k = 1 - Math.exp(-smoothSpeed * dt);

      const s = safeStartRef.current;
      const e = safeEndRef.current;

      currentRef.current =
        currentRef.current + (targetRef.current - currentRef.current) * k;

      currentRef.current = clamp(currentRef.current, s, e);

      seekTo(currentRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    const onLoadedMetadata = async () => {
      const d = Number.isFinite(video.duration) ? video.duration : 0;
      durationRef.current = d;

      const EPS = 0.06;
      safeStartRef.current = EPS;
      safeEndRef.current = Math.max(EPS, d - EPS);

      resizeCanvas();

      currentRef.current = safeStartRef.current;
      targetRef.current = safeStartRef.current;

      try {
        await video.play();
        video.pause();
      } catch {}

      updatePinnedAndTarget();
      seekTo(currentRef.current);
      drawCover();
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (syncingScrollRef.current) return;

      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updatePinnedAndTarget();
      });
    };

    const getProgressFromPointer = (clientY) => {
      const rect = rail.getBoundingClientRect();
      const y = clamp(clientY - rect.top, 0, rect.height);
      return clamp01(y / rect.height);
    };

    const startDrag = (clientY) => {
      isDraggingRef.current = true;
      const p = getProgressFromPointer(clientY);
      applyProgress(p);
      currentRef.current = targetRef.current;
      seekTo(currentRef.current);
      syncWindowScrollToProgress(p);
    };

    const moveDrag = (clientY) => {
      if (!isDraggingRef.current) return;
      const p = getProgressFromPointer(clientY);
      applyProgress(p);
      syncWindowScrollToProgress(p);
    };

    const endDrag = () => {
      isDraggingRef.current = false;
      updatePinnedAndTarget();
    };

    const onPointerDown = (e) => {
      e.preventDefault();
      startDrag(e.clientY);
    };

    const onPointerMove = (e) => {
      moveDrag(e.clientY);
    };

    const onPointerUp = () => {
      endDrag();
    };

    const onTouchStart = (e) => {
      if (!e.touches?.length) return;
      startDrag(e.touches[0].clientY);
    };

    const onTouchMove = (e) => {
      if (!e.touches?.length) return;
      moveDrag(e.touches[0].clientY);
    };

    const onTouchEnd = () => {
      endDrag();
    };

    rail.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    rail.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const ro = new ResizeObserver(() => {
      resizeCanvas();
      drawCover();
    });
    ro.observe(canvas);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);

    resizeCanvas();
    drawCover();
    updatePinnedAndTarget();
    rafRef.current = requestAnimationFrame(tick);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    return () => {
      ro.disconnect();

      rail.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      rail.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);

      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ctWrap">
      <div className="ctScrollSpace" />

      <div ref={pinRef} className="ctPin">
        <canvas ref={canvasRef} id="scroll-canvas" />

        <div className="ctJoystickWrap" aria-label="Video progress controller">
          <div ref={railRef} className="ctJoystickRail">
            <div
              className="ctJoystickFill"
              style={{ height: `${dragProgress * 100}%` }}
            />
            <button
              type="button"
              className="ctJoystickThumb"
              style={{ top: `${dragProgress * 100}%` }}
              aria-label="Drag to control video"
            />
          </div>
        </div>
      </div>

      <video
        ref={videoRef}
        className="ctHiddenVideo"
        muted
        playsInline
        preload="auto"
      >
        <source src="/WaterAnimation V2.mp4" type="video/mp4" />
      </video>
    </section>
  );
}