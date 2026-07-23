import React from "react";
import "./EarthPhoneIcon.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const EarthPhoneIcon = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-column-wrapper" aria-label="Social media links">
      <NavLink
        to="https://www.facebook.com/profile.php?id=61578380430447"
        rel="noopener noreferrer"
        className="social-icon"
        aria-label="Visit our Facebook page"
      >
        <FontAwesomeIcon icon={faFacebook} className="social-media facebook" />
      </NavLink>

      <NavLink
        to="https://www.instagram.com/motionpixindia/"
        rel="noopener noreferrer"
        className="social-icon"
        aria-label="Visit our Instagram page"
      >
        <FontAwesomeIcon icon={faInstagram} className="social-media instagram" />
      </NavLink>

      <button
        type="button"
        className="call-icon-wrapper"
        onClick={() => navigate("/contact")}
        aria-label="Go to Contact Page"
      >
        <img src="/call.png" alt="Call Us" className="call-icon-img" />
      </button>

      <NavLink
        to="https://www.youtube.com/channel/UCI0DaU_jECXW-gAsbk7_JGA"
        rel="noopener noreferrer"
        className="social-icon"
        aria-label="Visit our YouTube channel"
      >
        <FontAwesomeIcon icon={faYoutube} className="social-media youtube" />
      </NavLink>

      <NavLink
        to="https://www.linkedin.com"
        rel="noopener noreferrer"
        className="social-icon"
        aria-label="Visit our LinkedIn page"
      >
        <FontAwesomeIcon icon={faLinkedin} className="social-media linkedin" />
      </NavLink>
    </div>
  );
};

export default EarthPhoneIcon;