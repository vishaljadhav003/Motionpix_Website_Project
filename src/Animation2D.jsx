import { useEffect, useRef, useState } from "react";
import "./Animation2D.css";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import img1 from "../public/Explainer videos.png";
import img2 from "../public/Marketing and branding.png";
import img3 from "../public/Proposal and presentation support.png";
import img4 from "../public/SOP and process explanation.png";
import img5 from "../public/Training and onboarding.png";
import SEO from "./Seo";

const Animation2D = () => {
  // const revealRefs = useRef([]);
const [activeIndex, setActiveIndex] = useState(null);

const toggleFAQ = (index) => {
  setActiveIndex(activeIndex === index ? null : index);
};

useEffect(() => {
  const ctx = gsap.context(() => {

    // HERO TEXT
    gsap.from(".hero-content h1", {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".hero-content p", {
      y: 60,
      opacity: 0,
      delay: 0.2,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".hero-btn", {
      scale: 0.8,
      opacity: 0,
      delay: 0.4,
      duration: 0.6,
      ease: "back.out(1.7)"
    });

    // HERO PARALLAX
    gsap.to(".hero-media video", {
      y: 80,
      scrollTrigger: {
        trigger: ".animation2d-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // 🔥 VICE-VERSA REVEAL (MAIN FIX)
    gsap.utils.toArray(".section, .premium-card").forEach((el) => {
      gsap.fromTo(
        el,
        {
          y: 80,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 30%",
            scrub: true,          // 👈 smooth scroll feel
            toggleActions: "play reverse play reverse" // 👈 reverse on scroll up
          }
        }
      );
    });

    // APPROACH GRID STAGGER (SMOOTH + REVERSE)
    gsap.fromTo(".approach-card",
      {
        y: 80,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".approach-grid",
          start: "top 85%",
          end: "top 30%",
          scrub: true,
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // 📱 MOBILE FIX
    ScrollTrigger.matchMedia({
      "(max-width: 768px)": function () {
        gsap.set(".hero-media video", { y: 0 });
      }
    });

  });

  return () => ctx.revert();
}, []);


  return (
    <section className="animation2d-page">
      <SEO
        title="2D Animation Services in Pune | MotionPix"
        description="Professional 2D animation services including explainer videos, business animations, and creative storytelling at MotionPix."
        keywords="2D animation, explainer videos, animation company India, motion graphics"
        url="https://www.motionpixindia.com/services/2d-animation"
        image="https://www.motionpixindia.com/images/2d-animation.jpg"
      />

      {/* HERO */}
      <div className="animation2d-hero">
        <div className="hero-content">
          <h1>2D <span>Animation</span></h1>
          <p>
           2D animation is a visual storytelling technique where illustrations, icons, text, and 
            characters are animated in a two-dimensional space. Unlike static images or lengthy 
            documents, 2D animations guide viewers step-by-step through a concept, making 
            information easier to absorb and remember.
          </p>
          <NavLink to="/contact" className="hero-btn">
            Start Your Animation
          </NavLink>
        </div>

        <div className="hero-media">
        <video
          data-speed="0.2"
          src="../2D.mp4"
          muted
          autoPlay
          loop
          playsInline
        />
      </div>
      </div>

      {/* WHAT WE ANIMATE (UPDATED WITH IMAGES) */}
      {/* <div className="container section reveal" ref={el => revealRefs.current[1] = el}>
        <h2 className="section-title">What We <span>Animate</span></h2>

        <div className="d-grid">
          {[img1, img2, img3, img4, img5].map((img, i) => (
            <div className="feature-card-2d image-card" key={i}>
              <img src={img} alt="animation type" />
            </div>
          ))}
        </div>
      </div> */}

      <div className="container section">
  <h2 className="section-title fw-bold">
    What We <span>Animate</span>
  </h2>

  <div className="usecase-grid">
    {[
      { img: img5, title: "Training & SOP" },
      { img: img1, title: "Explainer Videos" },
      { img: img2, title: "Marketing & Branding" },
      { img: img3, title: "Proposal Presentations" }
    ].map((item, i) => (
      <div className="usecase-card premium-card" key={i}>
        <img src={item.img} alt={item.title} />
        <h4>{item.title}</h4>
      </div>
    ))}
  </div>
</div>

      {/* <div className="process-section reveal" ref={el => revealRefs.current[2] = el}>
        <h2 className="fw-bold">Our 2D Animation <span>Process</span></h2>

        <div className="process-flow">
          {["Script", "Storyboard", "Design", "Animation", "Sound"].map(
            (step, i) => (
              <div className="process-step" key={i}>
                <div className="step-circle ms-3">{i + 1}</div>
                <p className="mt-3">{step}</p>
              </div>
            )
          )}
        </div>
      </div>
      <div className="container section">
        <h2 className="section-title fw-bold">Why 2D <span>Animation?</span></h2>

        <div className="why-grid">
          <div>🎯 Higher Engagement</div>
          <div>📈 Better Conversions</div>
          <div>🧠 Easy Storytelling</div>
          <div>⚡ Faster Production</div>
          <div>💰 Cost Effective</div>
          <div>📱 Perfect for Social Media</div>
        </div>
      </div> */}


  {/* ================= WHY CHOOSE 2D (B) ================= */}
<div className="container section">
  <h2 className="section-title fw-bold">
    Why Choose <span>2D Animation?</span>
  </h2>

  <div className="why-2d-grid">
    {[
      {
        img: img1,
        title: "Simplifies Complex Information",
        desc: "Technical concepts and workflows become easy with step-by-step visuals."
      },
      {
        img: img2,
        title: "Faster Communication",
        desc: "Short animations replace long documents and presentations."
      },
      {
        img: img3,
        title: "Cost-Effective & Flexible",
        desc: "Faster production and easy updates compared to live shoots."
      },
      {
        img: img4,
        title: "Works Across Platforms",
        desc: "Usable across web, training, marketing, and social media."
      }
    ].map((item, i) => (
      <div className="why-card premium-card" key={i}>
        <img src={item.img} alt={item.title} />
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </div>
    ))}
  </div>
</div>

<div className="container section">
  <h2 className="section-title fw-bold">
    Motionpix <span>Approach</span>
  </h2>

  <div className="approach-grid">
    {[
      {
        img: img5,
        title: "Requirement Understanding",
        desc: "We analyze audience, purpose, and expected outcome."
      },
      {
        img: img1,
        title: "Script & Storyboard",
        desc: "We define visual flow, transitions, and storytelling."
      },
      {
        img: img2,
        title: "Visual Design",
        desc: "Custom illustrations aligned with brand identity."
      },
      {
        img: img3,
        title: "Animation & Motion Design",
        desc: "Smooth animations and transitions for clarity."
      },
      {
        img: img4,
        title: "Voiceover & Sound",
        desc: "Optional voiceover and background music."
      },
      {
        img: img1,
        title: "Review & Delivery",
        desc: "Final output after feedback and revisions."
      }
    ].map((item, i) => (
      <div className="approach-card premium-card" key={i}>
        <img src={item.img} alt={item.title} />
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </div>
    ))}
  </div>
</div>


      {/* FAQ SECTION (NEW) */}
      <div className="container section">
        <h2 className="section-title">FAQs</h2>

        <div className="faq-container mt-3">
  {[
    {
      q: "What type of 2D animations does Motionpix create?",
      a: "We create explainer videos, training animations, marketing visuals, functional process animations, proposal visuals, and branding animations tailored to business and industrial needs."
    },
    {
      q: "Where can 2D animations be used?",
      a: "2D animations can be used on websites, presentations, social media, training programs, proposals, exhibitions, and digital marketing campaigns."
    },
    {
      q: "How long does a 2D animation project take?",
      a: "A typical 2D animation project takes 2–4 weeks, depending on duration, complexity, and revisions."
    },
    {
      q: "What is the process flow for 2D animation?",
      a: "Requirement understanding → Script & storyboard → Design & animation → Review & revisions → Final delivery."
    },
    {
      q: "How is the cost of 2D animation calculated?",
      a: "Cost depends on video duration, level of illustration, voiceover, animation complexity, and usage purpose."
    }
  ].map((item, i) => (
    <div
      className={`faq-item ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question">
        <h4 className="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer">
        <p className="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>
      {/* CTA */}
      <div className="animation2d-cta">
        <h2 className="fw-bold">Have an Idea? Let’s <span>Animate It.</span></h2>
        <NavLink to="/contact" className="cta-btn">
          Contact Us
        </NavLink>
      </div>

    </section>
  );
};

export default Animation2D;