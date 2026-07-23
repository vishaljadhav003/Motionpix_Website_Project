import { useEffect, useMemo, useRef, useState } from "react";
import "./Gallery.css";

const items = [
  {
    type: "video",
    src: "../public/Fire-Extinguisher.mp4",
    label: "Cairo",
  },
  {
    type: "image",
    src: "../public/demo.png",
    label: "Manila",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/yw1GCZxhNp9c0ifxjP3zVlEc.png",
    label: "Interior",
  },
  {
    type: "video",
    src: "https://framerusercontent.com/assets/Ehe42PKiSCrm7iEv3XiwdHbR4.mp4",
    label: "Lifestyle",
  },
  {
    type: "image",
    src: "https://framerusercontent.com/images/KOQjQrydrJvVSvzcz2fLyVMiuBc.png",
    label: "Architecture",
  },
];

function Gallery() {
  const sectionRef = useRef(null);
  const tickingRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const maxIndex = items.length - 1;

  const sectionMinHeight = useMemo(() => {
    return `${Math.max(items.length * 100, 300)}vh`;
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const section = sectionRef.current;

      if (!section) {
        tickingRef.current = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;

      if (scrollRange <= 0) {
        setProgress(0);
        tickingRef.current = false;
        return;
      }

      const normalized = Math.min(Math.max(-rect.top / scrollRange, 0), 1);
      setProgress(normalized * maxIndex);
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateScrollProgress);
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [maxIndex]);

  return (
    <section
      ref={sectionRef}
      className="gallery"
      style={{ minHeight: sectionMinHeight }}
    >
      <div className="gallery-header">
        <h1>
          Visual <span>Gallery</span>
        </h1>
        <p>AI-curated visuals blending moments and motion.</p>
      </div>

      <div className="stack-stages">
        {items.map((item, index) => {
          const distance = index - progress;

          const translateY = distance * 110;
          const translateZ = -Math.abs(distance) * 220;
          const scale = Math.max(0.72, 1 - Math.abs(distance) * 0.08);
          const rotateX = distance * 5;
          const opacity = Math.max(0.2, 1 - Math.abs(distance) * 0.22);

          return (
            <article
              key={`${item.label}-${index}`}
              className="stack-cards"
              style={{
                transform: `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale}) rotateX(${rotateX}deg)`,
                opacity,
                zIndex: items.length - index + Math.round(progress),
              }}
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={item.src} alt={item.label} loading="lazy" />
              )}

              <div className="overlay" />
              <span className="label">{item.label}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Gallery;