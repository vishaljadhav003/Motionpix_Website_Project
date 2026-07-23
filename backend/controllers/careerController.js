const db = require("../config/db");
const nodemailer = require("nodemailer");

// ✅ MAIL CONFIG (IMPROVED)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.updateStatus = (req, res) => {
  const { id, status, interviewDate } = req.body;

  db.query(
    "UPDATE careers SET status=?, interview_date=? WHERE id=?",
    [status, interviewDate || null, id],
    async (err) => {
      if (err) return res.status(500).send("DB Error");

      db.query(
        "SELECT name,email,role FROM careers WHERE id=?",
        [id],
        async (err2, result) => {
          const user = result[0];

          try {

            // 🟡 PENDING
            if (status === "pending") {
              await transporter.sendMail({
                to: user.email,
                subject: "Application Received ✅",
                html: `
                  <div style="font-family:Poppins;padding:25px;background:#f8fafc">
                    <h2 style="color:#0ea5e9">Hello ${user.name}</h2>
                    <p>Your application for <b>${user.role}</b> is under review.</p>
                    <p>We will update you soon.</p>
                    <br/>
                    <b>— MotionPix Team</b>
                  </div>
                `,
              });
            }

            // 🎯 SHORTLISTED
            if (status === "shortlisted") {
              await transporter.sendMail({
                to: user.email,
                subject: "🎯 You're Shortlisted!",
                html: `
                  <div style="font-family:Poppins;padding:25px;background:#ecfdf5">
                    <h2 style="color:#16a34a">Congrats ${user.name} 🎉</h2>
                    <p>You are shortlisted for <b>${user.role}</b>.</p>
                    <p>Interview details coming soon.</p>
                    <br/>
                    <b>— MotionPix Team</b>
                  </div>
                `,
              });
            }

            // 📅 INTERVIEW
            if (status === "completed") {
              await transporter.sendMail({
                to: user.email,
                subject: "Interview Scheduled 🎯",
                html: `
                  <div style="font-family:Poppins;padding:25px;background:#eff6ff">
                    <h2>Hello ${user.name},</h2>
                    <p>Your interview for <b>${user.role}</b> is scheduled.</p>

                    <h4>📅 Date: ${new Date(interviewDate).toDateString()}</h4>
                    <h4>⏰ Time: 11:00 AM</h4>

                    <br/>
                    <b>— MotionPix Team</b>
                  </div>
                `,
              });
            }

            // ❌ REJECTED
            if (status === "rejected") {
              await transporter.sendMail({
                to: user.email,
                subject: "Application Update",
                html: `
                  <div style="font-family:Poppins;padding:25px;background:#fef2f2">
                    <h2>Hello ${user.name},</h2>
                    <p>We appreciate your interest in <b>${user.role}</b>.</p>
                    <p>Unfortunately, we won’t proceed further.</p>
                    <p>Best of luck 💙</p>
                    <br/>
                    <b>— MotionPix Team</b>
                  </div>
                `,
              });
            }

          } catch (e) {
            console.log(e);
          }

          // 🔥 AUTO REFRESH SOCKET
          const io = req.app.get("io");
          io.emit("statusUpdated");

          res.json({ success: true });
        }
      );
    }
  );
};

// CREATE
exports.createCareer = (req, res) => {
  const { name, email, role, message } = req.body;
  const resume = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO careers (name, email, role, message, resume)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, role, message, resume], async (err) => {
    if (err) return res.status(500).json({ error: "DB Error" });

    const io = req.app.get("io");
    io.emit("newCareer", { name, email });

    try {
      // ADMIN MAIL
      await transporter.sendMail({
        from: `"MotionPix" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "🚀 New Job Application",
        html: `
          <h3>New Application</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Role:</b> ${role}</p>
          <p>${message}</p>
        `,
      });

      // USER MAIL
      await transporter.sendMail({
        from: `"MotionPix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Application Received 🎉",
        html: `
          <h2>Hello ${name},</h2>
          <p>Your application for <b>${role}</b> is successfully received.</p>
          <p>We’ll contact you soon.</p>
          <br/>
          <b>— MotionPix Team</b>
        `,
      });

    } catch (err) {
      console.log("Email error:", err);
    }

    res.json({ success: true });
  });
};

// GET
exports.getCareers = (req, res) => {
  db.query("SELECT * FROM careers ORDER BY id DESC", (err, result) => {
    if (err) throw err;
    res.render("admin-career", { data: result });
  });
};

// COMPLETE (INTERVIEW MAIL 🔥)
exports.completeCareer = (req, res) => {
  const id = req.params.id;

  db.query("UPDATE careers SET status='completed' WHERE id=?", [id], () => {

    db.query("SELECT name,email,role FROM careers WHERE id=?", [id], async (err, result) => {
      const user = result[0];

      // ✅ dynamic date
      const today = new Date();
      const interviewDate = new Date(today.setDate(today.getDate() + 2));

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Interview Scheduled 🎯",
          html: `
            <h2>Hello ${user.name},</h2>

            <p>Congratulations! 🎉</p>

            <p>Your application for <b>${user.role}</b> has been <b>accepted</b>.</p>

            <h4>Interview Details:</h4>
            <p><b>Date:</b> ${interviewDate.toDateString()}</p>
            <p><b>Time:</b> 11:00 AM</p>

            <br/>
            <b>— MotionPix Team</b>
          `,
        });

      } catch (err) {
        console.log(err);
      }

      res.redirect("/api/admin/careers");
    });

  });
};

// DELETE
exports.deleteCareer = (req, res) => {
  db.query("DELETE FROM careers WHERE id=?", [req.params.id], () => {
    res.redirect("/api/admin/careers");
  });
};