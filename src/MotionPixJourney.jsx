import { useEffect, useRef, useState } from "react";
import "./MotionPixJourney.css";

const journeyStats = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 75, suffix: "%", label: "Audience Engagement" },
  { value: 2500, suffix: "+", label: "Minutes of Content" },
  { value: 500, suffix: "+", label: "Videos Created" },
  { value: 20, suffix: "+", label: "Team of Experts" },
  { value: 100, suffix: "+", label: "Clients Served" },
];

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const MotionPixJourney = () => {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [counts, setCounts] = useState(journeyStats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.18,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const startValues = [...counts];
    const endValues = isInView
      ? journeyStats.map((item) => item.value)
      : journeyStats.map(() => 0);

    const duration = 1200;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);

      const nextValues = startValues.map((startValue, index) => {
        const endValue = endValues[index];
        return Math.round(startValue + (endValue - startValue) * eased);
      });

      setCounts(nextValues);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section className="premium-journey" ref={sectionRef}>
      <div className="journey-container">
        <div className="journey-header">
          <span className="journey-badge">Our Growth Story</span>

          <h2 className="journey-heading">
            MotionPix <span>Journey</span>
          </h2>

          <p className="journey-subtitle">
            Dynamic milestones that reflect our creative growth, impact, and
            performance.
          </p>
        </div>

        <div className="journey-grid">
          {journeyStats.map((item, index) => (
            <article className="journey-card" key={item.label}>
              <div className="journey-card-glow" />
              <div className="journey-card-number-box">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="journey-value">
                {counts[index]}
                {item.suffix}
              </h3>

              <p className="journey-label">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MotionPixJourney;