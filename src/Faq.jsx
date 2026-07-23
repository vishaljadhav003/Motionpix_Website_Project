import { useState, useRef, useEffect } from "react";
import "./Faq.css";

const faqs = [
  {
    q: "What services does your company offer?",
    a: "We specialize in Motion Graphics, 2D & 3D Animation, AR/VR, UI/UX Design, Web Development, Digital Marketing, and Branding solutions."
  },
  {
    q: "How long does a project usually take?",
    a: "Project timelines vary based on complexity. Motion graphics usually take 2–4 weeks."
  },
  {
    q: "Do you offer customized solutions?",
    a: "Yes. Every project is tailored to your brand and goals."
  },
  {
    q: "Can I track project progress?",
    a: "Yes, we provide regular updates and previews."
  },
  {
    q: "How can I get started?",
    a: "Contact us via enquiry form and our team will reach out."
  }
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
    const revealRefs = useRef([]);
    const footerRef=useRef(null);
  /* ---------------- ANALYTICS ---------------- */
  const trackEvent = (event, data) => {
    console.log("ANALYTICS:", event, data);
  };

  /* ---------------- FAQ LOGIC ---------------- */
  const toggleFaq = (index, question) => {
    setActiveIndex(activeIndex === index ? null : index);

    trackEvent("FAQ_OPEN", {
      index,
      question
    });
  };

  /* ---------------- REVEAL ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.classList.toggle("reveal-active", entry.isIntersecting)
        ),
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footerRef.current = footer;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setHideChatbot(entry.isIntersecting);
    },
    {
      root: null,
      threshold: 0.1
    }
  );

  observer.observe(footerRef.current);

  return () => observer.disconnect();
}, []);


  return (
    <section className="faq-page">

      {/* HEADER */}
      <div className="faq-header reveal" ref={(el) => (revealRefs.current[0] = el)}>
        <h1>Frequently Asked <span>Questions</span></h1>
        <p>Everything you need to know before working with us.</p>
      </div>

      {/* FAQ LIST */}
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFaq(index, item.q)}
          >
            <div className="faq-question">
              <h3>{item.q}</h3>
              <span className="icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Faq;
