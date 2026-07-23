import { useEffect, useMemo, useRef, useState } from "react";
import TeamCard from "./TeamCard";
import "./TeamSection.css";

const teamMembersSeed = [
  {
    name: "Abhijeet",
    role: "Director Operations",
    location: "Pune, India",
    image: "./Abhijeet.png",
    about: "Crafting high-impact digital experiences with a focus on quality, clarity, and execution.",
  },
  {
    name: "Ashwini",
    role: "Website Developer/Software Developer",
    location: "Pune, India",
    image: "/team/priya.jpg",
    about: "Focused on clean UI, scalable systems, and performance-first development.",
  },
  {
    name: "Himanshu",
    role: "Sales & Marketing Executive",
    location: "Pune, India",
    image: "/team/priya.jpg",
    about: "Building reliable web experiences with modern stacks and strong attention to detail.",
  },
  {
    name: "Sadashiv",
    role: "HR & Admin Executive",
    location: "Pune, India",
    image: "/team/priya.jpg",
    about: "Turning ideas into polished web products with smooth UX and solid engineering.",
  },
   {
    name: "Pravin",
    role: "PHD in Animation",
    location: "Pune, India",
    image: "./Pravin.png",
    about: "Dr. Pravin Yadav is a PhD-holding researcher, educator, and technologist based in Pune, Maharashtra. A passionate lifelong learner with honed technical skills, he combines academic rigor from Symbiosis International University with deep expertise in VR, XR, animation, and emerging technologies. Felicitated by the Governor of Maharashtra and awarded Best Cartoonist by R.K. Laxman’s panel, he excels in innovative problem-solving and artistic expression.",
  },
  {
    name: "Amod",
    role: "3D Animation Lead",
    location: "Bhopal, India",
    image: "./Amod-Bara.png",
    about: "Leading 3D animation workflows, storytelling, and high-quality visual production.",
  },
  {
    name: "Rutvik",
    role: "3D Modeling & Environment Artist",
    location: "Amravati, India",
    image: "./Rutvik.png",
    about: "Creating detailed 3D assets, environments, and production-ready models.",
  },
  {
    name: "Nageshwar",
    role: "Video Editing/Motion Graphics Animation",
    location: "Pune, India",
    image: "./Nagesh.png",
    about: "Editing and motion work with rhythm, clarity, and strong visual impact.",
  },
  {
    name: "Vishal",
    role: "Web Developer/Software Developer",
    location: "Pune, India",
    image: "./Vishal.png",
    about: "Delivering fast, responsive, and maintainable websites with modern UI standards.",
  },
   {
    name: "Trupti",
    role: "2D Animator",
    location: "Pune, India",
    image: "./Trupti.png",
    about: "Building AI-driven solutions and software systems that scale cleanly.",
  },
   {
    name: "Sushant",
    role: "Video Editor",
    location: "Pune, India",
    image: "./Sushant.png",
    about: "Building AI-driven solutions and software systems that scale cleanly.",
  },
];

// typewriter hook
function useTypewriter(text, speed = 14) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return out;
}

export default function TeamSection() {
  // ✅ members in state so you can update later person-by-person
    const [members, setMembers] = useState(teamMembersSeed);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const sectionRef = useRef(null);
  const openerScrollYRef = useRef(0);

  const selectedMember = selectedIndex !== null ? members[selectedIndex] : null;

  const detailsText = useMemo(() => {
    if (!selectedMember) return "";
    return [
      `Role: ${selectedMember.role}`,
      `Location: ${selectedMember.location}`,
      `About: ${selectedMember.about || ""}`,
    ].join("\n");
  }, [selectedMember]);

  const typed = useTypewriter(detailsText, 14);

  const openMember = (index) => {
    openerScrollYRef.current = window.scrollY;

    if (sectionRef.current) {
        window.scrollTo({ top: openerScrollYRef.current, behavior: "smooth" });
    }

    setSelectedIndex(index);
    document.documentElement.classList.add("team-lock-scroll");
    document.body.classList.add("team-lock-scroll");
  };

  const closeMember = () => {
    setSelectedIndex(null);
    document.documentElement.classList.remove("team-lock-scroll");
    document.body.classList.remove("team-lock-scroll");
    window.scrollTo({ top: openerScrollYRef.current, behavior: "instant" });
  };

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && selectedMember) closeMember();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember]);

  // ✅ Premium cursor-follow tooltip (desktop hover only)
  const [tip, setTip] = useState({ show: false, x: 0, y: 0 });
  const tipHideRaf = useRef(0);

  const tipMove = (e) => {
    // smooth updates (no heavy state spam)
    const x = e.clientX;
    const y = e.clientY;
    setTip((s) => (s.show ? { ...s, x, y } : s));
  };

  const tipEnter = () => {
    if (tipHideRaf.current) cancelAnimationFrame(tipHideRaf.current);
    setTip((s) => ({ ...s, show: true }));
  };

  const tipLeave = () => {
    // tiny delay feels premium (prevents flicker between cards)
    tipHideRaf.current = requestAnimationFrame(() => {
      setTip((s) => ({ ...s, show: false }));
    });
  };

  return (
    <section className="team-section" ref={sectionRef}>
      <div className="container">
        <h2 className="team-title">
          Meet Our <span>Team</span>
        </h2>
        <p className="team-subtitle">Passionate minds crafting powerful digital experiences</p>

        {/* GRID stays same look; only adds hover tooltip + click */}
        <div className="team-grid">
          {members.map((member, index) => (
            <div
              key={index}
              className="team-card-clickwrap"
              onClick={() => openMember(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openMember(index);
              }}
              onMouseEnter={tipEnter}
              onMouseLeave={tipLeave}
              onMouseMove={tipMove}
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Cursor-follow tooltip (desktop only via CSS) */}
          <div
                className={`team-hover-tooltip ${tip.show ? "show" : ""}`}
                style={{
                    transform: `translate3d(${tip.x}px, ${tip.y}px, 0) translate3d(18px, 18px, 0)`,
                }}
                aria-hidden="true"
                >
                <span className="team-hover-tooltip-text">Click for more details & View Profile</span>
        </div>
      {/* OVERLAY (unchanged from your latest) */}
      {selectedMember && (
        <div className="team-overlay" role="dialog" aria-modal="true" aria-label="Team member details">
          <div className="team-overlay-backdrop" onClick={closeMember} />

          <div className="team-overlay-panel">
            {/* DESKTOP SPLIT */}
            <div className="team-overlay-split">
              <div className="team-overlay-left">
                <div className="team-selected-card">
                  <TeamCard member={selectedMember} />
                </div>
              </div>
              

              <aside className="team-details-premium" aria-live="polite">
                <div className="team-details-header">
                  <div className="team-details-avatar">
                    <img src={selectedMember.image} alt={selectedMember.name} />
                  </div>

                  <div className="team-details-title">
                    <h3>{selectedMember.name}</h3>
                    <span className="team-chip">{selectedMember.role}</span>
                  </div>

                  <button className="team-close-x" type="button" onClick={closeMember} aria-label="Close">
                    ✕
                  </button>
                </div>

                <div className="team-details-body">
                  <pre className="team-typewriter">
                    {typed}
                    <span className="team-caret" aria-hidden="true" />
                  </pre>

                  <button className="team-back-btn" type="button" onClick={closeMember}>
                    ← Back to Team
                  </button>
                </div>
              </aside>
            </div>

            {/* MOBILE: bottom sheet */}
            <div className="team-sheet">
              <div className="team-sheet-handle" />

              <div className="team-sheet-top">
                <div className="team-sheet-mini">
                  <div className="team-details-avatar">
                    <img src={selectedMember.image} alt={selectedMember.name} />
                  </div>
                  <div className="team-details-title">
                    <h3>{selectedMember.name}</h3>
                    <span className="team-chip">{selectedMember.role}</span>
                  </div>
                </div>

                <button className="team-close-x" type="button" onClick={closeMember} aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="team-sheet-content">
                <div className="team-sheet-card">
                  <TeamCard member={selectedMember} />
                </div>

                <div className="team-sheet-details">
                  <pre className="team-typewriter">
                    {typed}
                    <span className="team-caret" aria-hidden="true" />
                  </pre>

                  <button className="team-back-btn" type="button" onClick={closeMember}>
                    ← Back to Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}