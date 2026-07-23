import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Loader.css";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** Fast at start, slow at end (premium) */
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

export default function Loader({
  videoSrc = "/Loader 1.mp4",
  poster,
  onDone,
  exitMs: exitMsProp,
  speedBoost = 1.25, // ✅ increase to make faster (1.1 - 1.6 good)
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | exiting | done

  const videoRef = useRef(null);
  const rafRef = useRef(0);

  const cfg = useMemo(
    () => ({
      exitMs: typeof exitMsProp === "number" ? exitMsProp : 520,
    }),
    [exitMsProp]
  );

  const finish = () => {
    if (phase !== "loading") return;
    setPhase("exiting");

    window.setTimeout(() => {
      setPhase("done");
      if (typeof onDone === "function") onDone();
    }, cfg.exitMs);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tick = () => {
      if (phase !== "loading") return;

      const d = v.duration;
      const t = v.currentTime;

      if (Number.isFinite(d) && d > 0) {
        // ✅ 0..1
        const x = clamp(t / d, 0, 1);

        // ✅ make it "look faster": boost the time fraction, but keep within 0..1
        const boosted = clamp(x * speedBoost, 0, 1);

        // ✅ easing => fast start, smooth end
        const eased = easeOutCubic(boosted);

        setProgress(eased * 100);
      } else {
        setProgress((p) => clamp(p, 0, 1));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [phase, speedBoost]);

  if (phase === "done") return null;

  const animateOut = phase === "exiting";
  const shown = Math.round(progress);

  return (
    <div className={`lrLoader ${animateOut ? "animateOut" : ""}`}>
      <video
        ref={videoRef}
        className={`lrVideo ${animateOut ? "animateOut" : ""}`}
        src={videoSrc}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="metadata"
        controls={false}
        onEnded={() => {
          setProgress(100);
          finish();
        }}
      />

      {/* optional overlay if you have it */}
      <div className={`lrOverlay ${animateOut ? "animateOut" : ""}`} aria-hidden="true" />

      {/* your same badge */}
      <div className={`lrCorner ${animateOut ? "animateOut" : ""}`}>
        <svg className="lrBorderSvg" viewBox="0 0 100 100" aria-hidden="true">
          <rect className="lrBorderBase" x="6" y="6" width="88" height="88" rx="14" ry="14" />
          <rect
            className="lrBorderProg"
            x="6"
            y="6"
            width="88"
            height="88"
            rx="14"
            ry="14"
            pathLength="100"
            style={{
              strokeDasharray: "100",
              strokeDashoffset: String(100 - shown),
            }}
          />
        </svg>

        <div className="lrCornerInner">
          <div className="lrNum">{shown}</div>
        </div>
      </div>
    </div>
  );
}