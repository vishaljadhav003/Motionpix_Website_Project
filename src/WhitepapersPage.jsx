import React, { useMemo, useState, useEffect } from "react";
import "./WhitepapersPage.css";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ✅ pdf.js worker (required)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const WHITEPAPERS = [
  {
    id: "WP-001",
    title: "AI-Driven Visual Curation for Modern Brands",
    category: "AI & Media",
    abstract:
      "A practical whitepaper on building high-impact galleries using AI curation, motion cues, and responsive media pipelines.",
    tags: ["ai", "ux", "media"],
    date: "2026-03-01",
    readMins: 8,
    featured: true,
    pdfUrl: "/docs/ai-visual-curation.pdf",
  },
  {
    id: "WP-002",
    title: "Performance Patterns for Scroll-Synced Video",
    category: "Frontend",
    abstract:
      "Techniques to keep scroll-driven video smooth across mobile/desktop, including throttling, decoding, and canvas rendering.",
    tags: ["performance", "video", "canvas"],
    date: "2026-02-22",
    readMins: 10,
    featured: false,
    pdfUrl: "/docs/scroll-video-performance.pdf",
  },
  {
    id: "WP-003",
    title: "Design Systems: Building Consistent UI at Scale",
    category: "UI/UX",
    abstract:
      "How to standardize spacing, typography, components, and accessibility so pages stay consistent as your site grows.",
    tags: ["design", "system", "a11y"],
    date: "2026-02-12",
    readMins: 12,
    featured: false,
    pdfUrl: "/docs/design-systems.pdf",
  },
];

const SORT = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A–Z" },
];

export default function WhitepapersPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // ✅ Viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [docIndex, setDocIndex] = useState(0); // index in `filtered`
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(WHITEPAPERS.map((w) => w.category))).sort();
    return ["All", ...cats];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = WHITEPAPERS.filter((w) => {
      const matchesQuery =
        !q ||
        w.id.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.abstract.toLowerCase().includes(q) ||
        (w.tags || []).some((t) => t.toLowerCase().includes(q));

      const matchesCat = activeCat === "All" || w.category === activeCat;
      return matchesQuery && matchesCat;
    });

    list.sort((a, b) => {
      if (sortBy === "newest") return (b.date || "").localeCompare(a.date || "");
      if (sortBy === "oldest") return (a.date || "").localeCompare(b.date || "");
      if (sortBy === "az") return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [query, activeCat, sortBy]);

  const featured = useMemo(() => WHITEPAPERS.filter((w) => w.featured), []);

  const activeDoc = filtered[docIndex] || null;

  const openViewer = (paper) => {
    const idx = Math.max(0, filtered.findIndex((x) => x.id === paper.id));
    setDocIndex(idx === -1 ? 0 : idx);

    setNumPages(0);
    setPage(1);
    setPageInput("1");

    setIsViewerOpen(true);
    document.documentElement.classList.add("wpNoScroll");
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.documentElement.classList.remove("wpNoScroll");
  };

  const onDocLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setPage(1);
    setPageInput("1");
  };

  // ✅ keep input synced
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // ✅ doc pagination
  const canPrevDoc = docIndex > 0;
  const canNextDoc = docIndex < filtered.length - 1;

  const prevDoc = () => {
    if (!canPrevDoc) return;
    const nextIdx = docIndex - 1;
    setDocIndex(nextIdx);
    setNumPages(0);
    setPage(1);
    setPageInput("1");
  };

  const nextDoc = () => {
    if (!canNextDoc) return;
    const nextIdx = docIndex + 1;
    setDocIndex(nextIdx);
    setNumPages(0);
    setPage(1);
    setPageInput("1");
  };

  // ✅ page pagination
  const canPrevPage = page > 1;
  const canNextPage = numPages ? page < numPages : true;

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p + 1));

  const commitPageInput = () => {
    const raw = parseInt(pageInput, 10);
    if (!Number.isFinite(raw)) return;
    const next = numPages ? Math.max(1, Math.min(numPages, raw)) : Math.max(1, raw);
    setPage(next);
  };

  // ✅ keyboard shortcuts (premium feel)
  useEffect(() => {
    if (!isViewerOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeViewer();

      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();

      if (e.key === "ArrowUp") prevDoc();
      if (e.key === "ArrowDown") nextDoc();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isViewerOpen, numPages, page, docIndex, filtered.length]);

  return (
    <section className="wpPage">
      <header className="wpHeader">
        <div className="wpTitleWrap">
          <h1 className="wpTitle">Whitepapers</h1>
          <p className="wpSub">
            Select category to view only those papers. Open to read in a premium viewer with thumbnails + pagination.
          </p>
        </div>

        <div className="wpControls">
          <div className="wpSearch">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, category, tag..."
              aria-label="Search whitepapers"
            />
          </div>

          <div className="wpFilters">
            <div className="wpChips" role="tablist" aria-label="Categories">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`wpChip ${activeCat === c ? "isActive" : ""}`}
                  onClick={() => setActiveCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort whitepapers">
              {SORT.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {featured.length > 0 && (
        <section className="wpFeatured" aria-label="Featured whitepapers">
          <div className="wpSectionTitle">Featured</div>

          <div className="wpGrid wpGridFeatured">
            {featured.map((w) => (
              <article key={w.id} className="wpCard wpCardFeatured">
                <div className="wpMetaRow">
                  <span className="wpPill">{w.category}</span>
                  <span className="wpMeta">{w.readMins} min read</span>
                </div>

                <h3 className="wpCardTitle">{w.title}</h3>
                <p className="wpAbstract">{w.abstract}</p>

                <div className="wpTags">
                  {(w.tags || []).map((t) => (
                    <span key={t} className="wpTag">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="wpCardFooter">
                  <span className="wpMeta">Updated: {w.date}</span>

                  <div className="wpActions">
                    <button className="wpBtnGhost" type="button" onClick={() => openViewer(w)}>
                      Open
                    </button>
                    <a className="wpBtnPrimary" href={w.pdfUrl} download>
                      Download PDF
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="wpAll" aria-label="All whitepapers">
        <div className="wpSectionTitle">All Whitepapers</div>

        <div className="wpGrid">
          {filtered.map((w) => (
            <article key={w.id} className="wpCard">
              <div className="wpMetaRow">
                <span className="wpPill">{w.category}</span>
                <span className="wpMeta">{w.readMins} min read</span>
              </div>

              <h3 className="wpCardTitle">{w.title}</h3>
              <p className="wpAbstract">{w.abstract}</p>

              <div className="wpTags">
                {(w.tags || []).map((t) => (
                  <span key={t} className="wpTag">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="wpCardFooter">
                <span className="wpMeta">Updated: {w.date}</span>

                <div className="wpActions">
                  <button className="wpBtnGhost" type="button" onClick={() => openViewer(w)}>
                    Open
                  </button>
                  <a className="wpBtnPrimary" href={w.pdfUrl} download>
                    Download PDF
                  </a>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="wpEmpty">No whitepapers found. Try changing category or search.</div>
          )}
        </div>
      </section>

      {/* ✅ Premium PDF Viewer Modal */}
      {isViewerOpen && activeDoc && (
        <div className="wpModalOverlay" onMouseDown={closeViewer} role="presentation">
          <div
            className="wpModalPremium"
            role="dialog"
            aria-modal="true"
            aria-label="PDF viewer"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="wpViewerTopbar">
              <div className="wpViewerTitle">
                <div className="wpViewerTitleMain">{activeDoc.title}</div>
                <div className="wpViewerTitleSub">
                  {activeDoc.category} • {activeDoc.readMins} min read • Updated {activeDoc.date}
                </div>
              </div>

              <div className="wpViewerTopbarRight">
                {/* Doc pagination */}
                <div className="wpDocPager">
                  <button className="wpIconBtn" type="button" onClick={prevDoc} disabled={!canPrevDoc} aria-label="Previous document">
                    ←
                  </button>
                  <div className="wpDocPagerText">
                    {filtered.length ? `${docIndex + 1} / ${filtered.length}` : "—"}
                  </div>
                  <button className="wpIconBtn" type="button" onClick={nextDoc} disabled={!canNextDoc} aria-label="Next document">
                    →
                  </button>
                </div>

                <a className="wpBtnPrimary" href={activeDoc.pdfUrl} download>
                  Download
                </a>

                <button className="wpIconBtn" type="button" onClick={closeViewer} aria-label="Close">
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="wpViewerBody">
              {/* Thumbnails */}
              <aside className="wpThumbs" aria-label="PDF thumbnails">
                <div className="wpThumbsHeader">
                  <span>Pages</span>
                  <span className="wpMeta">{numPages ? `${numPages} total` : "Loading..."}</span>
                </div>

                <div className="wpThumbsList">
                  <Document file={activeDoc.pdfUrl} onLoadSuccess={onDocLoadSuccess} loading={<div className="wpMiniLoading">Loading…</div>}>
                    {Array.from({ length: numPages || 0 }).map((_, i) => {
                      const p = i + 1;
                      const isActive = p === page;
                      return (
                        <button
                          key={p}
                          type="button"
                          className={`wpThumbItem ${isActive ? "isActive" : ""}`}
                          onClick={() => setPage(p)}
                          aria-label={`Go to page ${p}`}
                        >
                          <div className="wpThumbNum">{p}</div>
                          <div className="wpThumbCanvas">
                            <Page
                              pageNumber={p}
                              width={140}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              loading={null}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </Document>
                </div>
              </aside>

              {/* Main PDF */}
              <main className="wpPdfMain" aria-label="PDF page view">
                {/* Page controls */}
                <div className="wpPageBar">
                  <div className="wpPageControls">
                    <button className="wpIconBtn" type="button" onClick={prevPage} disabled={!canPrevPage} aria-label="Previous page">
                      ‹
                    </button>

                    <div className="wpPageInputWrap">
                      <input
                        className="wpPageInput"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onBlur={commitPageInput}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitPageInput();
                        }}
                        inputMode="numeric"
                        aria-label="Page number"
                      />
                      <span className="wpMeta">/ {numPages || "—"}</span>
                    </div>

                    <button className="wpIconBtn" type="button" onClick={nextPage} disabled={!canNextPage} aria-label="Next page">
                      ›
                    </button>
                  </div>

                  {/* Premium progress */}
                  <div className="wpProgress">
                    <div
                      className="wpProgressFill"
                      style={{
                        width: numPages ? `${(page / numPages) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <div className="wpHints">
                    <span className="wpMeta">Keys:</span>
                    <span className="wpMeta">←/→ page</span>
                    <span className="wpMeta">↑/↓ document</span>
                    <span className="wpMeta">Esc close</span>
                  </div>
                </div>

                <div className="wpPdfStage">
                  <Document file={activeDoc.pdfUrl} onLoadSuccess={onDocLoadSuccess} loading={<div className="wpBigLoading">Loading PDF…</div>}>
                    <div className="wpPdfPage">
                      <Page pageNumber={page} renderTextLayer={false} />
                    </div>
                  </Document>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}