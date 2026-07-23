import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./WebsiteDesign.css";

const WebsiteDesign = () => {
  const revealRefs = useRef([]);
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
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="web-page">
      {/* HERO (NO REVEAL) */}
      <div className="web-hero">
        <h1>
          Website <span>Design</span>
        </h1>
        <p>
          We design high-impact websites that blend aesthetics, performance &
          user experience.
        </p>
        <NavLink to="/contact" className="hero-btn">
          Get a Website Quote
        </NavLink>
      </div>

      {/* SHOWCASE */}
      <div
        className="web-showcase reveal"
        ref={(el) => (revealRefs.current[0] = el)}
      >
        <div className="mockup">
          <img
            src="https://img.freepik.com/free-photo/web-design-internet-website-responsive-software-concept_53876-124757.jpg"
            alt="Website design mockup"
          />
        </div>
        <div className="showcase-text">
          <h2 className="fw-bold">Design That <span>Converts</span></h2>
          <p>
            From brand websites to complex platforms, we craft digital
            experiences that drive results.
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="web-features">
        <h2 className="section-title">Our Key <span>Features</span></h2>
        <div className="features-grid-web">
          {[
            ["🧠", "UI / UX Design", "Human-centered interfaces"],
            ["📱", "Responsive Development", "Perfect on all devices"],
            ["⚡", "Performance Optimized", "Fast & SEO-ready"],
            ["🚀", "SEO Ready", "Clean search-friendly code"],
          ].map(([icon, title, desc], i) => (
            <div
              key={i}
              className="feature-card-web reveal"
              ref={(el) => (revealRefs.current[i + 1] = el)}
            >
              <span className="icon">{icon}</span>
              <h4 className="fw-bold">{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WEBSITE TYPES */}
      <div className="web-features">
        <h2 className="section-title">Websites We <span>Design & Build</span></h2>
        <div className="features-grid-web">
          {[
            ["🏢", "Corporate Websites","Professional brand-focused websites for companies & enterprises."],
            ["📈", "Startup & SaaS","Scalable, conversion-driven platforms for modern startups."],
            ["🛒", "E-commerce Stores","High performance online stores optimized for sales."],
            ["🎨", "Portfolio Websites","Personal & creative portfolios that leave strong impressions."],
            ["🎯", "Landing Pages","Campaign-focused pages designed to convert traffic."],
            ["🧩", "Enterprise Platforms","Robust,Secure systems with complex user flows."],
          ].map(([icon, title,desc], i) => (
            <div
              key={i}
              className="feature-card-web reveal"
              ref={(el) => (revealRefs.current[i + 5] = el)}
            >
              <span className="icon">{icon}</span>
              <h4 className="fw-bold">{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

       <div className="container section reveal" ref={el => revealRefs.current[11] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-web mt-3">
  {[
    {
      q: "What types of websites does Motionpix design?",
      a: "We design static, dynamic, and e-commerce websites that are visually appealing, responsive, and aligned with brand identity."
    },
    {
      q: "Can Motionpix redesign existing websites?",
      a: "Yes, we offer website revamp and performance-oriented redesign services."
    },
    {
      q: " How long does website development take?",
      a: "Static websites take 2–3 weeks, dynamic and e-commerce sites take 4–8 weeks."
    },
    {
      q: "What is the website development process?",
      a: "Requirement gathering → UI/UX design → Development → Testing → Launch."
    },
    {
      q: "How is website pricing structured?",
      a: "Pricing depends on number of pages, features, integrations, content support, and maintenance scope."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-web ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-web">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-web">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>


      {/* CTA */}
      <div
        className="web-cta reveal"
        ref={(el) => (revealRefs.current[12] = el)}
      >
        <h2 className="fw-bold">Ready to Build Something <span>Powerful?</span></h2>
        <p>Let’s create websites that convert and scale.</p>
        <NavLink to="/contact" className="cta-btn">
          Talk to Website Experts
        </NavLink>
      </div>
    </section>
  );
};

export default WebsiteDesign;
