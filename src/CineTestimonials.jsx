import { useEffect, useRef, useState } from "react";
import "./cineTestimonials.css";

const data = [
  {
    name: "Danny Boyle",
    role: "Film Director",
    quote:
      "I never knew that such an acting school measuring up to international standards existed in Mumbai.",
    image: "/images/testimonial1.jpg",
  },
  {
    name: "Anurag Kashyap",
    role: "Producer & Director",
    quote: "Their storytelling depth and motion quality are truly cinematic.",
    image: "/images/testimonial2.jpg",
  },
  {
    name: "Zoya Akhtar",
    role: "Filmmaker",
    quote: "MotionPix understands brand emotion better than most studios.",
    image: "/images/testimonial3.jpg",
  },
];

const DURATION = 5000;

const CineTestimonials = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState("next");

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const sectionRef = useRef(null);

  /* -------- RESET PROGRESS (FIXED) -------- */

  const resetProgress = () => {
  cancelAnimationFrame(rafRef.current);
  startRef.current = null;
  setProgress(0);
};


  /* -------- MANUAL SLIDE CHANGE -------- */
const changeSlide = (dir) => {
  resetProgress();

  setDirection(dir === 1 ? "next" : "prev");

  setIndex((prev) => {
    if (dir === 1) return (prev + 1) % data.length;
    return (prev - 1 + data.length) % data.length;
  });

  // Restart animation cleanly
  requestAnimationFrame((time) => {
    startRef.current = time;
    rafRef.current = requestAnimationFrame(animate);
  });
};


  /* -------- AUTO PROGRESS -------- */
 const animate = (time) => {
  if (paused) {
    rafRef.current = requestAnimationFrame(animate);
    return;
  }

  if (!startRef.current) startRef.current = time;

  const elapsed = time - startRef.current;
  const percent = Math.min((elapsed / DURATION) * 100, 100);

  setProgress(percent);

  if (elapsed >= DURATION) {
    changeSlide(1);
    return; // ⛔ stop old frame
  }

  rafRef.current = requestAnimationFrame(animate);
};

  /* -------- RAF START -------- */
  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  /* -------- SCROLL REVEAL (FIXED) -------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("cine-reveal-active");
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const current = data[index];
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (progress / 100) * circumference;

  return (
    <section
      className="cine-testimonial-section cine-reveal"
      ref={sectionRef}
    >
      {/* HEADING */}
      <div className="cine-heading">
        <h1 className="fw-bold">
          Our <span>Testimonials</span>
        </h1>
        <p>Trusted by creative leaders worldwide</p>
      </div>

      {/* CARD */}
      <div
        className="cine-testimonial-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          src={current.image}
          alt={current.name}
          className="cine-avatar"
        />

        <blockquote className="cine-quote fw-bold">
          “{current.quote}”
        </blockquote>

        <h4>{current.name}</h4>
        <span>{current.role}</span>

        {/* FOOTER */}
        <div className="cine-footer">
          {/* COUNTER */}
          <div className="cine-counter">
            <span
              key={index}
              className={`cine-number ${direction}`}
            >
              {index + 1}
            </span>
            <span className="cine-separator">—</span>
            <span className="cine-total">{data.length}</span>
          </div>

          {/* CONTROLS */}
          <div className="cine-controls">
            <button onClick={() => changeSlide(-1)}>-</button>

            <svg className="cine-progress" width="44" height="44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>

            <button onClick={() => changeSlide(1)}>+</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CineTestimonials;
