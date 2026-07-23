import { useEffect, useRef, useState } from "react";
import "./Contact.css";
import axios from "axios";

const Contact = () => {
  const [data, setData] = useState({
    fname: "",
    lname: "",
    email: "",
    services: "",
    contact: "",
    msg: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const datahandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const saveform = async (e) => {
  e.preventDefault();

  const isConfirmed = window.confirm("Are you sure you want to submit?");

  if (!isConfirmed) return; // ❌ cancel केलं तर stop

  try {
    const res = await axios.post("http://localhost:5000/api/contact", data,{ withCredentials: true });

    if (res.data.success) {
      alert("🎉 Form submitted successfully!");

      setData({
        fname: "",
        lname: "",
        email: "",
        services: "",
        contact: "",
        msg: "",
      });
    }
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("❌ Error submitting form");
  }
};

  return (
    <section className="contact-section" ref={sectionRef}>
      <div className="contact-bg-orb contact-bg-orb-one" aria-hidden="true"></div>
      <div className="contact-bg-orb contact-bg-orb-two" aria-hidden="true"></div>

      <div
        className={`container contact-heading-wrap text-center scroll-reveal ${
          isVisible ? "revealed" : ""
        }`}
      >
        <span className="contact-kicker">LET’S CONNECT</span>
        <h2 className="contact-title">Quick <span>Enquiry</span></h2>
        <p className="contact-subtitle">
          Fill out the form below and our team will get back to you shortly.
        </p>
      </div>

      <div className="container contact-form-shell">
        <div
          className={`contact-form-card scroll-reveal scroll-reveal-delay ${
            isVisible ? "revealed" : ""
          }`}
        >
          <div className="contact-form-border" aria-hidden="true"></div>
          <div className="contact-form-glow" aria-hidden="true"></div>

          <form onSubmit={saveform}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="contact-label">First Name*</label>
                <input
                  type="text"
                  name="fname"
                  className="form-control contact-input fw-bold"
                  placeholder="Enter your first name"
                  value={data.fname}
                  onChange={datahandler}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="contact-label">Last Name*</label>
                <input
                  type="text"
                  name="lname"
                  className="form-control contact-input fw-bold"
                  placeholder="Enter your last name"
                  value={data.lname}
                  onChange={datahandler}
                  required
                />
              </div>

              <div className="col-12">
                <label className="contact-label">Services</label>
                <select
                  className="form-control contact-input contact-select fw-bold"
                  name="services"
                  value={data.services}
                  onChange={datahandler}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="2d-animation">2D Animations</option>
                  <option value="3d-animation">3D Animations</option>
                  <option value="ar-vr">AR/VR</option>
                  <option value="digitalmarketing">Digital Marketing</option>
                  <option value="web-design">Website Design</option>
                  <option value="e-learning">E-Learning</option>
                  <option value="graphicsdesign">Graphics Design</option>
                  <option value="motiongraphics">Motion Graphics</option>
                  <option value="sop">SOP Digitization</option>
                  <option value="print-media">Print Media</option>
                  <option value="product-branding">Branding</option>
                  <option value="live-shoots">Live Shoots</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="contact-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="form-control contact-input fw-bold"
                  placeholder="abc@gmail.com"
                  value={data.email}
                  onChange={datahandler}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="contact-label">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  className="form-control contact-input fw-bold"
                  placeholder="Phone number"
                  value={data.contact}
                  onChange={datahandler}
                  required
                />
              </div>

              <div className="col-12">
                <label className="contact-label">Short Bio</label>
                <textarea
                  className="form-control contact-input contact-textarea fw-bold"
                  rows="5"
                  name="msg"
                  placeholder="Tell us about your requirement"
                  value={data.msg}
                  onChange={datahandler}
                ></textarea>
              </div>

              <div className="col-12 text-center pt-2">
                <button
                  type="submit"
                  className="btn contact-submit-btn fw-bold px-5 py-3 btn-outline-light"
                >
                  Submit Your Form
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;