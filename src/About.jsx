import { useEffect, useRef, useState } from "react";
import "./About.css";
import "./TeamSection.css";
import "./IndustrialSectors.css";
import "./WorkProcess.css";
import TeamSection from "./TeamSection";
import CapsuleScrollPage from "./CapsuleScrollPage";
import MotionPixJourney from "./MotionPixJourney";

const sectors = [
  {
    title: "Manufacturing",
    desc: "Industrial manufacturing, automation & machinery branding",
    icon: "🏭",
  },
  {
    title: "Healthcare",
    desc: "Medical, pharma & healthcare visual solutions",
    icon: "🩺",
  },
  {
    title: "Real Estate",
    desc: "Architecture walkthroughs & real estate marketing",
    icon: "🏗️",
  },
  {
    title: "Education",
    desc: "E-learning, institutional branding & explainers",
    icon: "🎓",
  },
  {
    title: "Technology",
    desc: "IT, SaaS & tech-based motion solutions",
    icon: "💻",
  },
  {
    title: "Retail & FMCG",
    desc: "Product visualization & brand storytelling",
    icon: "🛒",
  },
];

const GraphNode = ({ title, children, delay = "0s" }) => {
  const nodeRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = nodeRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={nodeRef}
      className={`graph-node ${visible ? "reveal" : ""}`}
      style={{ transitionDelay: delay }}
    >
      <svg viewBox="0 0 300 200" className="node-svg" aria-hidden="true">
        <rect x="2" y="2" rx="20" ry="20" width="296" height="196" />
      </svg>

      <div className="node-content">
        <h4>{title}</h4>
        {children}
      </div>
    </div>
  );
};

const About = () => {
  const graphCenterRef = useRef(null);

  const handleMagnetMove = (e) => {
    if (window.innerWidth <= 768) return;

    const element = graphCenterRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const strength = 0.12;
    const maxMove = 20;

    const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * strength));
    const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * strength));

    element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  };

  const resetMagnet = () => {
    const element = graphCenterRef.current;
    if (!element) return;

    element.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <>
      <section className="about-graph-section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-light ">
              About <span>Motionpix</span>
            </h1>
            <p className="text-secondary mt-3">
              Our vision, mission, values, and quality policy define how we create impact.
            </p>
          </div>

          <div
            className="graph-wrapper"
            onMouseMove={handleMagnetMove}
            onMouseLeave={resetMagnet}
          >
            <GraphNode title="Vision" delay="0s">
              <img src="./Vision.svg" alt="Vision" className="graph-icon" />
              <p className="text-light mt-3 text-center fw-bold">
                To redefine visual communication by merging creativity,
                technology, and storytelling.
              </p>
            </GraphNode>

            <GraphNode title="Mission" delay="0.15s">
              <img src="./Mission.svg" alt="Mission" className="graph-icon" />
              <p className="text-light mt-3 text-center fw-bold">
                Deliver innovative animation and digital solutions that empower.
              </p>
            </GraphNode>

            <div className="graph-center" ref={graphCenterRef}>
              <img
                src="/Logo.png"
                alt="MotionPix Logo"
                className="graph-center-logo"
              />
            </div>

            <GraphNode title="Quality Policy" delay="0.3s">
              <img src="./Quality.svg" alt="Quality Policy" className="graph-icon" />
              <p className="text-light mt-3 text-center fw-bold">
                Structured processes, strict benchmarks, and continuous improvement
                across every project.
              </p>
            </GraphNode>

            <GraphNode title="Core Values" delay="0.45s">
              <img src="./Core-Values.svg" alt="Core Values" className="graph-icon" />
              <ul className="mt-3 center-ul fw-bold">
                <li className="text-light">Creativity with purpose</li>
                <li className="text-light">Clients-first mindset</li>
                <li className="text-light">Innovation & integrity</li>
              </ul>
            </GraphNode>
          </div>
        </div>
      </section>

      <CapsuleScrollPage />


      <MotionPixJourney />
      <TeamSection />

      <section className="sectors-section">
        <div className="container">
          <div className="sectors-header">
            <h2 className="fw-bold">
              Industries We <span>Serve</span>
            </h2>
            <p>
              We work across diverse industrial sectors delivering impactful visual experiences.
            </p>
          </div>

          <div className="sectors-layout">
            <div className="sectors-image">
              <img
                src="https://mechatrix.com/wp-content/uploads/2025/11/2.svg"
                alt="Industrial sectors"
              />
            </div>

            <div className="sectors-grid-3">
              {sectors.map((item) => (
                <div className="sector-card-3" key={item.title}>
                  <span className="sector-icon">{item.icon}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="work-process">
        <div className="process-header">
          <h2>
            Our Work <span>Process</span>
          </h2>
          <p>
            A structured workflow that ensures quality, creativity, and timely
            delivery at every stage.
          </p>
        </div>

        <div className="process-wrapper">
          <div className="process-video">
            <video src="./Work.mp4" autoPlay muted loop playsInline />
          </div>

          <div className="process-steps">
            <div className="process-card">
              <span className="step-tag">01</span>
              <h3>Pre-Production</h3>
              <ul>
                <li>Application study & client meeting</li>
                <li>Script writing</li>
                <li>Storyboard planning</li>
                <li>Voice-over finalization</li>
              </ul>
            </div>

            <div className="process-card">
              <span className="step-tag">02</span>
              <h3>Production</h3>
              <ul>
                <li>Layout & modeling</li>
                <li>Coloring & texturing</li>
                <li>Animation & rigging</li>
                <li>Camera & lighting</li>
              </ul>
            </div>

            <div className="process-card">
              <span className="step-tag">03</span>
              <h3>Post-Production</h3>
              <ul>
                <li>VFX testing & final rendering</li>
                <li>Voice-over & sound effects</li>
                <li>Animated data integration</li>
                <li>Final rendering & delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;