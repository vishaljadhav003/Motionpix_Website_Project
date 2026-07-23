import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";

import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTelegram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Logo from "../public/Logo.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState("Detecting location...");

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getUserLocation = async () => {
      if (!("geolocation" in navigator)) {
        setLocation("Location not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (!res.ok) {
              throw new Error("Failed to fetch location");
            }

            const data = await res.json();
            const address = data?.address || {};

            const cityName =
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              address.suburb ||
              address.neighbourhood ||
              address.city_district ||
              address.state_district ||
              address.county ||
              address.municipality ||
              address.state ||
              "";

            const countryName = address.country || "";

            if (cityName && countryName) {
              setLocation(`${cityName}, ${countryName}`);
            } else if (cityName) {
              setLocation(cityName);
            } else if (countryName) {
              setLocation(countryName);
            } else {
              setLocation("Location unavailable");
            }
          } catch (error) {
            setLocation("Location unavailable");
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocation("Location permission denied");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocation("Location unavailable");
          } else if (error.code === error.TIMEOUT) {
            setLocation("Location request timed out");
          } else {
            setLocation("Location unavailable");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getUserLocation();
  }, []);

  const currentYear = dateTime.getFullYear();

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const day = dateTime.getDate();
  const daySuffix = getDaySuffix(day);

  const month = dateTime.toLocaleString("en-IN", {
    month: "long",
  });

  const year = dateTime.getFullYear();

  const formattedTime = dateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="footer bg-black text-light">
      <div className="container py-4">
        <div className="row gy-4">
          <div className="col-lg-6 col-md-12">
            <div className="map-responsive rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d236.52442882554354!2d73.85562401782451!3d18.4659464140141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eb1046c3f119%3A0xa381cdde8e2900d7!2s54%2FB%2C%20opposite%20Modi%20Clinic%2C%20Rakshalekha%20Society%2C%20New%20Nurses%20Town%20Co%20Operative%20Society%2C%20Dhankawadi%2C%20Pune%2C%20Maharashtra%20411043!5e0!3m2!1sen!2sin!4v1767693656640!5m2!1sen!2sin"
                loading="lazy"
                allowFullScreen
                title="Location Map"
                className="map"
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="fw-bold mb-3">📍 Address</h5>
            <p className="fs-6 mb-0 fw-bold">
              54/A, Rakshalekha Society,
              <br />
              Dhankawadi, Pune – 411043
            </p>
          </div>

          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="fw-bold mb-3">📞 Contact</h5>

            <a
              href="tel:+919822055205"
              className="d-flex align-items-center fw-bold text-decoration-none text-light mb-2"
              aria-label="Call us"
            >
              <i className="bi bi-telephone-fill text-success me-2"></i>
              +91 98220 55205
            </a>

            <a
              href="mailto:info@motionpixindia.com"
              className="d-flex align-items-center fw-bold text-decoration-none text-light mb-4"
              aria-label="Email us"
            >
              <i className="bi bi-envelope-fill text-info me-2"></i>
              info@motionpixindia.com
            </a>

            <h6 className="fw-bold fs-5 mb-3">Follow Us</h6>
            <div className="d-flex gap-3">
              <NavLink
                to="https://www.facebook.com/profile.php?id=61578380430447"
                className="nav-link"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="fs-3 text-primary social-link"
                />
              </NavLink>

              <NavLink
                to="https://www.instagram.com/motionpixindia/"
                className="nav-link"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="fs-3 instagram social-link"
                />
              </NavLink>

              <NavLink to="https://www.telegram.org" className="nav-link">
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="fs-3 telegram social-link"
                />
              </NavLink>

              <NavLink to="https://www.linkedin.com" className="nav-link">
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="fs-3 threads social-link"
                />
              </NavLink>

              <NavLink
                to="https://www.youtube.com/channel/UCI0DaU_jECXW-gAsbk7_JGA"
                className="nav-link"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="fs-3 youtube social-link"
                />
              </NavLink>
            </div>

            <div className="glass-cta mt-4 text-center">
              <NavLink
                to="/contact"
                className="btn glass-btn footer-enquire-btn fw-bold px-4 py-3 w-100 w-lg-auto btn-outline-dark"
              >
                <span className="footer-enquire-text">Enquire Now...</span>
                <i className="bi bi-arrow-right footer-enquire-icon"></i>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom bg-dark py-3">
        <div className="container">
          <div className="row align-items-center text-center text-md-start gy-2">
            <div className="col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <img src={Logo} alt="MotionPix Logo" style={{ height: "50px" }} />
              <span className="fs-5 text-light">
                Motion<span className="text-danger">Pix</span> India
              </span>
            </div>

            <div className="col-md-6 d-flex flex-column align-items-center align-items-md-end mt-2 mt-md-0">
              <p className="fs-5 mb-1">
                © {currentYear} MotionPix Cinematix India Pvt Ltd.
              </p>
         <p className="footer-credit mb-0 footer-credit-premium">
  Designed & Developed with{" "}
  <span className="heart-beat">❤</span> by{" "}
  <a
    href="https://www.linkedin.com/in/your-linkedin-vishaljadhav"
    target="_blank"
    rel="noopener noreferrer"
    className="designer-link premium-link"
  >
    Vishal Jadhav
  </a>
</p>        <span className="footer-datetime">
                {day}
                <sup>{daySuffix}</sup> {month} {year} | {formattedTime}
              </span>

              <span className="footer-location">📍 {location}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;