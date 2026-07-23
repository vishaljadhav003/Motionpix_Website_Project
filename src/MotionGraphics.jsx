import { useEffect, useRef, useState } from "react";
import "./MotionGraphics.css";

const services = [
  "Kinetic Typography",
  "Brand Motion Identity",
  "Explainer Videos",
  "UI / App Motion",
  "Social Media Animations",
];

const MotionGraphics = () => {
  const revealRefs = useRef([]);

    const [activeIndex, setActiveIndex] = useState(null);
      
    const toggleFAQ = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle(
            "reveal-active",
            entry.isIntersecting
          )
        );
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mg-page">

      {/* HERO */}
      <div
        className="mg-hero reveal"
        ref={(el) => (revealRefs.current[0] = el)}
      >
        <h1>
          Motion <span>Graphics</span>
        </h1>

        {/* AUTO TEXT MOTION */}
        <div className="text-motion">
          <div className="text-track">
            {services.concat(services).map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        </div>

        <p>
          High-impact motion design that brings brands, stories,
          and interfaces to life.
        </p>
      </div>

      {/* VIDEO */}
      <div
        className="mg-video reveal"
        ref={(el) => (revealRefs.current[1] = el)}
      >
        <div className="video-wrapper">
          <video src="../Motion Graphics (2).mp4" autoPlay muted loop playsInline />
        </div>
      </div>

      {/* SERVICES */}
      <div
        className="mg-services reveal"
        ref={(el) => (revealRefs.current[2] = el)}
      >
        <h2 className="section-title fw-bold">What We <span>Do</span></h2>

        <div className="services-grid">
          {services.map((item, i) => (
            <div className="service-card" key={i}>
              {item}
            </div>
          ))}
        </div>
      </div>

         <div className="container section reveal" ref={el => revealRefs.current[3] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-motion mt-3">
  {[
    {
      q: " What types of videos do you edit?",
      a: "We edit corporate videos, industrial videos, marketing videos, training videos, social media content, and motion graphics."
    },
    {
      q: "Can Motionpix enhance existing videos?",
      a: "Yes, we can improve videos with animations, transitions, subtitles, voiceovers, and branding elements."
    },
    {
      q: "How long does video editing take?",
      a: "Simple edits take 5–7 days, complex motion graphics may take 2–3 weeks."
    },
    {
      q: "What is the video production workflow?",
      a: "Footage review → Editing → Motion graphics → Audio enhancement → Final export."
    },
    {
      q: "What affects video editing cost?",
      a: "Cost depends on video length, graphics complexity, animation layers, and revision cycles."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-motion ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-motion">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-motion">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* CTA */}
      <div
        className="mg-cta reveal"
        ref={(el) => (revealRefs.current[4] = el)}
      >
        <h2 className="fw-bold">Turn Static Ideas Into <span>Motion</span></h2>
        <p>
          Engage users, boost retention, and communicate faster with
          motion graphics.
        </p>
        <button className="cta-btn fw-bold">Start Your Project</button>
      </div>

    </section>
  );
};

export default MotionGraphics;
