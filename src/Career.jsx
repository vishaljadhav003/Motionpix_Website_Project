import { useEffect, useRef, useState } from "react";
import "./Career.css";
import { NavLink } from "react-router-dom";

// import { NavLink } from "react-router-dom";

// const jobs = [
//   {
//     title: "Motion Graphics Designer",
//     type: "Full Time",
//     location: "Onsite / Remote",
//   },
//   {
//     title: "3D Animation Artist",
//     type: "Internship",
//     location: "Onsite",
//   },
//   {
//     title: "UI / UX Designer",
//     type: "Full Time",
//     location: "Remote",
//   },
//   {
//     title: "Digital Marketing Executive",
//     type: "Full Time",
//     location: "Work from Home",
//   },
// ];

const jobs = [
  {
    title: "Motion Graphics Designer",
    type: "Full Time",
    location: "Onsite / Remote",
    description: `
    We are looking for a creative Motion Graphics Designer who can create
    engaging animations for videos, ads, and social media.

    Responsibilities:
    • Create motion graphics and visual effects
    • Collaborate with creative and marketing teams
    • Deliver high-quality animations on time

    Requirements:
    • After Effects / Premiere Pro
    • Strong sense of timing & storytelling
    • Portfolio required
    `,
  },
  {
    title: "3D Animation Artist",
    type: "Internship",
    location: "Onsite",
    description: `
    Join our 3D team to work on high-quality animations for branding,
    product visuals, and explainer videos.

    Responsibilities:
    • 3D modeling, texturing & animation
    • Lighting and rendering
    • Support senior artists

    Requirements:
    • Blender / Maya
    • Basic animation principles
    • Passion to learn
    `,
  },
  {
    title: "UI / UX Designer",
    type: "Full Time",
    location: "Remote",
    description: `
    We need a UI/UX Designer to craft intuitive, modern, and user-centered designs.

    Responsibilities:
    • Wireframes & prototypes
    • Design systems
    • User research & testing

    Requirements:
    • Figma / Adobe XD
    • UX principles
    • Strong visual sense
    `,
  },
  {
    title: "Digital Marketing Executive",
    type: "Full Time",
    location: "Work from Home",
    description: `
    Drive brand growth through digital campaigns, SEO, and social media.

    Responsibilities:
    • Run marketing campaigns
    • SEO & analytics
    • Social media strategy

    Requirements:
    • Google Ads / Meta Ads
    • SEO basics
    • Content planning skills
    `,
  },
];


const Career = () => {
  const revealRefs = useRef([]);
 const [form, setForm] = useState({
  name: "",
  email: "",
  role: "",
  message: "",
  resume: null,
});
const fileRef = useRef();

const [success, setSuccess] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);


//reveal useffect
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();


  if (!form.resume) {
    alert("Please upload resume");
    return;
  }

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("role", form.role);
  formData.append("message", form.message);
  formData.append("resume", form.resume);

  try {
    const res = await fetch("http://localhost:5000/api/career", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
if (data.success) {
  setSuccess(true);

  setForm({
    name: "",
    email: "",
    role: "",
    message: "",
    resume: null,
  });

  // 🔥 file input reset
  if (fileRef.current) {
    fileRef.current.value = "";
  }

  setTimeout(() => {
    setSuccess(false);
  }, 3000);
}
  } catch (err) {
    console.log("Error:", err);
  }
};

const handleFileChange = (e) => {
  setForm({ ...form, resume: e.target.files[0] });
};

  return (
    <section className="career-page">

      {/* HERO */}
      <div
        className="career-hero reveal"
        ref={(el) => (revealRefs.current[0] = el)}
      >
        <h1>
          Build Your <span>Career</span> With Us
        </h1>
        <p>
          Join a team where creativity, learning, and innovation
          grow together.
        </p>
        <NavLink to='/contact'><button className="cta-btn">Apply Now</button></NavLink>
      </div>

      {/* WHY US */}
      <div
        className="career-why reveal"
        ref={(el) => (revealRefs.current[1] = el)}
      >
        <h2 className="section-title">Why <span>Work</span> With Us</h2>

        <div className="why-grid-career">
          <div className="why-card-career">Creative Freedom</div>
          <div className="why-card-career">Career Growth</div>
          <div className="why-card-career">Latest Technologies</div>
          <div className="why-card-career">Supportive Team</div>
        </div>
      </div>

      {/* OPEN POSITIONS */}
      <div
        className="career-jobs reveal"
        ref={(el) => (revealRefs.current[2] = el)}
      >
        <h2 className="section-title">Open <span>Positions</span></h2>

        <div className="jobs-grid">
          {jobs.map((job, i) => (
            <div className="job-card" key={i}>
              <h3 className="fw-bold">{job.title}</h3>
              <p className="fw-bold">{job.type} • {job.location}</p>
                {/* <button className="job-btn fw-bold" onClick={() =>
                 {
                  setForm({ ...form, role: job.title });
                  document
                    .querySelector(".career-form")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Apply
              </button> */}

              <button className="job-btn fw-bold" onClick={() => {
                setSelectedJob(job);
                setForm({ ...form, role: job.title });

                setTimeout(() => {
                  document
                  .querySelector(".career-job-detail")
                  ?.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
              >
              Apply
              </button>


            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="career-job-detail reveal reveal-active"  ref={(el) => (revealRefs.current[3] = el)}>
          <h2 className="section-title mt-3">Job Description for {selectedJob.title}</h2>

          <p className="job-meta">
            {selectedJob.type} • {selectedJob.location}
          </p>

          <pre className="job-description">
            {selectedJob.description}
          </pre>
        </div>
      )}


      {/* APPLY FORM */}
      <div
        className="career-form reveal"
        ref={(el) => (revealRefs.current[4] = el)}
      >
        <h2 className="section-title">Apply <span>Now</span></h2>

        <form onSubmit={handleSubmit}>

          <input className="fw-bold"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input className="fw-bold"
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input className="fw-bold"
            type="text"
            name="role"
            placeholder="Position Applying For"
            value={form.role}
            onChange={handleChange}
            required
          />

          <textarea className="fw-bold"
            name="message"
            placeholder="Tell us about yourself"
            value={form.message}
            onChange={handleChange}
          />

          {/* RESUME UPLOAD */}
          <label className="upload-box">
            <input className="fw-bold"
              ref={fileRef}
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
             
            />
            <span className="fw-bold">
              {form.resume ? form.resume.name : "Upload Resume (PDF/DOC)"}
            </span>
          </label>

          <button type="submit" className="cta-btn fw-bold" disabled={success}>
            Submit Application
          </button>

          {/* SUCCESS ANIMATION */}
          {success && (
            <div className="success-box">
              <div className="checkmark">✓</div>
              <p className="fw-bold">Application Submitted Successfully</p>
            </div>
          )}
        </form>

      </div>

    </section>
  );
};

export default Career;
