import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Courses.css";

const StickyServices = ({ data }) => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const MAX = Math.max(0, data.length - 1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || MAX === 0) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollLength = section.offsetHeight - window.innerHeight;

      if (scrollLength <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top / scrollLength, 0), 1);
      setProgress(scrolled * MAX);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [MAX]);

  return (
    <section ref={sectionRef} className="sticky-courses-section">
      <div className="desktop-services-heading">
        <h2 className="fw-bold mb-5">
          Our <span>Services</span>
        </h2>
      </div>

      <div className="sticky-wrapper">
        <div className="nitro-progress" aria-hidden="true">
          <span style={{ height: `${((progress + 1) / data.length) * 100}%` }} />
        </div>

        <div className="stack-stage">
          {data.map((item, index) => {
            const activeIndex = Math.round(progress);
            const t = index - activeIndex;

            const isActive = t === 0;

            const y = t * 120;
            const z = -Math.abs(t) * 260;
            const scale = 1 - Math.abs(t) * 0.08;
            const rotate = t * 6;
            const opacity = Math.max(0, 1 - Math.abs(t) * 0.25);

            return (
              <div
                key={index}
                className={`sticky-card sticky-stack-card ${isActive ? "active" : ""}`}
                style={{
                  transform: `
                    translate3d(0, ${y}px, ${z}px)
                    scale(${scale})
                    rotateX(${rotate}deg)
                  `,
                  opacity,
                  zIndex: isActive ? 50 : 10 - Math.abs(t),
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <NavLink to={item.link} className="glass-card nitro-card card-link">
                  <h3 className="stack-title">{item.title}</h3>
                  <img src={item.image} alt={item.title} />
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StickyServices;