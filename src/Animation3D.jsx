import "./Animation3D.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import SEO from "./Seo";
const Animation3D = () => {
  const revealRefs = useRef([]);
  //  const revealRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);
  
const toggleFAQ = (index) => {
  setActiveIndex(activeIndex === index ? null : index);
};
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="animation3d-page">
       <SEO               
        title="3D Animation Services in Pune | MotionPix"
        description="Professional 3D animation services including explainer videos, business animations, and creative storytelling at MotionPix."
        keywords="3D animation, explainer videos, animation company India, motion graphics"
        url="https://www.motionpixindia.com/services/3d-animation"
        image="https://www.motionpixindia.com/images/3d-animation.jpg"
      />

      {/* HERO */}
      <div className="animation3d-hero reveal" ref={(el) => (revealRefs.current[0] = el)}>
        <div className="hero-text">
          <h1>3D Animation & <span>Visualization</span></h1>
          <p>
            High-fidelity 3D visuals that bring products, spaces and ideas to life.
          </p>
          <NavLink to="/contact" className="hero-btn">
            Request a 3D Demo
          </NavLink>
        </div>

        <div className="hero-visual">
          <video
            src="../3D Animation.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* USE CASES */}
      <div className="container section reveal" ref={(el) => (revealRefs.current[1] = el)}>
        <h2 className="section-title">What We Create in <span>3D</span></h2>

        <div className="usecase-grid-3">
          {[
            "Product Visualization",
            "Architectural Walkthroughs",
            "Industrial Simulations",
            "Medical & Technical Models",
            "AR / VR Ready Assets",
            "Exploded View Animations",
          ].map((item, i) => (
            <div className="usecase-card-3" key={i}>
              <h3 className="fw-bold">{item}</h3>
              <p>
                Precision-driven 3D assets crafted for realism, clarity, and scale.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PIPELINE */}
      <div className="pipeline-section reveal" ref={(el) => (revealRefs.current[2] = el)}>
        <h2 className="fw-bold">Our 3D Production <span>Pipeline</span></h2>

        <div className="pipeline">
          {[
            "Concept & References",
            "3D Modeling",
            "Texturing & Materials",
            "Lighting & Rendering",
            "Animation & Camera",
            "Post-Production",
          ].map((step, i) => (
            <div className="pipeline-step" key={i}>
              <span className="step-index">{i + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

        <div className="container section reveal" ref={el => revealRefs.current[3] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-3d mt-3">
  {[
    {
      q: "What is the benefit of 3D animation for industrial products?",
      a: "3D animation helps explain complex machines, assemblies, and processes clearly, making it easier for customers, sales teams, and trainees to understand product working."
    },
    {
      q: "Can Motionpix create animations from CAD data?",
      a: "Yes, we can work with CAD files or develop 3D models from drawings, concepts, or reference images."
    },
    {
      q: "What is the timeline for 3D animation projects?",
      a: "Most 3D animation projects take 3–6 weeks, depending on modeling complexity and animation detail."
    },
    {
      q: "What is your 3D animation workflow?",
      a: "Concept → 3D modeling → Texturing & lighting → Animation → Rendering → Final output."
    },
    {
      q: " What factors affect 3D animation pricing?",
      a: "Pricing depends on number of models, animation length, realism level, CAD data availability, and rendering quality."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-3d ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-3d">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-3d">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* CTA */}
      <div className="cta-section reveal" ref={(el) => (revealRefs.current[4] = el)}>
        <h2 className="fw-bold">Need Realistic <span>3D Visuals?</span></h2>
        <p>
          From concept renders to cinematic animations — we handle the full 3D
          pipeline.
        </p>
        <NavLink to="/contact" className="cta-btn">
          Talk to Our 3D Team
        </NavLink>
      </div>

    </section>
  );
};

export default Animation3D;