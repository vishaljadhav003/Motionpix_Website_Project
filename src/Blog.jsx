import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Blog.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLOG_DATA = [
  {
    id: 1,
    title: "Why Motion Design is the Future of Web",
    excerpt:
      "Motion design is no longer decorative — it guides users, builds trust, and improves conversions.",
    category: "Design",
    readTime: "4 min read",
    date: "Jan 12, 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Motion design has become a core part of modern interface thinking. It is not only about aesthetics — it creates context, hierarchy and emotional clarity.",
      "When users move through a digital experience, motion can explain change, focus attention and reduce friction. Instead of guessing what happened, users feel guided.",
      "Teams that use motion intentionally often see stronger engagement because products feel polished, responsive and trustworthy.",
      "The future of web design is not more animation — it is smarter animation with purpose, restraint and brand consistency.",
    ],
  },
  {
    id: 2,
    title: "Website Performance & User Psychology",
    excerpt:
      "Fast websites feel more trustworthy. Learn how speed directly impacts business results.",
    category: "Performance",
    readTime: "5 min read",
    date: "Jan 10, 2026",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Performance shapes first impressions before users read a single line. A fast website feels reliable, modern and well-engineered.",
      "Users connect speed with quality. Slow loading often creates doubt, especially in high-intent moments like checkout, booking or inquiries.",
      "Technical performance also improves emotional performance. Smooth interactions reduce frustration and make navigation feel effortless.",
      "Better speed is not just an engineering metric — it directly supports trust, retention and conversion.",
    ],
  },
  {
    id: 3,
    title: "Building Scalable Design Systems",
    excerpt:
      "Design systems help teams scale faster while keeping UI consistent and clean.",
    category: "Development",
    readTime: "6 min read",
    date: "Jan 08, 2026",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    content: [
      "A design system is not just a component library. It is a shared language between design, development and product teams.",
      "Scalable systems reduce repeated work and help teams ship faster with fewer inconsistencies.",
      "Well-structured tokens, spacing rules, components and patterns create predictable experiences across products.",
      "The most valuable systems are not the biggest ones — they are the clearest and easiest to adopt.",
    ],
  },
  {
    id: 4,
    title: "Dark UI Design: Best Practices",
    excerpt:
      "Dark themes require more than dark colors. Learn contrast, spacing and accessibility.",
    category: "UI/UX",
    readTime: "4 min read",
    date: "Jan 05, 2026",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Dark UI can feel elegant and immersive, but it requires careful balance. True quality comes from contrast control, not simply darker backgrounds.",
      "Typography, elevation and surface separation become more important in dark interfaces.",
      "Color accents should be used with discipline so they feel intentional instead of overwhelming.",
      "A strong dark theme improves readability, visual focus and premium product perception.",
    ],
  },
  {
    id: 5,
    title: "SEO for Modern React Websites",
    excerpt:
      "React websites can rank extremely well if SEO fundamentals are done right.",
    category: "SEO",
    readTime: "5 min read",
    date: "Jan 03, 2026",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    content: [
      "SEO for React is not broken — it just needs structure. Metadata, content hierarchy and crawl-friendly rendering still matter.",
      "Strong content, accessible HTML and fast performance remain the real foundation.",
      "Modern React sites can perform extremely well when technical setup supports search visibility.",
      "The key is to combine developer flexibility with information architecture that search engines and users both understand.",
    ],
  },
  {
    id: 6,
    title: "How AI is Changing Web Design",
    excerpt:
      "AI tools are reshaping workflows — from copywriting to UI generation.",
    category: "AI",
    readTime: "6 min read",
    date: "Jan 01, 2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    content: [
      "AI is changing how teams explore ideas, generate variants and accelerate production workflows.",
      "The most useful AI tools do not replace design thinking — they enhance iteration speed and reduce repetitive effort.",
      "Designers can spend less time on low-value repetition and more time on strategy, direction and craft.",
      "The future belongs to teams that combine human taste with machine-assisted speed.",
    ],
  },
];

export default function Blog() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const cardsRef = useRef([]);
  const stackTriggerRef = useRef(null);

  const overlayRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const panelHeroRef = useRef(null);
  const panelBodyRef = useRef(null);
  const storyContentRef = useRef(null);

  const titleRef = useRef(null);
  const subTextRef = useRef(null);
  const navRef = useRef(null);

  const sourceCardRectRef = useRef(null);
  const sourceImageRectRef = useRef(null);
  const openTimelineRef = useRef(null);

  const touchStartXRef = useRef(0);
  const touchDeltaXRef = useRef(0);
  const scrollTopRef = useRef(0);
  const restoreLockRef = useRef(false);
  const storyOpenRef = useRef(false);
  const selectedArticleIdRef = useRef(BLOG_DATA[0]?.id ?? null);

  const [activeArticle, setActiveArticle] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(
    BLOG_DATA[0]?.id ?? null
  );
  const [storyOpen, setStoryOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const maxIndex = BLOG_DATA.length - 1;

  const getArticleIndex = (articleId) =>
    BLOG_DATA.findIndex((item) => item.id === articleId);

  const currentCardIndex =
    selectedArticleId !== null ? getArticleIndex(selectedArticleId) : -1;

  useEffect(() => {
    storyOpenRef.current = storyOpen;
  }, [storyOpen]);

  useEffect(() => {
    selectedArticleIdRef.current = selectedArticleId;
  }, [selectedArticleId]);

  const updateReadingProgress = () => {
    const body = panelBodyRef.current;
    if (!body) return;

    const maxScroll = body.scrollHeight - body.clientHeight;

    if (maxScroll <= 0) {
      setReadingProgress(100);
      return;
    }

    const progress = (body.scrollTop / maxScroll) * 100;
    setReadingProgress(Math.max(0, Math.min(progress, 100)));
  };

  const disableBackgroundScroll = () => {
    scrollTopRef.current = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("blogsStable-no-scroll");
    document.body.classList.add("blogsStable-no-scroll");
    document.body.style.top = `-${scrollTopRef.current}px`;
  };

  const scrollToArticleCard = (articleId) => {
  const trigger = stackTriggerRef.current;
  const index = getArticleIndex(articleId);

  if (!trigger || index < 0) return;

  const totalDistance = trigger.end - trigger.start;
  const progress = maxIndex > 0 ? index / maxIndex : 0;
  const targetScroll = trigger.start + totalDistance * progress;

  window.scrollTo(0, targetScroll);
};

  const enableBackgroundScroll = (targetArticleId = null) => {
  const savedScrollTop =
    Math.abs(parseInt(document.body.style.top || "0", 10)) ||
    scrollTopRef.current ||
    0;

  document.documentElement.classList.remove("blogsStable-no-scroll");
  document.body.classList.remove("blogsStable-no-scroll");
  document.body.style.top = "";

  requestAnimationFrame(() => {
    if (targetArticleId !== null) {
      restoreLockRef.current = true;
      selectedArticleIdRef.current = targetArticleId;
      setSelectedArticleId(targetArticleId);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        requestAnimationFrame(() => {
          scrollToArticleCard(targetArticleId);

          requestAnimationFrame(() => {
            setSelectedArticleId(targetArticleId);
            selectedArticleIdRef.current = targetArticleId;

            setTimeout(() => {
              restoreLockRef.current = false;
            }, 160);
          });
        });
      });
    } else {
      window.scrollTo(0, savedScrollTop);
      ScrollTrigger.refresh();
    }
  });
};
  const animateStoryText = () => {
    gsap.killTweensOf([titleRef.current, subTextRef.current, navRef.current]);

    gsap.set(titleRef.current, { opacity: 0, y: 24 });
    gsap.set(subTextRef.current, { opacity: 0, y: 16 });
    gsap.set(navRef.current, { opacity: 0, y: 14 });

    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    })
      .to(
        subTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.1
      )
      .to(
        navRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        0.18
      );
  };

  const goToArticleByStep = (step) => {
    if (!activeArticle) return;

    const currentIndex = getArticleIndex(activeArticle.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + step + BLOG_DATA.length) % BLOG_DATA.length;
    const nextArticle = BLOG_DATA[nextIndex];

    selectedArticleIdRef.current = nextArticle.id;
    setActiveArticle(nextArticle);
    setSelectedArticleId(nextArticle.id);

    requestAnimationFrame(() => {
      if (panelBodyRef.current) {
        panelBodyRef.current.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }

      setReadingProgress(0);
      animateStoryText();

      gsap.fromTo(
        panelHeroRef.current,
        { opacity: 0.84, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
      );

      gsap.fromTo(
        storyContentRef.current,
        { opacity: 0.88 },
        { opacity: 1, duration: 0.32, ease: "power2.out" }
      );
    });
  };

  const goToPrevArticle = () => goToArticleByStep(-1);
  const goToNextArticle = () => goToArticleByStep(1);

  const openArticle = (article, cardElement) => {
    const imageElement = cardElement?.querySelector(".blogsStable-cardImage");

    sourceCardRectRef.current = cardElement
      ? cardElement.getBoundingClientRect()
      : null;

    sourceImageRectRef.current = imageElement
      ? imageElement.getBoundingClientRect()
      : null;

    disableBackgroundScroll();

    selectedArticleIdRef.current = article.id;
    setActiveArticle(article);
    setSelectedArticleId(article.id);
    setStoryOpen(true);
    setReadingProgress(0);
  };

  const finalizeClose = (targetArticleId = null) => {
    setStoryOpen(false);
    setActiveArticle(null);
    setReadingProgress(0);
    enableBackgroundScroll(targetArticleId);
  };

  const closeArticle = () => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const body = panelBodyRef.current;
    const currentArticleId = activeArticle?.id ?? selectedArticleId ?? null;

    if (!overlay || !backdrop || !panel || !body) {
      finalizeClose(currentArticleId);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
    }

    if (prefersReduced) {
      gsap.set(overlay, {
        display: "none",
        pointerEvents: "none",
      });
      finalizeClose(currentArticleId);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        gsap.set(overlay, {
          display: "none",
          pointerEvents: "none",
        });
        finalizeClose(currentArticleId);
      },
    });

    tl.to(body, { opacity: 0, y: 14, duration: 0.18 })
      .to(panel, { opacity: 0, y: 20, duration: 0.24 }, 0.04)
      .to(backdrop, { opacity: 0, duration: 0.2 }, 0.04);
  };

  const handleTouchStart = (event) => {
    if (!storyOpen) return;
    touchStartXRef.current = event.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (event) => {
    if (!storyOpen) return;
    touchDeltaXRef.current = event.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (!storyOpen) return;

    const threshold = 60;

    if (touchDeltaXRef.current <= -threshold) {
      goToNextArticle();
    } else if (touchDeltaXRef.current >= threshold) {
      goToPrevArticle();
    }

    touchStartXRef.current = 0;
    touchDeltaXRef.current = 0;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !sticky || !cards.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const getCardOffset = () => {
        const width = window.innerWidth;
        if (width <= 480) return 10;
        if (width <= 768) return 12;
        if (width <= 1024) return 16;
        return 20;
      };

      const getCardScale = () => {
        const width = window.innerWidth;
        if (width <= 480) return 0.035;
        if (width <= 768) return 0.04;
        return 0.045;
      };

      const setInitialState = () => {
        const offset = getCardOffset();
        const scaleStep = getCardScale();

        cards.forEach((card, index) => {
          gsap.set(card, {
            y: index * offset,
            scale: 1 - index * scaleStep,
            opacity: index === 0 ? 1 : 0.92,
            zIndex: cards.length - index,
          });
        });
      };

      if (prefersReduced) {
        cards.forEach((card, index) => {
          gsap.set(card, {
            clearProps: "all",
            y: index * 8,
            opacity: 1,
            scale: 1,
            zIndex: cards.length - index,
          });
        });
        return;
      }

      setInitialState();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * Math.max(cards.length - 1, 1)}`,
          scrub: 1,
          pin: sticky,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (storyOpenRef.current || restoreLockRef.current) return;

            const nearestIndex = Math.round(self.progress * maxIndex);
            const nextId = BLOG_DATA[nearestIndex]?.id ?? BLOG_DATA[0].id;

            if (selectedArticleIdRef.current !== nextId) {
              selectedArticleIdRef.current = nextId;
              setSelectedArticleId(nextId);
            }
          },
        },
      });

      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;

        tl.to(
          card,
          {
            y: -120,
            scale: 0.86,
            opacity: 0,
            ease: "power2.out",
            duration: 0.9,
          },
          index
        );

        tl.to(
          cards.slice(index + 1),
          {
            y: (i) => i * getCardOffset(),
            scale: (i) => 1 - i * getCardScale(),
            opacity: 1,
            ease: "power2.out",
            duration: 0.9,
            stagger: 0,
          },
          index
        );
      });

      stackTriggerRef.current = tl.scrollTrigger;
      ScrollTrigger.refresh();
    }, section);

    return () => {
      if (openTimelineRef.current) openTimelineRef.current.kill();

      if (stackTriggerRef.current) {
        stackTriggerRef.current.kill();
        stackTriggerRef.current = null;
      }

      ctx.revert();
    };
  }, [maxIndex]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const hero = panelHeroRef.current;
    const body = panelBodyRef.current;

    if (!overlay || !backdrop || !panel || !hero || !body) return;
    if (!storyOpen || !activeArticle) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.set(overlay, {
      display: "block",
      pointerEvents: "auto",
    });

    const panelRect = panel.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const sourceCardRect = sourceCardRectRef.current;
    const sourceImageRect = sourceImageRectRef.current;

    gsap.killTweensOf([backdrop, panel, hero, body]);

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
    }

    if (prefersReduced || !sourceCardRect || !sourceImageRect) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(panel, { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 });
      gsap.set(hero, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
      gsap.set(body, { opacity: 1, y: 0 });

      requestAnimationFrame(() => {
        body.scrollTop = 0;
        setReadingProgress(0);
        animateStoryText();
        updateReadingProgress();
      });

      return;
    }

    const panelScaleX = sourceCardRect.width / panelRect.width;
    const panelScaleY = sourceCardRect.height / panelRect.height;
    const panelX = sourceCardRect.left - panelRect.left;
    const panelY = sourceCardRect.top - panelRect.top;

    const heroScaleX = sourceImageRect.width / heroRect.width;
    const heroScaleY = sourceImageRect.height / heroRect.height;
    const heroX = sourceImageRect.left - heroRect.left;
    const heroY = sourceImageRect.top - heroRect.top;

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(panel, {
      opacity: 1,
      x: panelX,
      y: panelY,
      scaleX: panelScaleX,
      scaleY: panelScaleY,
      transformOrigin: "top left",
      borderRadius: 24,
    });
    gsap.set(hero, {
      x: heroX,
      y: heroY,
      scaleX: heroScaleX,
      scaleY: heroScaleY,
      transformOrigin: "top left",
      borderRadius: 20,
    });
    gsap.set(body, {
      opacity: 0,
      y: 24,
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        body.scrollTop = 0;
        setReadingProgress(0);
        animateStoryText();
        updateReadingProgress();
      },
    });

    tl.to(backdrop, { opacity: 1, duration: 0.28 })
      .to(
        panel,
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: window.innerWidth <= 768 ? 0 : 30,
          duration: 0.72,
        },
        0.02
      )
      .to(
        hero,
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: 0,
          duration: 0.72,
        },
        0.02
      )
      .to(
        body,
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
        },
        0.28
      );

    openTimelineRef.current = tl;
  }, [storyOpen, activeArticle]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeArticle();
      if (event.key === "ArrowRight" && storyOpen) goToNextArticle();
      if (event.key === "ArrowLeft" && storyOpen) goToPrevArticle();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storyOpen, activeArticle]);

  useEffect(() => {
    const body = panelBodyRef.current;
    if (!body || !storyOpen) return;

    const handleScroll = () => {
      updateReadingProgress();
    };

    body.addEventListener("scroll", handleScroll, { passive: true });

    requestAnimationFrame(() => {
      updateReadingProgress();
    });

    return () => {
      body.removeEventListener("scroll", handleScroll);
    };
  }, [storyOpen, activeArticle]);

  const currentIndex = activeArticle ? getArticleIndex(activeArticle.id) : -1;

  const prevArticle =
    currentIndex >= 0
      ? BLOG_DATA[(currentIndex - 1 + BLOG_DATA.length) % BLOG_DATA.length]
      : null;

  const nextArticle =
    currentIndex >= 0
      ? BLOG_DATA[(currentIndex + 1) % BLOG_DATA.length]
      : null;


      useEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, []);
  return (
    <>
      <section className="blogsStable-root" id="blog">
        <div className="blogsStable-container">
          <div className="blogsStable-header">
            <span className="blogsStable-kicker">Data / Blogs</span>
            <h2>
              Scroll Stack <span>Blog</span>
            </h2>
            <p>
              Premium articles with true stacked scroll storytelling across
              desktop and mobile.
            </p>
          </div>
        </div>

        <section ref={sectionRef} className="blogsStable-stackSection">
          <div ref={stickyRef} className="blogsStable-sticky">
            <div className="blogsStable-stackWrap">
              <div className="blogsStable-stack">
                {BLOG_DATA.map((blog, index) => (
                  <article
                    key={blog.id}
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                    className={`blogsStable-card ${
                      currentCardIndex === index ? "blogsStable-cardActive" : ""
                    }`}
                  >
                    <div className="blogsStable-cardImage">
                      <img src={blog.image} alt={blog.title} />
                      <span className="blogsStable-badge">{blog.category}</span>
                    </div>

                    <div className="blogsStable-cardContent">
                      <div className="blogsStable-meta">
                        <small>{blog.date}</small>
                        <span>•</span>
                        <small>{blog.readTime}</small>
                      </div>

                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt}</p>

                      <button
                        type="button"
                        className="blogsStable-link"
                        onClick={(event) => {
                          const card =
                            event.currentTarget.closest(".blogsStable-card");
                          openArticle(blog, card);
                        }}
                      >
                        Read article
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      <div
        ref={overlayRef}
        className={`blogsStable-overlay ${storyOpen ? "is-open" : ""}`}
        aria-hidden={!storyOpen}
        role="dialog"
        aria-modal="true"
      >
        <button
          ref={backdropRef}
          type="button"
          className="blogsStable-overlayBackdrop"
          onClick={closeArticle}
          aria-label="Close article overlay"
        />

        <div className="blogsStable-shell">
          <article ref={panelRef} className="blogsStable-panel">
            <button
              type="button"
              className="blogsStable-close"
              onClick={closeArticle}
              aria-label="Close article"
            >
              ×
            </button>

            {activeArticle && (
              <>
                <div ref={panelHeroRef} className="blogsStable-hero">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="blogsStable-heroImg"
                  />
                  <div className="blogsStable-heroOverlay" />

                  <div className="blogsStable-topbar">
                    <span className="blogsStable-category">
                      {activeArticle.category}
                    </span>
                  </div>

                  <div className="blogsStable-heroContent">
                    <div className="blogsStable-storyMeta">
                      <small>{activeArticle.date}</small>
                      <span>•</span>
                      <small>{activeArticle.readTime}</small>
                    </div>

                    <h2 ref={titleRef} className="blogsStable-storyTitle">
                      {activeArticle.title}
                    </h2>

                    <p ref={subTextRef} className="blogsStable-storyExcerpt">
                      {activeArticle.excerpt}
                    </p>
                  </div>
                </div>

                <div
                  ref={panelBodyRef}
                  className="blogsStable-body"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="blogsStable-readingBar">
                    <span
                      className="blogsStable-readingFill"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>

                  <div ref={storyContentRef} className="blogsStable-content">
                    {activeArticle.content?.map((paragraph, index) => (
                      <p key={`${activeArticle.id}-${index}`}>{paragraph}</p>
                    ))}

                    <blockquote className="blogsStable-quote">
                      Great digital stories do not just inform — they create
                      rhythm, clarity and emotional memory.
                    </blockquote>

                    <p>
                      A premium article experience should feel cinematic without
                      becoming heavy. The goal is to make reading elegant,
                      immersive and smooth on every screen size.
                    </p>

                    <div ref={navRef} className="blogsStable-nav">
                      {prevArticle && (
                        <button
                          type="button"
                          className="blogsStable-navBtn"
                          onClick={goToPrevArticle}
                        >
                          <span className="blogsStable-navLabel">Previous</span>
                          <strong>{prevArticle.title}</strong>
                        </button>
                      )}

                      {nextArticle && (
                        <button
                          type="button"
                          className="blogsStable-navBtn blogsStable-navBtnNext"
                          onClick={goToNextArticle}
                        >
                          <span className="blogsStable-navLabel">Next</span>
                          <strong>{nextArticle.title}</strong>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </article>
        </div>
      </div>
    </>
  );
}