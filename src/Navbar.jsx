import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Collapse } from "bootstrap";
import "./Navbar.css";

const HOLIDAY_LIST = [
  {
    date: "2026-03-19",
    title: "Gudhi Padwa",
    message: "Office Closed Today • Celebrating Gudhi Padwa",
  },
  {
    date: "2026-05-01",
    title: "Labour Day",
    message: "Office Closed Today • Celebrating Labour Day",
  },
  {
    date: "2026-08-15",
    title: "Independence Day",
    message: "Office Closed Today • Celebrating Independence Day",
  },
  {
    date: "2026-10-02",
    title: "Gandhi Jayanti",
    message: "Office Closed Today • Celebrating Gandhi Jayanti",
  },
  {
    date: "2027-01-26",
    title: "Republic Day",
    message: "Office Closed Today • Celebrating Republic Day",
  },
];

const getFormattedDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const format12HourTime = (hours24, minutes) => {
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  const minutesText = String(minutes).padStart(2, "0");
  return `${hours12}:${minutesText}${suffix}`;
};

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState("Detecting location...");

  const navigate = useNavigate();

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
          } catch {
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
    month: "short",
  });

  const year = dateTime.getFullYear();

  const formattedTime = dateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const currentHour = dateTime.getHours();
  const currentMinute = dateTime.getMinutes();
  const currentDay = dateTime.getDay();

  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const openingMinutes = 9 * 60 + 30;
  const closingMinutes = 18 * 60 + 30;

  const isSunday = currentDay === 0;

  const isBusinessHours =
    !isSunday &&
    currentTotalMinutes >= openingMinutes &&
    currentTotalMinutes < closingMinutes;

  const openingTimeLabel = format12HourTime(9, 30);
  const closingTimeLabel = format12HourTime(18, 30);

  const todayKey = getFormattedDateKey(dateTime);

  const todayHoliday = HOLIDAY_LIST.find(
    (holiday) => holiday.date === todayKey
  );

  const isHolidayToday = Boolean(todayHoliday);

  let liveStatusText = "";
  let liveStatusClass = "";

  if (isHolidayToday) {
    liveStatusText = todayHoliday.message;
    liveStatusClass = "status-closed";
  } else if (isBusinessHours) {
    liveStatusText = `Open Until ${closingTimeLabel}`;
    liveStatusClass = "status-open";
  } else if (isSunday) {
    liveStatusText = `Closed • Opens Monday at ${openingTimeLabel}`;
    liveStatusClass = "status-closed";
  } else if (currentTotalMinutes < openingMinutes) {
    liveStatusText = `Opens Today at ${openingTimeLabel}`;
    liveStatusClass = "status-closed";
  } else if (currentDay === 6) {
    liveStatusText = `Closed • Opens Monday at ${openingTimeLabel}`;
    liveStatusClass = "status-closed";
  } else {
    liveStatusText = `Closed • Opens Tomorrow at ${openingTimeLabel}`;
    liveStatusClass = "status-closed";
  }

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      closeNavbar();
    }
  };

  const closeNavbar = () => {
    const navbar = document.getElementById("mainNavbar");
    if (!navbar) return;

    const bsCollapse =
      Collapse.getInstance(navbar) || new Collapse(navbar, { toggle: false });

    bsCollapse.hide();
    setServicesOpen(false);
    setDataOpen(false);
    setIsNavOpen(false);
  };

  const toggleNavbar = () => {
    const navbar = document.getElementById("mainNavbar");
    if (!navbar) return;

    const bsCollapse =
      Collapse.getInstance(navbar) || new Collapse(navbar, { toggle: false });

    if (navbar.classList.contains("show")) {
      bsCollapse.hide();
      setIsNavOpen(false);
    } else {
      bsCollapse.show();
      setIsNavOpen(true);
    }
  };

  const toggleServicesDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setServicesOpen((prev) => !prev);
  };

  const toggleDataDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDataOpen((prev) => !prev);
  };

  return (
    <>
      <div className="top-datetime-bar">
        <div className="container-fluid top-datetime-inner">
          <div
            className="top-working-badge"
            aria-label="Working time and live status"
          >
            <div className="top-working-content">
              <div className="top-working-row">
                <span className="working-icon">🕒</span>
                <span className="top-working-text">
                  Working Time: 09:30AM - 06:30PM • Mon - Sat
                </span>
              </div>

              <div className="top-status-row ms-1">
                <span className={`status-dot ${liveStatusClass}`}></span>
                <span className={`top-status-text ${liveStatusClass}`}>
                  {liveStatusText}
                </span>
              </div>
            </div>
          </div>

          <div className="top-strip-tagline" aria-label="Brand tagline">
            <span className="top-strip-tagline-text">
              2D • 3D • AR/VR • Web Design • Motion Graphics
            </span>
          </div>

          <div
            className="top-datetime-badge"
            aria-label="Current date, time and location"
          >
            <div className="top-datetime-content">
              <div className="top-datetime-row">
                <span className="live-dot"></span>
                <span className="top-datetime-text">
                  {day}
                  <sup>{daySuffix}</sup> {month} {year} | {formattedTime}
                </span>
              </div>

              <div className="top-location-row">
                <span className="top-location-text">📍 {location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top px-3 navbar-disable-cursor">
        <div className="container-fluid">
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center"
            onClick={closeNavbar}
          >
            <img
              src="/Logo1.png"
              alt="Logo"
              className="navbar-logo me-2 rounded"
              style={{ width: "150px", height: "55px", objectFit: "contain" }}
            />
          </NavLink>

          <button
            className={`navbar-toggler custom-navbar-toggler ${
              isNavOpen ? "open" : ""
            }`}
            type="button"
            onClick={toggleNavbar}
            aria-controls="mainNavbar"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3 text-center">
              <li className="nav-item">
                <NavLink
                  className="nav-link fw-bold"
                  to="/"
                  onClick={closeNavbar}
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link fw-bold"
                  to="/about"
                  onClick={closeNavbar}
                >
                  About Us
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  to="/services"
                  className="nav-link fw-bold"
                  onClick={closeNavbar}
                >
                  Services
                </NavLink>

                <button
                  className="dropdown-toggle-icon"
                  onClick={toggleServicesDropdown}
                  aria-expanded={servicesOpen}
                  type="button"
                >
                  <i
                    className={`bi ${
                      servicesOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  ></i>
                </button>

                <ul
                  className={`dropdown-menu text-light mobile-dropdown-menu ${
                    servicesOpen ? "show" : ""
                  }`}
                >
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/2d-animation"
                      onClick={closeNavbar}
                    >
                      2D Animation
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/3d-animation"
                      onClick={closeNavbar}
                    >
                      3D Animation
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/ar-vr"
                      onClick={closeNavbar}
                    >
                      AR / VR
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/digitalmarketing"
                      onClick={closeNavbar}
                    >
                      Digital Marketing
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/web-design"
                      onClick={closeNavbar}
                    >
                      Website Design
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/liveshoots"
                      onClick={closeNavbar}
                    >
                      Live Shoots
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/e-learning"
                      onClick={closeNavbar}
                    >
                      E-Learning
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/sop"
                      onClick={closeNavbar}
                    >
                      SOP Digitization
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/graphicsdesign"
                      onClick={closeNavbar}
                    >
                      Graphics Design
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/motiongraphics"
                      onClick={closeNavbar}
                    >
                      Motion Graphics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/print-media"
                      onClick={closeNavbar}
                    >
                      Print Media
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/services/product-branding"
                      onClick={closeNavbar}
                    >
                      Branding
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item fw-bold">
                <NavLink
                  className="nav-link"
                  to="/gallery"
                  onClick={closeNavbar}
                >
                  Gallery
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  to="/data"
                  className="nav-link fw-bold"
                  onClick={closeNavbar}
                >
                  Data
                </NavLink>

                <button
                  className="dropdown-toggle-icon"
                  onClick={toggleDataDropdown}
                  aria-expanded={dataOpen}
                  type="button"
                >
                  <i
                    className={`bi ${
                      dataOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  ></i>
                </button>

                <ul
                  className={`dropdown-menu text-light mobile-dropdown-menu ${
                    dataOpen ? "show" : ""
                  }`}
                >
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/blogs"
                      onClick={closeNavbar}
                    >
                      Blogs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/news"
                      onClick={closeNavbar}
                    >
                      News
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/faq"
                      onClick={closeNavbar}
                    >
                      FAQ&apos;S
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/testimonials"
                      onClick={closeNavbar}
                    >
                      Testimonials
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/testcases"
                      onClick={closeNavbar}
                    >
                      TestCases
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/data/whitepapers"
                      onClick={closeNavbar}
                    >
                      WhitePapers
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item fw-bold">
                <NavLink
                  className="nav-link"
                  to="/careers"
                  onClick={closeNavbar}
                >
                  Careers
                </NavLink>
              </li>

              <li className="nav-item fw-bold">
                <NavLink
                  className="nav-link"
                  to="/contact"
                  onClick={closeNavbar}
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="ms-lg-3 mt-3 mt-lg-0">
              <input
                type="search"
                className="form-control form-control-sm fw-bold"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
            </div>

            <div className="ms-lg-3 mt-3 mt-lg-0">
              <NavLink
                to="/contact"
                className="btn glass-btn btn-outline-light px-4 fw-bold"
                onClick={closeNavbar}
              >
                Get A Quote
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;