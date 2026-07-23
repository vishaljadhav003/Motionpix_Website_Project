import { useEffect, useRef,useState } from "react";
import "./ProductBranding.css";
import BrandingVideo from "../public/Print Media_1.mp4";
import { NavLink } from "react-router-dom";

const brandingServices = [
  {
    title: "Product Identity Design",
    desc: "Visual identity that makes your product instantly recognizable.",
    icon: "🧠",
  },
  {
    title: "Packaging & Label Design",
    desc: "Shelf-ready designs that attract and convert buyers.",
    icon: "📦",
  },
  {
    title: "3D Product Branding",
    desc: "High-impact 3D visuals for digital & industrial products.",
    icon: "🧩",
  },
  {
    title: "Launch & Marketing Creatives",
    desc: "Ad creatives, banners & brand visuals for market entry.",
    icon: "🚀",
  },
];

const brandingProcess = [
  "Brand Discovery & Market Research",
  "Product Positioning Strategy",
  "Visual Identity & Design System",
  "3D / Graphic Asset Production",
  "Launch Support & Brand Optimization",
];

const ProductBranding = () => {
  const revealRefs = useRef([]);

     const [activeIndex, setActiveIndex] = useState(null);
      
    const toggleFAQ = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  
    

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "reveal-active",
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-page">
      {/* HERO */}
      <div className="pb-hero reveal" ref={(el) => (revealRefs.current[0] = el)}>
        <h1>
          Product <span>Branding</span>
        </h1>
        <p>
          We build powerful product brands that connect emotionally, stand out
          visually, and dominate their market.
        </p>
      </div>

      {/* BRAND VIDEO */}
      <div className="pb-video reveal" ref={(el) => (revealRefs.current[1] = el)}>
        <div className="video-wrapper">
          <video
            src={BrandingVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* SERVICES */}
      <div className="pb-services reveal" ref={(el) => (revealRefs.current[2] = el)}>
        <h2 className="section-title">Our Branding <span>Expertise</span></h2>
        <div className="services-grid-10">
          {brandingServices.map((item, i) => (
            <div className="service-card-10" key={i}>
              <span className="icon">{item.icon}</span>
              <h4 className="fw-bold">{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div className="pb-process reveal" ref={(el) => (revealRefs.current[3] = el)}>
        <h2 className="section-title">Our Product Branding <span>Process</span></h2>
        <div className="process-steps mt-5">
          {brandingProcess.map((step, i) => (
            <div className="process-step" key={i}>
              <span className="step-no mx-2">0{i + 1}</span>
              <p className="mt-2">{step}</p>
            </div>
          ))}
        </div>
      </div>

        <div className="container section reveal" ref={el => revealRefs.current[4] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-product mt-3">
  {[
    {
      q: " What does product branding include?",
      a: "Product branding includes product photography, videos, animations, visual identity, and marketing content aligned with brand positioning."
    },
    {
      q: "Can Motionpix handle complete product launch branding?",
      a: "Yes, we support end-to-end branding for product launches across digital, print, and presentation platforms."
    },
    {
      q: "What is the typical timeline for product branding?",
      a: "Branding projects take 3–6 weeks depending on deliverables."
    },
    {
      q: "What is the branding workflow?",
      a: "Brand understanding → Visual concept → Content creation → Brand alignment → Delivery."
    },
    {
      q: "How is product branding cost determined?",
      a: "Cost depends on number of assets, shoots, animations, and usage platforms."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-product ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-product">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-product">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>


      {/* CTA */}
      <div className="pb-cta reveal" ref={(el) => (revealRefs.current[5] = el)}>
        <h2 className="fw-bold">Ready to Build a Powerful Product <span>Brand?</span></h2>
        <p>
          Let’s turn your product into a brand customers trust, remember &
          choose.
        </p>
        <NavLink to='/contact'><button className="cta-btn">Start Branding Your Product</button></NavLink>
      </div>
    </section>
  );
};

export default ProductBranding;
