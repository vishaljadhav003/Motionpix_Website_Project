import { useEffect } from "react";
import "./Cursor.css";

const Cursor = () => {
  useEffect(() => {
    if ("ontouchstart" in window) return;

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    const DOT = 8;
    const RING = 34;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
 if ("ontouchstart" in window) return;
  const navbar = document.querySelector(".navbar-disable-cursor");

  if (navbar) {
    navbar.addEventListener("mouseenter", () => {
      document.body.classList.add("default-cursor-active");
    });

    navbar.addEventListener("mouseleave", () => {
      document.body.classList.remove("default-cursor-active");
    });
  }
    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate3d(
        ${mouseX - DOT / 2}px,
        ${mouseY - DOT / 2}px,
        0
      )`;
    };

    const animateRing = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      // Smooth follow
      ringX += dx * 0.28;
      ringY += dy * 0.28;

      // 🔥 SNAP when almost stopped (fixes offset bug)
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ringX = mouseX;
        ringY = mouseY;
      }

      ring.style.transform = `translate3d(
        ${ringX - RING / 2}px,
        ${ringY - RING / 2}px,
        0
      )`;

      requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", moveCursor);
    animateRing();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </>
  );
};

export default Cursor;
