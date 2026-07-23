import { useEffect, useRef, useState } from "react";
import "./WhyMotionPix.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Website Design",
    desc: "Premium, conversion-focused website experiences crafted with cinematic visuals, modern layout systems, and bold digital storytelling."
  },
  {
    title: "Process Animations & Visualizations",
    desc: "Complex industrial and technical workflows transformed into elegant, easy-to-understand motion experiences with striking visual clarity."
  },
  {
    title: "Proposal & Project Animations",
    desc: "High-impact proposal animations that elevate your presentation quality, communicate ideas clearly, and create a stronger premium impression."
  },
  {
    title: "Greenfield Projects & Plant Visualizations",
    desc: "Immersive visual presentations for plant layouts, infrastructure concepts, and large-scale industrial developments with premium cinematic depth."
  },
  {
    title: "2D/3D Interactive Animations",
    desc: "Interactive motion experiences that strengthen engagement, simplify communication, and bring products or systems to life with precision."
  },
  {
    title: "Graphics Design & Motion Graphics",
    desc: "Luxury-grade visual design systems and motion assets that enhance brand recall, digital presence, and overall presentation quality."
  },
  {
    title: "SOP Digitization",
    desc: "Operational knowledge converted into streamlined digital formats that improve clarity, accessibility, retention, and training effectiveness."
  },
  {
    title: "E-Learning Projects",
    desc: "Rich educational experiences designed with visual storytelling and structured interaction to make learning more engaging and memorable."
  },
  {
    title: "AR / VR / MR / XR Services",
    desc: "Next-generation immersive solutions built to create futuristic experiences, realistic simulations, and powerful interactive environments."
  }
];

const DESKTOP_BREAKPOINT = 1180;

const WhyMotionpix = () => {
  const sectionRef = useRef(null);
  const desktopTriggerRefs = useRef([]);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const leftScrollRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const leftItemRefs = useRef([]);
  const hasMountedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftCardRef.current, rightCardRef.current],
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12
        }
      );

      mm.add(`(min-width: ${DESKTOP_BREAKPOINT + 1}px)`, () => {
        const triggers = desktopTriggerRefs.current.map((item, index) => {
          if (!item) return null;

          return ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index)
          });
        });

        return () => {
          triggers.forEach((trigger) => trigger && trigger.kill());
        };
      });

      mm.add(`(max-width: ${DESKTOP_BREAKPOINT}px)`, () => {
        const triggers = leftItemRefs.current.map((item, index) => {
          if (!item) return null;

          return ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            end: "bottom 30%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index)
          });
        });

        return () => {
          triggers.forEach((trigger) => trigger && trigger.kill());
        };
      });
    }, sectionRef);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
      mm.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
          filter: "blur(6px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out"
        }
      );

      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          y: 22
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.12
        }
      );
    }, sectionRef);

    const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;
    const scrollContainer = leftScrollRef.current;
    const activeEl = leftItemRefs.current[activeIndex];

    if (isDesktop && hasMountedRef.current && scrollContainer && activeEl) {
      const containerHeight = scrollContainer.clientHeight;
      const itemTop = activeEl.offsetTop;
      const itemHeight = activeEl.offsetHeight;

      const targetScroll = itemTop - containerHeight / 2 + itemHeight / 2;

      scrollContainer.scrollTo({
        top: Math.max(targetScroll, 0),
        behavior: "smooth"
      });
    }

    hasMountedRef.current = true;

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <section className="why-motionpix" ref={sectionRef}>
      <div className="why-header">
        <p className="why-subtitle">OUR EXPERTISE</p>
        <h2 className="section-title">
          What We <span>Do.</span>
        </h2>
      </div>

      <div className="why-layout">
        <div className="why-sticky-left">
          <div className="why-left-card" ref={leftCardRef}>
            <div className="why-left-scroll" ref={leftScrollRef}>
              {services.map((service, i) => (
                <div
                  key={i}
                  ref={(el) => (leftItemRefs.current[i] = el)}
                  className={`why-service-row ${activeIndex === i ? "active" : ""}`}
                >
                  <span className="why-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="why-service-meta">
                    <span className="why-service-title">{service.title}</span>
                    <span className="why-service-dot"></span>
                  </div>
                </div>
              ))}

              <div className="why-mobile-end-space" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <div className="why-scroll-track" aria-hidden="true">
          {services.map((_, i) => (
            <div
              key={i}
              ref={(el) => (desktopTriggerRefs.current[i] = el)}
              className="why-trigger-block"
            />
          ))}
        </div>

        <div className="why-sticky-right">
          <div className="why-preview-card" ref={rightCardRef}>
            <div className="why-preview-top">
              <span className="why-preview-index">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="why-preview-line"></span>
            </div>

            <h3 className="why-preview-title" key={activeIndex} ref={titleRef}>
              {services[activeIndex].title}
            </h3>

            <p className="why-preview-desc" ref={descRef}>
              {services[activeIndex].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMotionpix;