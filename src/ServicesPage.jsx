import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./ServicesPage.css";
import SEO from "./Seo";

const servicesData = [
  {
    title: "2D Animation",
    desc: "Explainer videos, motion graphics & storytelling animations.",
    link: "/services/2d-animation",
    mediaSrc: "./2D animation.webp",
  },
  {
    title: "3D Animation",
    desc: "High-quality 3D visuals, product animations & simulations.",
    link: "/services/3d-animation",
    mediaSrc: "3d animation.jpg",
  },
  {
    title: "AR / VR Solutions",
    desc: "Immersive augmented & virtual reality experiences.",
    link: "/services/ar-vr",
    mediaSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1BBuFge-uebS-NvmCA5p8RMkzxtAvVBftw&s",
  },
  {
    title: "Website Design",
    desc: "Modern, responsive & performance-driven websites.",
    link: "/services/web-design",
    mediaSrc: "./web d.webp",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, social media, branding & growth campaigns.",
    link: "/services/digitalmarketing",
    mediaSrc: "./Digital m.webp",
  },
  {
    title: "Live Shoots & Content",
    desc: "Commercial shoots, reels, brand films & ad campaigns.",
    link: "/services/liveshoots",
    mediaSrc: "./live shoot.webp",
  },
];

const ServicesPage = () => {
  const trackRef = useRef(null);
  const extendedServices = [...servicesData, ...servicesData];
  const dragX = useRef(0);
const scrollX = useRef(0);
const tooltipRef = useRef(null);



// useEffect(() => {
//   const onScroll = () => {
//     if (!trackRef.current) return;

//     const speed = 0.5;
//     const maxShift =
//       trackRef.current.scrollWidth / 2;

//     const x =
//       -(window.scrollY * speed) % maxShift;
//     const y = window.scrollY * 0.05;

//     trackRef.current.style.transform = `
//       translate(${x}px, ${y}px) skewY(-8deg)
//     `;
//   };

//   window.addEventListener("scroll", onScroll, { passive: true });
//   return () => window.removeEventListener("scroll", onScroll);
// }, []);

useEffect(() => {
  if (!trackRef.current) return;

  let targetX = 0;
  let currentX = 0;
  let rafId = null;

  const SPEED = 0.7;      // ⬅ increase this to go faster (0.45–0.8 ideal)
  const SMOOTHNESS = 0.08; // ⬅ lower = smoother (0.06–0.12 ideal)

  const animate = () => {
    // smooth interpolation (LERP)
    currentX += (targetX - currentX) * SMOOTHNESS;

    scrollX.current = currentX;

    trackRef.current.style.transform = `
      translate3d(${scrollX.current + dragX.current}px, 0, 0)
    `;

    rafId = requestAnimationFrame(animate);
  };

  const onScroll = () => {
    // faster scroll response
    targetX = -window.scrollY * SPEED;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  rafId = requestAnimationFrame(animate);

  return () => {
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(rafId);
  };
}, []);


useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let lastX = 0;
  let moved = false;
  let velocity = 0;
  let rafId = null;

  const DRAG_THRESHOLD = 6;
  const friction = 0.92;
  const loopWidth = track.scrollWidth / 2;

  const wrap = () => {
    if (dragX.current <= -loopWidth) {
      dragX.current += loopWidth;
    } else if (dragX.current > 0) {
      dragX.current -= loopWidth;
    }
  };

const render = () => {
  const x = scrollX.current + dragX.current;
  track.style.transform = `translate3d(${x}px, 0, 0)`;

  const wrapper = track.parentElement;
  const wrapperRect = wrapper.getBoundingClientRect();
  const centerX = wrapperRect.left + wrapperRect.width / 2;

  const RADIUS = 520;        // cylinder radius (bigger = flatter)
  const MAX_ROTATE = 28;     // max Y rotation
  const MAX_DEPTH = 260;    // Z depth
  const MIN_SCALE = 0.72;   // smallest scale at edges
  const MIN_OPACITY = 0.55; // edge fade

  Array.from(track.children).forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;

    // normalize position (-1 → 0 → 1)
    const norm = (cardCenter - centerX) / (wrapperRect.width / 2);
    const clamped = Math.max(-1, Math.min(1, norm));

    // --- PURE CYLINDER MATH ---
    const angle = clamped * Math.PI * 0.35; // radians
    const rotateY = angle * (180 / Math.PI);
    const translateZ = Math.cos(angle) * MAX_DEPTH - MAX_DEPTH;
    const scale = Math.max(
      MIN_SCALE,
      Math.cos(angle) * 0.28 + 0.72
    );
    const opacity =
      Math.max(MIN_OPACITY, Math.cos(angle));

    card.style.transform = `
      translateZ(${translateZ}px)
      rotateY(${rotateY}deg)
      scale(${scale})
    `;

    card.style.opacity = opacity;
  });
};


  const inertia = () => {
    velocity *= friction;
    dragX.current += velocity;
    wrap();
    render();

    if (Math.abs(velocity) > 0.3) {
      rafId = requestAnimationFrame(inertia);
    }
  };

  // const onDown = (e) => {
  //   isDown = true;
  //   moved = false;
  //   startX = lastX = e.pageX;
  //   velocity = 0;

  //   track.style.cursor = "grabbing";
  //   track.classList.add("dragging");
  //    track.style.pointerEvents = "none";
    

  //   cancelAnimationFrame(rafId);
  // };

  const onDown = (e) => {
  isDown = true;
  moved = false;
  startX = lastX = e.pageX;
  velocity = 0;

  track.style.cursor = "grabbing";
  track.classList.add("dragging");
  track.style.pointerEvents = "none";

  // ✅ TOOLTIP: hide + change text
  if (tooltipRef.current) {
    tooltipRef.current.classList.remove("show");
    tooltipRef.current.querySelector(".tooltip-text").textContent = "Dragging…";
  }

  cancelAnimationFrame(rafId);
};


  const onMove = (e) => {
    if (!isDown) return;

    const dx = e.pageX - lastX;
    lastX = e.pageX;

    if (Math.abs(e.pageX - startX) > DRAG_THRESHOLD) {
      moved = true;
      track.style.pointerEvents = "none";
    }

    if (moved) {
      dragX.current += dx;
      velocity = dx;
      wrap();
      render();
    }
  };

//  const onUp = () => {
//   if (!isDown) return;

//   isDown = false;
//   track.style.cursor = "grab";
//   track.classList.remove("dragging");

//   // ✅ Re-enable clicks AFTER drag
//   setTimeout(() => {
//     track.style.pointerEvents = "auto";
//   }, 0);

//   if (moved) {
//     rafId = requestAnimationFrame(inertia);
//   }
// };

  const onUp = () => {
  if (!isDown) return;

  isDown = false;
  track.style.cursor = "grab";
  track.classList.remove("dragging");

  setTimeout(() => {
    track.style.pointerEvents = "auto";
  }, 0);

  // ✅ TOOLTIP: restore text + show again
  if (tooltipRef.current) {
    tooltipRef.current.querySelector(".tooltip-text").textContent =
      "Drag or click";
    tooltipRef.current.classList.add("show");
  }

  if (moved) {
    rafId = requestAnimationFrame(inertia);
  }
};


  track.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  return () => {
    track.removeEventListener("mousedown", onDown);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    cancelAnimationFrame(rafId);
  };
}, []);

//tooltip useffect 
useEffect(() => {
  if (window.innerWidth < 992) return;

  const tooltip = tooltipRef.current;
  const wrapper = trackRef.current?.parentElement;

  if (!tooltip || !wrapper) return;

  let visible = false;

  const move = (e) => {
    tooltip.style.transform = `
      translate3d(${e.clientX}px, ${e.clientY}px, 0)
    `;
  };

  // const enter = () => {
  //   visible = true;
  //   tooltip.classList.add("show");
  // };

  const enter = () => {
  if (trackRef.current?.classList.contains("dragging")) return;
  tooltip.classList.add("show");
};


  const leave = () => {
    visible = false;
    tooltip.classList.remove("show");
  };

  wrapper.addEventListener("mousemove", move);
  wrapper.addEventListener("mouseenter", enter);
  wrapper.addEventListener("mouseleave", leave);

  return () => {
    wrapper.removeEventListener("mousemove", move);
    wrapper.removeEventListener("mouseenter", enter);
    wrapper.removeEventListener("mouseleave", leave);
  };
}, []);


//removing cursor dot+riing
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  const enter = () => {
    document.body.classList.add("disable-custom-cursor");
  };

  const leave = () => {
    document.body.classList.remove("disable-custom-cursor");
  };

  track.addEventListener("mouseenter", enter);
  track.addEventListener("mouseleave", leave);

  return () => {
    track.removeEventListener("mouseenter", enter);
    track.removeEventListener("mouseleave", leave);
  };
}, []);


useEffect(() => {
  // Run ONLY on mobile / tablet
  if (window.innerWidth >= 992) return;

  const cards = document.querySelectorAll(".scroll-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target); // reveal once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));

  return () => observer.disconnect();
}, []);

  return (
    <section className="services-page">

         <SEO
        title="Our Services | MotionPix"
        description="Explore our 12 creative services including 2D, 3D animation, AR/VR, web design, branding, and digital marketing."
        keywords="animation services, web design, branding, digital marketing,ar/vr"
        url="https://yourdomain.com/services"
        image="https://yourdomain.com/images/services.jpg"
      />
      {/* HERO */}
      <div className="services-hero">
        <h1>Our <span>Services</span></h1>
        <p>Creative, Digital & Visual Solutions for Modern Brands</p>
      </div>
      <div className="diagonal-wrapper d-none d-lg-block">
         <div className="diagonal-skew">
  <div
    className="diagonal-track"
    ref={trackRef}
  >
    {extendedServices.map((service, i) => (
      <NavLink to={service.link} key={i} className="diagonal-card"  onClick={(e) => {
    if (trackRef.current?.classList.contains("dragging")) {
      e.preventDefault();
    }
  }}> 
        <div className="diagonal-media">
          <img src={service.mediaSrc} alt={service.title} />
        </div>

        <div className="diagonal-overlay">
          <h3 className="fw-bold">{service.title}</h3>
          <p className="fw-bold">{service.desc}</p>
        </div>
      </NavLink>
    ))}
  </div>
  {/* DRAG TOOLTIP (DESKTOP ONLY) */}
  
<div className="drag-tooltip" ref={tooltipRef}>
  <span className="tooltip-text text-center">Drag or click</span>
</div>

  </div>
</div>


      {/* MOBILE / TABLET GRID (UNCHANGED) */}
      <div className="container py-5 d-lg-none">
        <div className="row g-4">
          {servicesData.map((service, index) => (
            <div key={index} className="col-md-6 col-sm-12">
  <NavLink to={service.link} className="service-card-15 scroll-card">
    <div className="service-media-page">
      <img src={service.mediaSrc} alt={service.title} />
    </div>
    <div className="service-content">
      <h3 className="fw-bold">{service.title}</h3>
      <p className="fw-bold">{service.desc}</p>
      <span className="service-link fw-bold">Explore →</span>
    </div>
  </NavLink>
</div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
