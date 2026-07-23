const express = require("express");
const router = express.Router();
const db = require("../config/db");
const axios = require("axios");

// ============================
// ✅ POST (TRACK VISITOR — GPS + REVERSE GEOCODE)
// ============================
router.post("/track-visitor", async (req, res) => {
  const io = req.app.get("io");
  const { lat, lon, visitorToken } = req.body;

  if (!visitorToken) {
    return res.status(400).json({ error: "visitorToken required" });
  }

  let country = null;
  let city = null;

  if (lat && lon) {
    try {
      const geo = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: { lat, lon, format: "json" },
          headers: { "User-Agent": "motionpix-app" }
        }
      );

      country = geo.data.address?.country || null;

      city =
        geo.data.address?.city ||
        geo.data.address?.town ||
        geo.data.address?.municipality ||
        geo.data.address?.county ||
        geo.data.address?.state ||
        null;
    } catch (err) {
      console.log("Geo Error:", err.message);
    }
  }

  const realIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  const sql = `
    INSERT INTO visitors
      (visitor_token, realIP, user_agent, country, city, lat, lon)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      country = VALUES(country),
      city    = VALUES(city),
      lat     = VALUES(lat),
      lon     = VALUES(lon)
  `;

  db.query(
    sql,
    [visitorToken, realIP, userAgent, country, city, lat, lon],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      // Still used to decide whether to fire the real-time "new visitor"
      // socket event on the map (1 = brand-new row = genuinely new visitor).
      const isNewVisitor = result.affectedRows === 1;

      // ✅ FIX: `total` is no longer a separately-incremented counter
      // (that can drift out of sync with reality under refreshes /
      // concurrent requests). It is now ALWAYS computed directly from
      // the actual number of visitor rows — so it can never be "more"
      // or "less" than the real distinct-visitor count, no matter how
      // many times this route gets hit for the same visitor_token.
      db.query("SELECT COUNT(*) AS total FROM visitors", (countErr, rows) => {
        if (countErr || !rows.length) {
          console.log(countErr);
          return res.json({ success: true });
        }

        const total = rows[0].total;

        db.query(
          "UPDATE visitor_stats SET total = ?, last_total = ? WHERE id = 1",
          [total, total]
        );

        if (isNewVisitor) {
          io.emit("visitorUpdate", { country, city, lat, lon, total });
        }

        res.json({ success: true });
      });
    }
  );
});

// ============================
// ✅ GET (CURRENT VISITOR TOTALS)
// ============================
router.get("/track-visitor", (req, res) => {
  // Same fix here — always the real, live count of distinct visitors.
  db.query("SELECT COUNT(*) AS total FROM visitors", (err, rows) => {
    if (err || !rows.length) {
      console.log(err);
      return res.status(500).json({ total: 0, last: 0 });
    }

    const total = rows[0].total;
    res.json({ total, last: total });
  });
});

// ============================
// ✅ ALL VISITORS (MAP LOAD)
// ============================
router.get("/all-visitors", (req, res) => {
  db.query("SELECT city, country, lat, lon FROM visitors", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});

module.exports = router;