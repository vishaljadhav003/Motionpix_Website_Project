const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const auth = require("../middleware/auth");

router.post("/contact", contactController.createContact);

// 🔐 Protected admin route
router.get("/admin", auth, contactController.getContacts);

router.get("/complete/:id", contactController.markComplete);
router.get("/delete/:id", contactController.deleteContact);

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});



// Login POST
const db = require("../config/db");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      req.session.user = result[0];
      req.session.isAuth = true;
      res.redirect("/api/admin");
    } else {
      res.send("Invalid credentials");
    }
  });
});

const fetch = require("node-fetch");
const franc = require("franc");
const pdfParse = require("pdf-parse");

router.post("/chat", async (req, res) => {
  const { message, image, pdf } = req.body;

  try {
    // 🌍 DETECT LANGUAGE
    const langCode = franc(message || "");

    // 🔥 STRONG Hinglish detection
    const hinglishWords = [
      "kya","hai","kaise","tum","aap","mera","meri","kar","raha","kyu",
      "ka","ki","ke","hona","bata","bolo","samajh","chal","de","le"
    ];

    const servicesList = `
Animations, AR/VR, Web Design, Branding, Print Media, SOP,
Motion Graphics, Graphics Design, Digital Marketing,
E-Learning, Live Shoots
`;

    const isHinglish = hinglishWords.some(word =>
      (message || "").toLowerCase().includes(word)
    );

    let langInstruction = "Reply in English";

    if (isHinglish) {
      langInstruction = "Reply in Hinglish (Hindi written in English letters)";
    }
    else if (langCode === "hin") {
      langInstruction = "Reply in Hindi (Devanagari script)";
    }
    else if (langCode === "mar") {
      langInstruction = "Reply in Marathi (Devanagari script)";
    }

    // 🆕 PDF text — trimmed tighter (2000 chars ≈ ~500-600 tokens) so low-credit
    // accounts don't hit OpenRouter's per-request token cap
    let pdfText = "";
    if (pdf?.base64) {
      try {
        const base64Data = pdf.base64.split(",").pop();
        const buffer = Buffer.from(base64Data, "base64");
        const parsed = await pdfParse(buffer);
        pdfText = parsed.text.slice(0, 2000);
      } catch (pdfErr) {
        console.log("❌ PDF PARSE ERROR:", pdfErr);
      }
    }

    let userContent;

    if (image) {
      userContent = [
        { type: "text", text: message || "Describe this image and answer anything relevant about it." },
        { type: "image_url", image_url: { url: image } }
      ];
    } else if (pdfText) {
      userContent = `Document content:\n${pdfText}\n\nUser question: ${message || "Summarize this document."}`;
    } else {
      userContent = message;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini",
          max_tokens: 300,
          temperature:0.7,// 🔥 better than llama
        messages: [
         {
  role: "system",
  content: `
You are MotionPix AI assistant.

CRITICAL RULE:
You MUST reply ONLY in the SAME language as the user.

Language mapping:
- If user writes Hinglish → reply in Hinglish ONLY
- If user writes Hindi → reply in Hindi ONLY
- If user writes Marathi → reply in Marathi ONLY
- If user writes English → reply in English ONLY

DO NOT translate.
DO NOT switch language.
DO NOT explain language.

Examples:
 tum kya karte ho  
→ hum animation aur web design services dete hain

 mala sang kasa ahes  
→ mi changla ahe, tumhala kasa madat karu?

Keep answers short, friendly.
${servicesList}
When user asks about services:
→ Always list ALL services properly.
Never reduce services. Always mention full list.

You can also see images the user sends and read text extracted from PDFs the user sends — answer questions about them directly and naturally.

STRICT RULES:
- Reply ONLY to the latest user message
- DO NOT include "User:" or "Assistant:"
- DO NOT repeat question
- DO NOT simulate conversation
- DO NOT give multiple answers
- DO NOT translate give answers according to user message langauage.
- DO NOT add extra explanation
- Give only ONE clean reply

If user asks for contact:
→ reply ONLY:
Email: info@motionpix.in
Contact Number: +91 98220 55205.Thanks
`
},
          {
            role: "user",
            content: userContent
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ OPENROUTER ERROR:", errorText);

      // 🆕 friendly message instead of blank "API Error" when credits/token cap hit
      let friendlyReply = "API Error";
      try {
        const parsedErr = JSON.parse(errorText);
        if (parsedErr?.error?.code === 402) {
          friendlyReply =
            "Sorry, the AI is temporarily over its usage limit. Please try a shorter message, or contact info@motionpix.in — Contact Number: +91 98220 55205.";
        }
      } catch (_) {}

      return res.json({ reply: friendlyReply });
    }

const data = await response.json();

console.log("API RESPONSE:", data); // 👈 DEBUG
let reply =
  data?.choices?.[0]?.message?.content || "No reply";

// 🚀 CLEAN unwanted format
reply = reply
  .replace(/User:.*?\n/g, "")
  .replace(/Assistant:/g, "")
  .trim();

  

res.json({ reply });


  } catch (err) {
    console.log("Chat error:", err);
    res.json({ reply: "Error getting AI response" });
  }
console.log("OpenRouter API Loaded ✅");   
});
// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/api/login");
});

module.exports = router;