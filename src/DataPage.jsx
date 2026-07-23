import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./DataPage.css";

const PAGE_SIZE = 2;

const categories = [
  "All",
  "News",
  "Blogs",
  "TestCases",
  "White Papers"
];

const DataPage = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const revealRefs = useRef([]);

  // FETCH DATA
  useEffect(() => {
    fetch("../data/dataApi.json")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // FILTER DATA
  const filteredItems =
    activeTab === "All"
      ? items
      : items.filter(
          (item) =>
           item.category
  .toLowerCase()
  .replace(/\s+/g, "") ===
activeTab
  .toLowerCase()
  .replace(/\s+/g, "")

        );

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleItems = filteredItems.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // SCROLL REVEAL (NO GLITCH)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("dc-reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [visibleItems, activeTab]);

  return (
    <section className="dc-page">
      {/* HEADER */}
      <header className="dc-header">
        <h1>Data & <span>Insights Center</span></h1>
        <p className="fw-bold">
          News, blogs, case studies & white papers curated for innovation.
        </p>
      </header>

      {/* TABS */}
      <div className="dc-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`dc-tab ${
              activeTab === cat ? "dc-tab-active" : ""
            } fw-bold`}
            onClick={() => {
              setActiveTab(cat);
              setCurrentPage(1); // RESET PAGE ON TAB CHANGE
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="dc-grid">
        {visibleItems.map((item, index) => (
          <article
            key={item.id}
            ref={(el) => (revealRefs.current[index] = el)}
            className="dc-card dc-reveal"
          >
            <NavLink to={`/data/${item.category .toLowerCase() .replace(/\s+/g, "")}`} className="dc-card-link">

              <div className="dc-card-img">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="dc-card-body">
                <span className="dc-badge fw-bold">{item.category}</span>
                <h3 className="fw-bold">{item.title}</h3>
                <p>{item.description}</p>
                <span className="dc-read fw-bold">Read more →</span>
              </div>
            </NavLink>
          </article>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="dc-pagination fw-bold">
          <button className="fw-bold"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1 ? "active" : ""
              } onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button className="fw-bold"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default DataPage;
