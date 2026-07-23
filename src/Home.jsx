import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Counter from "./Counter";
import "./Home.css";
import "./Clients.css";
import "./WhatWeDo.css";
import "./Industries.css";
import "./NewsCard.css";
import "./FaqCards.css";
import "./Testimonials.css";
import "./Courses.css";
import IntroSection from "./IntroSection";
import StickyServices from "./StickyServices";
import PhysicsScene from "./PhysicsScene";
import VisitorCounter from "./VisitorCounter";
import LogoScrollReveal from "./LogoScrollReveal";
import WhyMotionpix from "./WhyMotionpix";
import { Helmet } from "react-helmet-async";

const industries = [
  {
    title: "Manufacturing",
    desc: "Explaining complex industrial processes with precision visuals.",
    media:
      "https://img.freepik.com/premium-photo/blur-background-smart-machine-arm-working-by-using-technology-spate_31965-486652.jpg",
    stats: ["500+ Videos", "15+ Years", "Global Plants"],
  },
  {
    title: "Automotive",
    desc: "Visualizing performance, assembly, and innovation.",
    media:
      "https://www.shutterstock.com/image-photo/blurry-car-repair-shop-being-600nw-2627870465.jpg",
    stats: ["EV | ICE", "3D Assembly", "Training Films"],
  },
  {
    title: "Oil & Gas",
    desc: "High-risk systems explained safely through animation.",
    media:
      "https://img.freepik.com/free-vector/oil-pumps-derricks-sunset-background_1182-1649.jpg?semt=ais_hybrid&w=740&q=80",
    stats: ["Safety SOPs", "Process Flow", "3D Cutaways"],
  },
  {
    title: "Power & Energy",
    desc: "From generation to distribution—made clear.",
    media:
      "https://rominavaz.wordpress.com/wp-content/uploads/2017/12/ejemplos-de-energc3ada-mecc3a1nica.jpg?w=640",
    stats: ["Thermal | Solar", "Grid Visuals", "Explainers"],
  },
  {
    title: "Infrastructure",
    desc: "Large-scale projects communicated with clarity.",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThVQ1To1DGXOu1ZvfRlAhTTSPksdyBuVlorw&s",
    stats: ["Mega Projects", "Phasing", "Execution"],
  },
  {
    title: "Medical & Pharma",
    desc: "Simplifying science through clean 3D storytelling.",
    media:
      "https://www.shutterstock.com/image-photo/surgical-lamp-hangs-foreground-sharply-600nw-2672585757.jpg",
    stats: ["MOA Videos", "3D Anatomy", "Training"],
  },
  {
    title: "Retail",
    desc: "Product stories that influence buying decisions.",
    media:
      "data:image/jpeg;base64,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",
    stats: ["Product Films", "In-store Visuals", "Brand Stories"],
  },
  {
    title: "Real Estate",
    desc: "Visualizing spaces before they are built.",
    media:
      "https://img.freepik.com/premium-photo/blur-background-residential-house-construction-urban-city-spate_31965-448458.jpg?semt=ais_hybrid&w=740&q=80",
    stats: ["3D Walkthroughs", "Aerial Views", "Virtual Tours"],
  },
  {
    title: "Education",
    desc: "Interactive learning designed for better retention.",
    media:
      "https://www.shutterstock.com/image-photo/beautiful-blurred-background-bright-classroom-600nw-2475753339.jpg",
    stats: ["E-learning", "Interactive Modules", "Explainers"],
  },
  {
    title: "Trade Shows & Events",
    desc: "High-impact visuals for live brand experiences.",
    media:
      "https://www.shutterstock.com/image-photo/defocused-background-networking-event-attendees-600nw-2615336723.jpg",
    stats: ["Event Films", "LED Content", "Launch Videos"],
  },
  {
    title: "Steel",
    desc: "Heavy processes explained with technical clarity.",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcY45CiK23h8g6YgMii2weAC2dNm5HRxdTGQ&s",
    stats: ["Process Flow", "Plant Animation", "Training"],
  },
  {
    title: "Plastic & Chemicals",
    desc: "Complex material flows made visually simple.",
    media:
      "https://www.ecowatch.com/wp-content/uploads/2024/05/dasani-bottles.jpg",
    stats: ["Material Flow", "Safety Visuals", "Explainers"],
  },
  {
    title: "Consumer Products",
    desc: "Turning everyday products into visual stories.",
    media:
      "https://prolificstudio.co/wp-content/uploads/2024/09/The-Power-of-3D-Product-Visualization-for-Marketing-Campaigns.jpg",
    stats: ["Product Demos", "Marketing Films", "3D Visuals"],
  },
];

const testimonials = [
  {
    quote:
      "With the same marketing team, we secured significantly more business using branding animations and process visualizations created by Motionpix.",
    name: "Marketing Head",
    company: "Global Manufacturing Company",
    logo: "https://www.motionpixindia.com/clients/Asset1.png",
  },
  {
    quote:
      "Motionpix helped us explain complex industrial workflows clearly. Their 3D walkthroughs improved engagement across sales and training.",
    name: "Product Manager",
    company: "Industrial Automation Firm",
    logo: "https://www.motionpixindia.com/clients/Asset2.png",
  },
  {
    quote:
      "From product explainers to industrial walkthroughs, Motionpix delivered visuals that enhanced our brand credibility and conversions.",
    name: "Business Development Lead",
    company: "Engineering Solutions Provider",
    logo: "https://www.motionpixindia.com/clients/Asset3.png",
  },
];

const clients = [
  { id: 1, name: "Client 1", img: "https://www.motionpixindia.com/clients/Asset1.png" },
  { id: 2, name: "Client 2", img: "https://www.motionpixindia.com/clients/Asset2.png" },
  { id: 3, name: "Client 3", img: "https://www.motionpixindia.com/clients/Asset3.png" },
  { id: 4, name: "Client 4", img: "https://www.motionpixindia.com/clients/Asset5.png" },
  { id: 5, name: "Client 5", img: "https://www.motionpixindia.com/clients/Asset6.png" },
  { id: 6, name: "Client 6", img: "https://www.motionpixindia.com/clients/Asset7.png" },
  { id: 7, name: "Client 7", img: "https://www.motionpixindia.com/clients/Asset8.png" },
  { id: 8, name: "Client 8", img: "https://www.motionpixindia.com/clients/Asset9.png" },
  { id: 9, name: "Client 9", img: "https://www.motionpixindia.com/clients/Asset10.png" },
  { id: 10, name: "Client 10", img: "https://www.motionpixindia.com/clients/Asset11.png" },
  { id: 11, name: "Client 11", img: "https://www.motionpixindia.com/clients/Asset12.png" },
  { id: 12, name: "Client 12", img: "https://www.motionpixindia.com/clients/Asset13.png" },
  { id: 13, name: "Client 13", img: "https://www.motionpixindia.com/clients/Asset14.png" },
  { id: 14, name: "Client 14", img: "https://www.motionpixindia.com/clients/Asset15.png" },
  { id: 15, name: "Client 15", img: "https://www.motionpixindia.com/clients/Asset16.png" },
  { id: 16, name: "Client 16", img: "https://www.motionpixindia.com/clients/Asset17.png" },
  { id: 17, name: "Client 17", img: "https://www.motionpixindia.com/clients/Asset4.png" },
  { id: 18, name: "Client 18", img: "https://www.motionpixindia.com/clients/Asset18.png" },
  { id: 19, name: "Client 19", img: "https://www.motionpixindia.com/clients/Asset19.png" },
  { id: 20, name: "Client 20", img: "https://www.motionpixindia.com/clients/Asset21.png" },
  { id: 21, name: "Client 21", img: "https://www.motionpixindia.com/clients/Asset20.png" },
];

const coursesData = [
  {
    title: "2D Animation",
    image: "/2D Animation.jpg",
    link: "/services/2d-animation",
  },
  {
    title: "3D Animation",
    image: "/3d animation1.jpg",
    link: "/services/3d-animation",
  },
  {
    title: "Graphics Design",
    image: "/graphic design 1.jpg",
    link: "/services/graphicsdesign",
  },
  {
    title: "Web Design",
    image: "/web d.webp",
    link: "/services/web-design",
  },
  {
    title: "Digital Marketing",
    image: "/Digital m.webp",
    link: "/services/digitalmarketing",
  },
  {
    title: "E-Learning",
    image: "/Elearning.webp",
    link: "/services/e-learning",
  },
  {
    title: "AR/VR",
    image: "/ar.webp",
    link: "/services/ar-vr",
  },
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const handleIndustryMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);
  };

  useEffect(() => {
  // page reload / page click नंतर नेहमी top पासूनच start होण्यासाठी
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, []);

  return (
    <>

    <Helmet>
  <title>Motionpix India | 3D Animation, Industrial Visualization & Branding</title>

  <meta name="description" content="Motionpix India provides 2D/3D animation, AR/VR, industrial visualization,Website Design and digital branding solutions for global industries." />

  <meta name="keywords" content="2D/3D animation company India,Pune, industrial animation, AR-VR company,Website Design, branding agency India" />
<link rel="canonical" href="https://www.motionpixindia.com/" />

  <meta property="og:title" content="Motionpix Cinematix India" />
  <meta property="og:description" content="Motionpix India provides 2D/3D animation, AR/VR, industrial visualization, Website Design and digital branding solutions for global industries." />
  <meta property="og:url" content="https://www.motionpixindia.com/" />
  <meta property="og:image" content="https://www.motionpixindia.com/Logo.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Motionpix India" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Motionpix Cinematix India" />
  <meta name="twitter:description" content="Motionpix India provides 2D/3D animation, AR/VR, industrial visualization, Website Design and digital branding solutions for global industries." />
  <meta name="twitter:image" content="https://www.motionpixindia.com/Logo.png" />
</Helmet>
        
      <section className="hero-section mobile-only">
        <div className="hero-overlay"></div>

        <div className="mt-4 d-flex justify-content-center">
          <VisitorCounter />
        </div>

        <div className="container hero-content text-center">
          <img src="/Logo.png" alt="MotionPix Logo" className="hero-logo mt-5" />

          <h1 className="fw-bold display-4 text-white">
            Motion<span>Pix</span> India
          </h1>

          <h6 className="fs-5 text-secondary">
            Motionpix Cinematix India Private Limited
          </h6>

          <h6 className="fs-4 text-light mb-4">Your Digital Branding Partner</h6>

          <div className="row justify-content-center text-white mt-5 g-4">
            <div className="col-12 col-md-4 text-center">
              <h2>
                <Counter end={20} />
              </h2>
              <p>Visual Design Experts</p>
            </div>

            <div className="col-12 col-md-4 text-center">
              <h2>
                <Counter end={15} />
              </h2>
              <p>Years of Experience</p>
            </div>

            <div className="col-12 col-md-4 text-center">
              <h2>
                <Counter end={100} />
              </h2>
              <p>Projects Delivered Successfully</p>
            </div>
          </div>

          <h6 className="text-light fs-5 mt-4">
            We craft next-gen 3D industrial visuals, cinematic experiences, and AR/VR content.
          </h6>
        </div>
      </section>

      <section className="physics-section desktop-only">
        <PhysicsScene />
      </section>

      <IntroSection />
      <LogoScrollReveal />
      <StickyServices data={coursesData} />
      <WhyMotionpix/>

      <section className="industries-stats-section">
        <div className="container">
          <div className="text-center mb-5 text-red">
            <h2 className="fw-bold text-light">
              Industries We <span>Empower</span>
            </h2>
            <p className="text-secondary mt-2">
              Visual storytelling backed by experience, scale, and results.
            </p>
          </div>

          <div className="industries-grid text-black">
            {industries.map((item, indexValue) => (
              <div
                key={item.title}
                className={`industry-card flip-card ${
                  flippedIndex === indexValue ? "is-flipped" : ""
                }`}
                onMouseMove={handleIndustryMove}
                onClick={() =>
                  setFlippedIndex(flippedIndex === indexValue ? null : indexValue)
                }
              >
                <div className="flip-inner">
                  <div className="flip-front">
                    <img src={item.media} alt={item.title} />
                    <div className="edge-title">
                      <span>{item.title}</span>
                    </div>
                  </div>

                  <div className="flip-back">
                    <div className="industry-overlay">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>

                      <div className="industry-stats">
                        {item.stats.map((stat, statIndex) => (
                          <span key={statIndex}>{stat}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="news-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-light">
              Industry <span>Insights News</span>
            </h2>
            <p className="text-secondary">
              Trends, technologies, and transformations shaping modern industries
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Transportation Industry",
                desc: "Visualizing smart mobility, mass transit, and future transport systems.",
                media:
                  "https://mechatrix.com/wp-content/uploads/2018/06/shutterstock_189644957_024901490_2370.jpg",
              },
              {
                title: "Technology Revolution",
                desc: "How Industry 4.0, AI, and XR are redefining operations.",
                media:
                  "https://mechatrix.com/wp-content/uploads/2018/08/shutterstock_190417499_024901490_2345.jpg",
              },
              {
                title: "Renewable Energy & Sustainability",
                desc: "Explaining clean energy systems through powerful visuals.",
                media:
                  "https://mechatrix.com/wp-content/uploads/2018/08/gray_51437565_024901490_2513.jpg",
              },
              {
                title: "Mega Trends Shaping Industries",
                desc: "EVs, automation, digital twins, and immersive learning.",
                media:
                  "https://mechatrix.com/wp-content/uploads/2018/08/gray_190753244_024901490_2528.jpg",
              },
            ].map((item) => (
              <div key={item.title} className="col-12 col-md-6 col-lg-3">
                <div className="news-card">
                  <img src={item.media} alt={item.title} />
                  <div className="news-overlay">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <NavLink
              to="/data/news"
              className="btn btn-outline-light gradient-bg text-light px-4"
            >
              Read More Insights →
            </NavLink>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-light">
              What Our Valued <span>Clients Say</span>
            </h2>
            <p className="text-secondary mt-3">
              Our clients enhance marketing impact using Motionpix’s 2D & 3D
              animation, industrial walkthroughs, and branding visuals.
            </p>
          </div>

          <div className="testimonial-wrapper">
            {testimonials.map((item, i) => (
              <div
                key={item.company}
                className={`testimonial-card ${i === index ? "active" : ""}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="testimonial-header">
                  <img src={item.logo} alt={item.company} />
                </div>

                <p className="testimonial-quote">“{item.quote}”</p>

                <div className="testimonial-author">
                  <strong>{item.name}</strong>
                  <span>{item.company}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-light">
              FAQ<span>'S</span>
            </h2>
            <p className="text-secondary">
              Common questions about industrial visualization and digital storytelling
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                q: "What industries does Motionpix work with?",
                a: "Motionpix works with Industrial, Manufacturing, Automation, Engineering, Technology, Education, and Corporate Sectors. Our solutions are designed to simplify complex products, processes, SOPs, and technologies through visual and digital communication.",
              },
              {
                q: "Can Motionpix handle projects end-to-end?",
                a: "Yes. Motionpix provides complete end-to-end services—from concept development, scripting, and design to animation, development, branding, marketing, and final delivery. Clients get all digital and visual solutions under one roof.",
              },
              {
                q: "How do Motionpix animations and digital solutions help businesses?",
                a: `Our services help businesses 

                    1. Explain complex concepts clearly, 

                    2. Improve training effectiveness, 

                    3. Enhance marketing impact, 

                    4. Support sales presentations. 

                    Visual communication increases understanding, engagement, and decision-making.`,
              },
              {
                q: " Does Motionpix create customized solutions for each client?",
                a: "Absolutely. Every project is custom-designed based on the client’s product, process, SOP, audience, and objectives. We do not use templates—each solution is tailored for maximum relevance and impact.",
              },
              {
                q:" Can Motionpix integrate multiple services into one project?",
                a:"Yes. Motionpix often combines 2D/3D animation, E-learning modules, AR/VR, SOP digitization, website design, branding, video content, and digital marketing into a single integrated solution for consistent and professional communication."
              },
              {
                q:"How long does a typical Motionpix project take?",
                a:"Project timelines depend on scope and complexity. Smaller projects may take 2–3 weeks, while advanced animations, AR/VR, or multi-service projects may take 4–8 weeks. A clear timeline is shared before the project starts."
              }
            ].map((faq) => (
              <div key={faq.q} className="col-12 col-md-6">
                <div className="faq-card">
                  <h5>{faq.q}</h5>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <NavLink to="/data/faq" className="btn btn-outline-light px-4">
              Read More FAQ's →
            </NavLink>
          </div>
        </div>
      </section>

      <section className="clients-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold text-light mb-5">
            Our <span>Clients</span>
          </h2>
        </div>

        <div className="clients-marquee">
          <div className="clients-track">
            {[...clients, ...clients].map((client, idx) => (
              <div className="client-marquee-item" key={`${client.id}-${idx}`}>
                <div className="client-card text-center">
                  <img
                    src={client.img}
                    alt={client.name}
                    className="client-logo"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;