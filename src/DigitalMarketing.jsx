import "./DigitalMarketing.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const DigitalMarketing = () => {
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
      { threshold: 0.25 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="dm-page">

      {/* HERO */}
      <div
        className="dm-hero reveal"
        ref={(el) => (revealRefs.current[0] = el)}
      >
        <div className="hero-text">
          <h1>Digital Marketing <span>That Delivers</span></h1>
          <p>
            Data-driven strategies designed to generate leads, scale reach,
            and maximize ROI across platforms.
          </p>
          <NavLink to="/contact" className="hero-btn">
            Start Growing
          </NavLink>
        </div>

        <div className="hero-visual">
          <video
            src="https://www.pexels.com/download/video/3191576/"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* SERVICES */}
      <div
        className="container section reveal"
        ref={(el) => (revealRefs.current[1] = el)}
      >
        <h2 className="section-title">What We <span>Do</span></h2>

        <div className="service-grid-1">
          {[
            "Search Engine Optimization (SEO)",
            "Social Media Marketing",
            "Paid Ads & Performance Campaigns",
            "Content Strategy & Branding",
            "Conversion Rate Optimization",
            "Analytics & Growth Tracking",
          ].map((item, i) => (
            <div className="service-card-1" key={i}>
              <h3 className="fw-bold">{item}</h3>
              <p>
                Strategic execution focused on measurable results and long-term
                brand growth.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      {/* <div
        className="stats-section reveal"
        ref={(el) => (revealRefs.current[2] = el)}
      >
        <div className="stats-grid">
          {[
            { value: "320%", label: "Average ROI Increase" },
            { value: "4.5K+", label: "Qualified Leads Generated" },
            { value: "12M+", label: "Monthly Reach" },
            { value: "68%", label: "Conversion Boost" },
          ].map((stat, i) => (
            <div className="stat-box" key={i}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div> */}

      <div className="container section reveal" ref={el => revealRefs.current[3] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-digital mt-3">
  {[
    {
      q: "What digital marketing services are included?",
      a: "We manage social media accounts, create content, blogs, white papers, case studies, and support brand visibility and lead generation."
    },
    {
      q: " Is digital marketing customized per industry?",
      a: "Yes, strategies are tailored based on industry, audience, and business goals."
    },
    {
      q: " How long does it take to see digital marketing results?",
      a: "Initial engagement improves in 1–2 months, with consistent growth over 3–6 months."
    },
    {
      q: " What is your digital marketing process?",
      a: "Strategy planning → Content creation → Publishing → Monitoring → Optimization."
    },
    {
      q: "How is digital marketing priced?",
      a: "Pricing is usually monthly, based on platforms, content volume, and campaign scope."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-digital ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-digital">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-digital">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>


      {/* CTA */}
      <div
        className="cta-section reveal"
        ref={(el) => (revealRefs.current[4] = el)}
      >
        <h2 className="fw-bold">Ready to Scale Your <span>Brand?</span></h2>
        <p>
          Let’s turn traffic into customers with smart, scalable digital
          marketing solutions.
        </p>
        <NavLink to="/contact" className="cta-btn fw-bold">
          Talk to Marketing Experts
        </NavLink>
      </div>

    </section>
  );
};

export default DigitalMarketing;
