import { useEffect, useState } from "react";
import axios from "axios";
import "./VisitorCounter.css";

const API_BASE_URL = "http://localhost:5000/api/track-visitor";
const TOKEN_KEY = "visitor_token";

const VisitorCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Reads only — never increments anything by itself.
    const loadCount = async () => {
      try {
        const res = await axios.get(API_BASE_URL);
        if (isMounted) setCount(res.data.total);
      } catch (err) {
        console.log(err);
      }
    };

    // Sends visitor_token on every page load. The backend (visitor_token
    // uniqueness + affectedRows check) is the single source of truth for
    // new vs existing, so this call is always safe to make — a repeat
    // token from the same browser/device will NEVER bump the total again,
    // and the displayed count always matches what's actually in the DB
    // (correct even right after an admin resets the visitors table).
    const trackVisitor = async (lat = null, lon = null) => {
      const visitorToken =
        localStorage.getItem(TOKEN_KEY) || crypto.randomUUID();
      localStorage.setItem(TOKEN_KEY, visitorToken);

      try {
        await axios.post(API_BASE_URL, { lat, lon, visitorToken });
      } catch (err) {
        console.log(err);
      } finally {
        loadCount();
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => trackVisitor(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          // err.code: 1 = permission denied, 2 = position unavailable,
          // 3 = timeout. Check the browser console to see exactly why
          // location wasn't captured for a given visit.
          console.warn("Geolocation failed:", err.code, err.message);
          trackVisitor();
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    } else {
      trackVisitor();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="visitor-counter">
      <span className="pulse-dot-visitor" />
      <span className="visitor-text">
        {count} people have visited this website.
      </span>
    </div>
  );
};

export default VisitorCounter;