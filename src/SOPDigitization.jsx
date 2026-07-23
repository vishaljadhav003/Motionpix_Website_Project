import { useEffect, useRef,useState } from "react";
import "./SOPDigitization.css";
import { NavLink } from "react-router-dom";

const sopFeatures = [
  {
    title: "Interactive SOPs",
    desc: "Convert static SOP documents into interactive, step-by-step digital workflows.",
    icon: "📘",
  },
  {
    title: "Version Control",
    desc: "Track changes, updates, and approvals with full audit history.",
    icon: "🕒",
  },
  {
    title: "Role-Based Access",
    desc: "Ensure the right SOP is accessed by the right team at the right time.",
    icon: "🔐",
  },
  {
    title: "Compliance Ready",
    desc: "Meet ISO, GMP, and regulatory standards with structured documentation.",
    icon: "✅",
  },
];

const workflowSteps = [
  "SOP Analysis & Mapping",
  "Process Simplification",
  "Digital Transformation",
  "Validation & Compliance",
  "Deployment & Training",
];

const SOPDigitization = () => {
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
    <section className="sop-page">

      {/* HERO */}
      <div
        className="sop-hero reveal"
        ref={(el) => (revealRefs.current[0] = el)}
      >
        <h1>
          SOP <span>Digitization</span>
        </h1>
        <p>
          Transform traditional SOPs into intelligent, interactive,
          and compliance-ready digital systems.
        </p>
      </div>

      {/* WHY SOP DIGITIZATION */}
      <div
        className="sop-why reveal"
        ref={(el) => (revealRefs.current[1] = el)}
      >
        <h2 className="section-title">Why Digitize <span>SOPs?</span></h2>
        <div className="why-grid_">
          <div className="why-card_">
            <span>📉</span>
            <p className="fw-bold">Reduce human errors and operational inefficiencies</p>
          </div>
          <div className="why-card_">
            <span>⚡</span>
            <p className="fw-bold">Accelerate onboarding and training processes</p>
          </div>
          <div className="why-card_">
            <span>📊</span>
            <p className="fw-bold">Gain visibility and traceability across operations</p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div
        className="sop-features reveal"
        ref={(el) => (revealRefs.current[2] = el)}
      >
        <h2 className="section-title">Core <span>Capabilities</span></h2>
        <div className="features-grid">
          {sopFeatures.map((item, i) => (
            <div className="feature-card" key={i}>
              <div className="icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS FLOW */}
            <div
        className="sop-process reveal"
        ref={(el) => (revealRefs.current[3] = el)}
        >
        <h2 className="section-title">Digitization <span>Workflow</span></h2>

        <div className="sop-timeline">
            {workflowSteps.map((step, i) => (
            <div className="sop-step" key={i}>
                <div className="step-circle">{i + 1}</div>
                <div className="step-content">
                <h4>{step}</h4>
                <p>
                    Structured execution ensuring accuracy, compliance,
                    and seamless SOP adoption.
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>
      {/* USE CASES */}
      <div
        className="sop-usecases reveal"
        ref={(el) => (revealRefs.current[4] = el)}
      >
        <h2 className="section-title">Industry Use <span>Cases</span></h2>
        <div className="usecase-grid_">
          <div className="usecase-card_">Manufacturing SOPs</div>
          <div className="usecase-card_">Quality Assurance</div>
          <div className="usecase-card_">Healthcare Protocols</div>
          <div className="usecase-card_">Corporate Policies</div>
        </div>
      </div>
        <div className="container section reveal" ref={el => revealRefs.current[5] = el}>
        <h2 className="section-title">FAQ<span>'s</span></h2>

        <div className="faq-container-sop mt-3">
  {[
    {
      q: "What is SOP digitization?",
      a: "SOP digitisation converts standard operating procedures into visual, digital, and interactive formats such as animations, videos, and e-learning modules."
    },
    {
      q: " Who benefits from SOP digitization?",
      a: "Manufacturing plants, quality teams, training departments, and compliance-driven organizations benefit the most."
    },
    {
      q: " What is the timeline for SOP digitization projects?",
      a: "Projects typically take 2–6 weeks, depending on number of SOPs and format."
    },
    {
      q: "What is your SOP digitization workflow?",
      a: "SOP study → Visual mapping → Animation / video creation → Validation → Deployment."
    },
    {
      q: "How is SOP digitization cost calculated?",
      a: "Cost is based on number of SOPs, level of visualization, language support, and interactivity."
    }
  ].map((item, i) => (
    <div
      className={`faq-item-sop ${activeIndex === i ? "active" : ""}`}
      key={i}
      onClick={() => toggleFAQ(i)}
    >
      <div className="faq-question-sop">
        <h4 class="fw-bold">{item.q}</h4>
        <span>{activeIndex === i ? "−" : "+"}</span>
      </div>

      <div className="faq-answer-sop">
        <p class="fw-bold">{item.a}</p>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* CTA */}
      <div
        className="sop-cta reveal"
        ref={(el) => (revealRefs.current[6] = el)}
      >
        <h2 className="fw-bold"><span>Digitize. Standardize. Scale.</span></h2>
        <p>
          Upgrade your SOP ecosystem with intelligent digital workflows.
        </p>
        <NavLink to='/contact'><button className="cta-btn">Start SOP Digitization</button></NavLink>
      </div>

    </section>
  );
};

export default SOPDigitization;
