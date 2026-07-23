import { useEffect, useRef,useState } from "react";
import "./PrintMedia.css";
import { NavLink } from "react-router-dom";

const services = [
  {
    title: "Brochure & Catalogue Design",
    desc: "High-impact brochures and catalogs that communicate clearly and sell effectively.",
    icon: "📘",
  },
  {
    title: "Packaging Design",
    desc: "Creative packaging that enhances shelf appeal and brand recognition.",
    icon: "📦",
  },
  {
    title: "Posters & Flyers",
    desc: "Eye-catching designs for promotions, events, and campaigns.",
    icon: "📰",
  },
  {
    title: "Corporate Stationery",
    desc: "Business cards, letterheads & brand collateral with consistency.",
    icon: "✒️",
  },
];

const process = [
  "Brand Understanding & Research",
  "Concept & Layout Design",
  "Typography & Color Finalization",
  "Print-Ready File Preparation",
  "Quality Check & Delivery",
];

const PrintMedia = () => {
  const revealRefs = useRef([]);

   const [activeIndex, setActiveIndex] = useState(null);
      
    const toggleFAQ = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.isIntersecting
            ? entry.target.classList.add("reveal-active")
            : entry.target.classList.remove("reveal-active");
        });
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pm-page">
      {/* HERO */}
      <div className="pm-hero reveal" ref={(el) => (revealRefs.current[0] = el)}>
        <h1>
          Print <span>Media Design</span>
        </h1>
        <p>
          We design impactful print materials that strengthen your brand presence
          and leave a lasting impression.
        </p>
      </div>

      {/* SERVICES */}
      <div
        className="pm-services reveal"
        ref={(el) => (revealRefs.current[1] = el)}
      >
        <h2 className="section-title">Our Print <span>Solutions</span></h2>

        <div className="services-grids">
          {services.map((item, i) => (
            <div className="service-cards" key={i}>
              <span className="icon">{item.icon}</span>
              <h4 className="fw-bold">{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SHOWCASE IDEA */}
      <div
        className="pm-showcase reveal"
        ref={(el) => (revealRefs.current[2] = el)}
      >
        <div className="showcase-text">
          <h2 className="fw-bold">Designs That Speak on Paper</h2>
          <p>
            From premium brochures to retail-ready packaging, our print designs
            blend creativity with clarity and precision.
          </p>
        </div>

        <div className="showcase-box">
          <span>PRINT • BRAND • IMPACT</span>
        </div>
      </div>

      {/* PROCESS */}
      <div
        className="pm-process reveal"
        ref={(el) => (revealRefs.current[3] = el)}
      >
        <h2 className="section-title">Our Print Design <span>Process</span></h2>

        <div className="process-steps mt-5">
          {process.map((step, i) => (
            <div className="process-step" key={i}>
              <span className="step-no mx-2">0{i + 1}</span>
              <p className="mt-2">{step}</p>
            </div>
          ))}
        </div>
      </div>

         <div className="container section reveal" ref={el => revealRefs.current[4] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-print mt-3">
  {[
    {
      q: "What print materials does Motionpix design?",
      a: "We design brochures, catalogues, leaflets, posters, letterheads, visiting cards, and other print-ready marketing materials."
    },
    {
      q: " Do you provide print-ready files?",
      a: "Yes, all files are delivered in print-ready formats with correct resolutions and bleed settings."
    },
    {
      q: "What is the turnaround time for print media designs?",
      a: "Print designs usually take 5–10 working days depending on content and revisions."
    },
    {
      q: "What is the process for print media projects?",
      a: "Content alignment → Design layout → Proofing → Print-ready file delivery."
    },
    {
      q: "How is print media costing calculated?",
      a: "Cost depends on page count, design complexity, and print specifications."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-print ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-print">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-print">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* CTA */}
      <div
        className="pm-cta reveal"
        ref={(el) => (revealRefs.current[5] = el)}
      >
        <h2 className="fw-bold">Ready to Elevate Your Print <span>Presence?</span></h2>
        <p>
          Let’s create print designs that communicate quality, trust & brand
          excellence.
        </p>
        <NavLink to='/contact'><button className="cta-btn">Request Print Design</button></NavLink>
      </div>
    </section>
  );
};

export default PrintMedia;
