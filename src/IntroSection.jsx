import { useEffect, useRef, useState } from "react";
import "./IntroSection.css";
import typeSound from "/Typewriter.mp3";

const terminalLines = [
  "[root@motionpix ~]# initializing studio.profile",
  "[ok] visual_pipeline ............ online",
  "[ok] brand_system ............... synced",
  "[ok] 2d_3d_animation ............ active",
  "[ok] ar_vr_xr_modules ........... loaded",
  "[ok] web_digital_marketing ...... connected",
  "",
  "Motionpix is a creative, technology-driven studio delivering end-to-end visual and digital solutions—from 2D & 3D animations, interactive e-learning, and AR/VR/XR experiences to branding, websites, digital marketing, industrial shoots, and corporate presentations, helping brands communicate with clarity and impact.",
];

const BASE_TYPE_SPEED = 18;
const FAST_TYPE_SPEED = 11;
const SLOW_TYPE_SPEED = 34;
const LINE_DELAY = 220;
const FINISH_HOLD = 380;

const IntroSection = () => {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const outputRef = useRef(null);
  const typingStartedRef = useRef(false);
  const mountedRef = useRef(true);

  const [visible, setVisible] = useState(false);
  const [displayedLines, setDisplayedLines] = useState([""]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!outputRef.current) return;
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [displayedLines, charIndex]);

  useEffect(() => {
    if (!visible || isComplete) return;

    if (!typingStartedRef.current) {
      typingStartedRef.current = true;

      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.24;
        audioRef.current.play().catch(() => {});
      }
    }

    const currentLine = terminalLines[lineIndex] ?? "";

    if (lineIndex >= terminalLines.length) {
      setIsComplete(true);
      return;
    }

    if (charIndex < currentLine.length) {
      const currentChar = currentLine[charIndex];

      let nextDelay = BASE_TYPE_SPEED;

      if (currentChar === " ") nextDelay = FAST_TYPE_SPEED;
      if ([".", "-", ":"].includes(currentChar)) nextDelay = SLOW_TYPE_SPEED;
      if (Math.random() > 0.88) nextDelay += 18;

      const timeout = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[lineIndex] = (next[lineIndex] || "") + currentChar;
          return next;
        });
        setCharIndex((prev) => prev + 1);
      }, nextDelay);

      return () => window.clearTimeout(timeout);
    }

    const lineTimeout = window.setTimeout(() => {
      if (!mountedRef.current) return;

      const nextLineIndex = lineIndex + 1;

      if (nextLineIndex < terminalLines.length) {
        setDisplayedLines((prev) => [...prev, ""]);
        setLineIndex(nextLineIndex);
        setCharIndex(0);
      } else {
        setIsComplete(true);

        window.setTimeout(() => {
          if (!mountedRef.current) return;
          setIsSettled(true);

          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.loop = false;
          }
        }, FINISH_HOLD);
      }
    }, LINE_DELAY);

    return () => window.clearTimeout(lineTimeout);
  }, [visible, lineIndex, charIndex, isComplete]);

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0.24;
        })
        .catch(() => {});

      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  return (
    <section ref={sectionRef} className="intro-section-mp">
      <div className={`intro-inner-mp ${visible ? "intro-reveal" : ""}`}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div
                className={`terminal-shell-mp ${isSettled ? "terminal-settled-mp" : ""}`}
              >
                <div className="terminal-noise-mp" aria-hidden="true" />
                <div className="terminal-scanline-mp" aria-hidden="true" />

                <div className="terminal-topbar-mp">
                  <span className="terminal-dot-mp red" />
                  <span className="terminal-dot-mp yellow" />
                  <span className="terminal-dot-mp green" />
                  <div className="terminal-title-mp">root@motionpix:~</div>
                  <div className="terminal-statuspill-mp">secure session</div>
                </div>

                <div className="terminal-body-mp">
                  <h2 className="intro-title-mp">
                    About <span>MotionPix</span>
                  </h2>

                  <div
                    ref={outputRef}
                    className="terminal-output-mp"
                    aria-live="polite"
                  >
                    {displayedLines.map((line, index) => {
                      const isCurrentLine =
                        visible &&
                        !isComplete &&
                        index === lineIndex &&
                        charIndex <= (terminalLines[lineIndex]?.length ?? 0);

                      const isStatusLine =
                        line.startsWith("[root@") || line.startsWith("[ok]");

                      const isEmptyLine = line.trim() === "";

                      return (
                        <p
                          key={`${index}-${line}`}
                          className={`intro-text-mp ${
                            isStatusLine
                              ? "terminal-status-mp"
                              : "terminal-maintext-mp"
                          } ${isEmptyLine ? "terminal-empty-mp" : ""}`}
                        >
                          {line}
                          {index === displayedLines.length - 1 && (
                            <span
                              className={`cursor-mp ${
                                isComplete ? "cursor-static" : ""
                              }`}
                              aria-hidden="true"
                            >
                              █
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <audio ref={audioRef} src={typeSound} preload="auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;