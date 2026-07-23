import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./News.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NEWS_SCENES = [
  {
    id: "s1",
    label: "Release",
    title: "Manila.",
    subtitle: "A calmer layout + smoother motion system.",
    date: "2026-03-02",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80",
    bullets: ["New grid", "Cleaner typography", "Motion tuned for scroll"],
  },
  {
    id: "s2",
    label: "Update",
    title: "Cairo.",
    subtitle: "Scroll interactions tuned for speed + clarity.",
    date: "2026-02-18",
    image:
      "https://images.unsplash.com/photo-1520975682031-a1a4d3c9d3e1?auto=format&fit=crop&w=2400&q=80",
    bullets: ["Pinned storytelling", "Less jitter", "Better mobile feel"],
  },
  {
    id: "s3",
    label: "Press",
    title: "Oslo.",
    subtitle: "Featured for modern studio storytelling.",
    date: "2026-02-02",
    image:
      "https://images.unsplash.com/photo-1520975958225-2cc0f1f2c44f?auto=format&fit=crop&w=2400&q=80",
    bullets: [
      "Editorial storytelling",
      "New case study format",
      "Cinematic motion",
    ],
  },
  {
    id: "s4",
    label: "Update",
    title: "Tokyo.",
    subtitle: "Motion kit shipped to client teams.",
    date: "2026-01-05",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=2400&q=80",
    bullets: ["Reusable transitions", "Consistent timing", "Docs-first releases"],
  },
];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function splitWords(text) {
  return text.split(" ").map((word, index) => (
    <span className="newsStable-word" key={`${word}-${index}`}>
      {word}
    </span>
  ));
}

function getNavbarHeight() {
  const el =
    document.querySelector(".navbar") ||
    document.querySelector(".site-header") ||
    document.querySelector("header") ||
    document.querySelector("nav");

  if (!el) return 0;
  return Math.round(el.getBoundingClientRect().height || 0);
}

export default function News() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const bgARef = useRef(null);
  const bgBRef = useRef(null);

  const titleRef = useRef(null);
  const subRef = useRef(null);
  const metaRef = useRef(null);
  const listRef = useRef(null);
  const hudRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [navH, setNavH] = useState(0);

  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const previousRestoration = window.history.scrollRestoration;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    ScrollTrigger.clearScrollMemory?.();

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousRestoration || "auto";
      }
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const h = getNavbarHeight();
      setNavH(h);
      document.documentElement.style.setProperty("--newsStable-nav-h", `${h}px`);

      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--newsStable-vh", `${vh}px`);
    };

    apply();
    window.addEventListener("resize", apply);

    return () => {
      window.removeEventListener("resize", apply);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const stage = stageRef.current;
    const bgA = bgARef.current;
    const bgB = bgBRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !sticky || !stage || !bgA || !bgB || !cards.length) return;

    const n = cards.length;
    const stepCount = Math.max(1, n - 1);

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (a, b, t) => a + (b - a) * t;

    const getCfg = () => {
      const w = window.innerWidth;
      const isMobile = w <= 560;
      const isTablet = w <= 900;

      return {
        perspective: 1200,
        tiltX: isMobile ? -8 : -10,
        radiusX: isMobile ? 520 : isTablet ? 760 : 980,
        faceY: isMobile ? 22 : 28,
        faceZ: isMobile ? 5 : 7,
      };
    };

    const applyStageTilt = () => {
      const cfg = getCfg();

      gsap.set(stage, {
        transformStyle: "preserve-3d",
        transform: `perspective(${cfg.perspective}px) rotateX(${cfg.tiltX}deg) rotateY(0deg)`,
      });
    };

    applyStageTilt();

    let smoothP = 0;
    let targetP = 0;
    let rafId = 0;
    let lastIdx = 0;
    let front = 0;

    gsap.set(bgA, { opacity: 1 });
    gsap.set(bgB, { opacity: 0 });
    bgA.style.backgroundImage = `url("${NEWS_SCENES[0].image}")`;
    bgB.style.backgroundImage = `url("${NEWS_SCENES[1]?.image || NEWS_SCENES[0].image}")`;

    setActiveIdx(0);

    const swapBg = (imgUrl) => {
      const next = front === 0 ? bgB : bgA;
      const curr = front === 0 ? bgA : bgB;

      if (curr.style.backgroundImage.includes(imgUrl)) return;

      const img = new Image();
      img.onload = () => {
        next.style.backgroundImage = `url("${imgUrl}")`;

        gsap.to(curr, {
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          overwrite: true,
        });

        gsap.to(next, {
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          overwrite: true,
        });

        front = front === 0 ? 1 : 0;
      };

      img.src = imgUrl;
    };

    const revealText = () => {
      const words = titleRef.current?.querySelectorAll(".newsStable-word");
      const listItems = listRef.current?.querySelectorAll("li");

      gsap.killTweensOf([
        hudRef.current,
        metaRef.current,
        subRef.current,
        words,
        listItems,
      ]);

      gsap.fromTo(
        hudRef.current,
        { y: 16, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        metaRef.current,
        { y: 10, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "power2.out",
          delay: 0.05,
        }
      );

      if (words?.length) {
        gsap.fromTo(
          words,
          { y: 18, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.04,
            delay: 0.06,
          }
        );
      }

      gsap.fromTo(
        subRef.current,
        { y: 10, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.38,
          ease: "power2.out",
          delay: 0.1,
        }
      );

      if (listItems?.length) {
        gsap.fromTo(
          listItems,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.06,
            delay: 0.12,
          }
        );
      }
    };

    const setIndexFromProgress = (progress) => {
      const idx = Math.round(progress * stepCount);
      const safeIdx = clamp(idx, 0, stepCount);

      if (safeIdx !== lastIdx) {
        lastIdx = safeIdx;
        setActiveIdx(safeIdx);
        swapBg(NEWS_SCENES[safeIdx].image);

        cards.forEach((card) => card.classList.remove("newsStable-front"));
        cards[safeIdx]?.classList.add("newsStable-front");
        revealText();
      }
    };

    const perSceneScroll = 1.08;

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => {
        const visibleH = Math.max(420, window.innerHeight - navH);
        return `+=${Math.round(visibleH * n * perSceneScroll)}`;
      },
      pin: sticky,
      pinSpacing: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value) => Math.round(value * stepCount) / stepCount,
        duration: { min: 0.18, max: 0.36 },
        ease: "power2.out",
      },
      onRefresh: (self) => {
        applyStageTilt();

        if (window.scrollY <= 2) {
          targetP = 0;
          smoothP = 0;
          self.scroll(self.start);

          lastIdx = 0;
          setActiveIdx(0);
          cards.forEach((card) => card.classList.remove("newsStable-front"));
          cards[0]?.classList.add("newsStable-front");
          bgA.style.backgroundImage = `url("${NEWS_SCENES[0].image}")`;
          gsap.set(bgA, { opacity: 1 });
          gsap.set(bgB, { opacity: 0 });
          revealText();
        }
      },
      onUpdate: (self) => {
        targetP = self.progress;
        setIndexFromProgress(self.progress);
      },
    });

    const tick = () => {
      smoothP = lerp(smoothP, targetP, 0.16);

      const cfg = getCfg();
      const raw = smoothP * stepCount;
      const baseAngle = raw * ((Math.PI * 2) / n);

      for (let i = 0; i < n; i++) {
        const phase = (i / n) * Math.PI * 2;
        const theta = phase - baseAngle;

        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        const x = sin * cfg.radiusX;
        const y = -sin * cfg.faceY;
        const z = 0;

        const rotateY = -sin * cfg.faceY;
        const rotateZ = sin * cfg.faceZ;

        const depth01 = (cos + 1) / 2;
        const scale = lerp(0.72, 1.03, clamp(depth01, 0, 1));
        const opacity = lerp(0.18, 1, clamp(depth01, 0, 1));
        const brightness = lerp(0.75, 1.05, clamp(depth01, 0, 1));

        gsap.set(cards[i], {
          x,
          y,
          z,
          rotateY,
          rotateZ,
          scale,
          opacity,
          filter: `brightness(${brightness})`,
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    if (window.scrollY < 5) {
      window.scrollTo(0, 0);
    }

    cards.forEach((card) => card.classList.remove("newsStable-front"));
    cards[0]?.classList.add("newsStable-front");
    revealText();

    rafId = requestAnimationFrame(tick);
    ScrollTrigger.refresh();

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      scrollTrigger.update();
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      scrollTrigger.kill();
    };
  }, [reduced, navH]);

  const scene = NEWS_SCENES[activeIdx];

  return (
    <section className="newsStable-page" id="news">
      <div className="newsStable-head">
        <div className="newsStable-headInner">
          <div className="newsStable-kicker">Data / News</div>
          <h1 className="newsStable-pageTitle">News</h1>
          <p className="newsStable-pageDesc">
            Studio updates, releases & highlights — scroll to explore chapters.
          </p>
        </div>
      </div>

      <section
        ref={sectionRef}
        className="newsStable-section"
        style={{ "--newsStable-steps": NEWS_SCENES.length }}
      >
        <div ref={stickyRef} className="newsStable-sticky">
          <div className="newsStable-pinnedBar">
            <span className="newsStable-pinnedBarTitle">News</span>
            <span className="newsStable-pinnedBarStep">
              {String(activeIdx + 1).padStart(2, "0")} /{" "}
              {String(NEWS_SCENES.length).padStart(2, "0")}
            </span>
          </div>

          <div className="newsStable-bg" aria-hidden="true">
            <div className="newsStable-bgLayer newsStable-bgLayerA" ref={bgARef} />
            <div className="newsStable-bgLayer newsStable-bgLayerB" ref={bgBRef} />
            <div className="newsStable-vignette" />
            <div className="newsStable-grain" />
          </div>

          <div className="newsStable-wrap">
            <div ref={stageRef} className="newsStable-stage" aria-hidden="true">
              {NEWS_SCENES.map((sceneItem, index) => (
                <div
                  key={sceneItem.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className="newsStable-card"
                >
                  <img
                    className="newsStable-img"
                    src={sceneItem.image}
                    alt={sceneItem.title}
                    draggable="false"
                  />
                  <span className="newsStable-sheen" aria-hidden="true" />
                </div>
              ))}
            </div>

            <div ref={hudRef} className="newsStable-hud">
              <div ref={metaRef} className="newsStable-meta">
                <span className="newsStable-label">{scene.label}</span>
                <span className="newsStable-sep">•</span>
                <span className="newsStable-date">{formatDate(scene.date)}</span>
              </div>

              <h2 ref={titleRef} className="newsStable-title">
                {splitWords(scene.title)}
              </h2>

              <p ref={subRef} className="newsStable-sub">
                {scene.subtitle}
              </p>

              <ul ref={listRef} className="newsStable-list">
                {scene.bullets.map((bullet, index) => (
                  <li key={`${scene.id}-b-${index}`}>{bullet}</li>
                ))}
              </ul>

              <div className="newsStable-footer">
                <span className="newsStable-hint">Scroll up/down</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="newsStable-after">
        <div className="newsStable-afterInner">
          <h3 className="newsStable-afterTitle">More posts</h3>

          <div className="newsStable-grid">
            {NEWS_SCENES.map((sceneItem) => (
              <article key={`post-${sceneItem.id}`} className="newsStable-post">
                <div className="newsStable-postMeta">
                  <span className="newsStable-date">{formatDate(sceneItem.date)}</span>
                  <span className="newsStable-sep">•</span>
                  <span className="newsStable-date">{sceneItem.label}</span>
                </div>

                <div className="newsStable-postH">{sceneItem.title}</div>
                <div className="newsStable-postP">{sceneItem.subtitle}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}