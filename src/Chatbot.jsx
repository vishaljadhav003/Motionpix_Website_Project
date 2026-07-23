import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import botAnimation from "./assets/bot.json";
import { Player } from "@lottiefiles/react-lottie-player";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const suggestions = [
  "What services do you offer?",
  "Pricing details",
  "Project timeline",
  "Contact info"
];

const Chatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [dark, setDark] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // 🆕 attachment (image / pdf) waiting to be sent
  const [pendingFile, setPendingFile] = useState(null);

  // 🆕 edit message
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const chatRef = useRef(null);
  const intervalRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, typing]);

  useEffect(() => {
    if (messages.length > 0) setShowIntro(false);
  }, [messages]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    const recog = new SpeechRecognition();
    recog.start();

    recog.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  const speak = (text) => {
    if (!voiceOn) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    if (/[\u0900-\u097F]/.test(text)) {
      speech.lang = text.includes("आहे") ? "mr-IN" : "hi-IN";
    } else if (/kya|hai|tum|kaise/i.test(text)) {
      speech.lang = "hi-IN";
    } else {
      speech.lang = "en-US";
    }

    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find(v => v.lang === speech.lang) || voices[0];

    speech.rate = 1;
    speech.pitch = 1.1;

    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  // 🆕 mute button -> instantly stop any sound that's playing
  const toggleVoice = () => {
    setVoiceOn(prev => {
      const next = !prev;
      if (!next) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
      return next;
    });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

// 🆕 compress image client-side before it becomes base64 (fixes PayloadTooLargeError)
const compressImage = (file, maxWidth = 1280, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  if (!isImage && !isPdf) {
    alert("Only image or PDF files are supported");
    e.target.value = "";
    return;
  }

  if (isImage) {
    try {
      const compressed = await compressImage(file);
      setPendingFile({
        name: file.name,
        type: "image",
        base64: compressed,
        previewUrl: compressed
      });
    } catch (err) {
      console.log("Image compression failed:", err);
      alert("Couldn't process this image, try another one");
    }
    e.target.value = "";
    return;
  }

  // PDF — as is (text gets extracted server-side, file itself usually small)
  const reader = new FileReader();
  reader.onload = () => {
    setPendingFile({
      name: file.name,
      type: "pdf",
      base64: reader.result,
      previewUrl: null
    });
  };
  reader.readAsDataURL(file);
  e.target.value = "";
};

  const removePendingFile = () => setPendingFile(null);

  // 🆕 stop button — cancels the API call + the streaming reveal, cleanly
  const stopGenerating = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTyping(false);
  };

  const streamMessage = async (text, attachedFile = null) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const controller = new AbortController();
    abortRef.current = controller;

    setTyping(true);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "", time: getTime(), reacting: null }
    ]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          image: attachedFile?.type === "image" ? attachedFile.base64 : null,
          pdf:
            attachedFile?.type === "pdf"
              ? { base64: attachedFile.base64, name: attachedFile.name }
              : null
        })
      });

      const data = await res.json();
      const full = data.reply || "No response";

      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = full.slice(0, i);
          return updated;
        });

        if (i >= full.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTyping(false);
          speak(full);
        }
      }, 20);
    } catch (err) {
      if (err.name !== "AbortError") console.log(err);
      setTyping(false);
    }
  };

  const sendMessage = (custom) => {
    const text = custom || input;
    if (!text.trim() && !pendingFile) return;

    const userMsg = {
      role: "user",
      content:
        text ||
        (pendingFile?.type === "image" ? "Sent an image" : "Sent a PDF document"),
      time: getTime(),
      ...(pendingFile && {
        type: pendingFile.type,
        fileName: pendingFile.name,
        fileURL: pendingFile.previewUrl
      })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    streamMessage(text, pendingFile);
    setPendingFile(null);
  };

  const handleReaction = (index, type) => {
    setMessages(prev =>
      prev.map((msg, i) =>
        i === index
          ? { ...msg, reacting: msg.reacting === type ? null : type }
          : msg
      )
    );
  };

  // 🆕 clear history button
  const clearHistory = () => {
    stopGenerating();
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setMessages([]);
    localStorage.removeItem("chat");
    setShowIntro(true);
  };

  // 🆕 edit message
  const startEdit = (i) => {
    setEditingIndex(i);
    setEditValue(messages[i].content);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const saveEdit = (i) => {
    if (!editValue.trim()) return;
    stopGenerating();

    const text = editValue;
    setMessages(prev => [
      ...prev.slice(0, i),
      { ...prev[i], content: text, time: getTime() }
    ]);
    setEditingIndex(null);
    setEditValue("");

    streamMessage(text);
  };

  return (
    <div className={`chatbot-global ${dark ? "dark" : "light"}`}>

      {!chatOpen && (
        <button className="chat-toggle" onClick={() => setChatOpen(true)}>
          🤖
        </button>
      )}

      {chatOpen && (
        <div className="chat-window">

          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-title">
              <Player autoplay loop src={botAnimation} className="lottie-avatar" />
              <div>
                <h4>MotionPix AI</h4>
                <p>Online</p>
              </div>
            </div>

            {voiceOn && (
              <div className="waveform">
                <span className={speaking ? "active" : ""}></span>
                <span className={speaking ? "active" : ""}></span>
                <span className={speaking ? "active" : ""}></span>
              </div>
            )}

            <div className="actions">
              <button onClick={toggleVoice} title={voiceOn ? "Mute voice" : "Unmute voice"}>
                {voiceOn ? "🔊" : "🔇"}
              </button>
              <button onClick={clearHistory} title="Clear chat history">
                <i className="bi bi-trash3-fill"></i>
              </button>
              <button onClick={() => setChatOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* BODY */}
          <div className="chat-body" ref={chatRef}>
            {showIntro && (
              <div className="intro-screen">
                <h3>👋 Hey there!</h3>
                <p>Ask anything... I'm here to help 🚀</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>

                {editingIndex === i ? (
                  <div className="edit-box">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={2}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(i)} title="Save & regenerate">
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button onClick={cancelEdit} title="Cancel">
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="msg-text">
                    {m.type === "image" && m.fileURL && (
                      <img
                        src={m.fileURL}
                        alt="attachment"
                        className="msg-attachment-img"
                        onClick={() => setPreviewImg(m.fileURL)}
                      />
                    )}

                    {m.type === "pdf" && (
                      <div className="msg-attachment-pdf">
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                        <span>{m.fileName}</span>
                      </div>
                    )}

                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                        img: ({ ...props }) => (
                          <img {...props} onClick={() => setPreviewImg(props.src)} />
                        )
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}

                {editingIndex !== i && (
                  <div className="msg-footer">
                    {m.role === "assistant" && (
                      <div className="msg-reactions">
                        <span
                          className={m.reacting === "like" ? "active" : ""}
                          onClick={() => handleReaction(i, "like")}
                        >👍</span>
                        <span
                          className={m.reacting === "love" ? "active" : ""}
                          onClick={() => handleReaction(i, "love")}
                        >❤️</span>
                        <span
                          className={m.reacting === "dislike" ? "active" : ""}
                          onClick={() => handleReaction(i, "dislike")}
                        >👎</span>
                      </div>
                    )}

                    <span>{m.time}</span>

                    {m.role === "user" && (
                      <button onClick={() => startEdit(i)} title="Edit message">
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    )}

                    <button onClick={() => copyText(m.content)} title="Copy">
                      <i className="bi bi-copy"></i>
                    </button>
                  </div>
                )}

              </div>
            ))}

            {typing && messages[messages.length - 1]?.content === "" && (
              <div className="msg assistant">
                <div className="thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* SUGGESTIONS */}
          <div className="chat-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* 🆕 PENDING ATTACHMENT PREVIEW */}
          {pendingFile && (
            <div className="pending-file-chip">
              {pendingFile.type === "image" ? (
                <img src={pendingFile.previewUrl} alt="attachment" />
              ) : (
                <div className="pdf-chip">
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                </div>
              )}
              <span className="pending-file-name">{pendingFile.name}</span>
              <button onClick={removePendingFile} title="Remove attachment">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}

          {/* INPUT */}
          <div className="chat-input">

            <button className="voice-btn" onClick={startVoice} title="Speak">
              <i className="bi bi-mic"></i>
            </button>

            <input
              type="file"
              id="fileUpload"
              hidden
              accept="image/*,application/pdf"
              onChange={handleFile}
            />

            <button
              className="file-btn"
              onClick={() => document.getElementById("fileUpload").click()}
              title="Attach image / PDF"
            >
              <i className="bi bi-folder-fill"></i>
            </button>

            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (input.trim() || pendingFile)) {
                  sendMessage();
                }
              }}
            />

            {typing ? (
              <button className="send-btn stop-btn" onClick={stopGenerating} title="Stop generating">
                <i className="bi bi-stop-fill"></i>
              </button>
            ) : (
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() && !pendingFile}
                title="Send"
                style={{
                  opacity: !input.trim() && !pendingFile ? 0.5 : 1,
                  cursor: !input.trim() && !pendingFile ? "not-allowed" : "pointer"
                }}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            )}

            {copied && <div className="copy-toast">Copied ✅</div>}
          </div>

             {/* 🆕 AI DISCLAIMER */}
          <div className="ai-disclaimer">
            Content is generated with AI assistance,so surprises and mistakes are possible.
          </div>

          {previewImg && (
            <div className="img-preview-overlay" onClick={() => setPreviewImg(null)}>
              <img src={previewImg} alt="preview" />
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Chatbot;