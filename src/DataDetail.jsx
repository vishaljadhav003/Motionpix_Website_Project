import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./DataDetail.css";


const DataDetail = () => {
  const { type } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(true);

  fetch("../data/dataApi.json")
    .then((res) => res.json())
    .then((data) => {
      const selected = data.find(
        (entry) =>
          entry.category
            .toLowerCase()
            .replace(/\s+/g, "") ===
          type.toLowerCase()
      );

      setItem(selected);
      setLoading(false);
    });
}, [type]);


  if (loading) {
    return (
      <section className="ddc-loading">
        <p>Loading content…</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="ddc-loading">
        <p>Content not found.</p>
        <NavLink to="/data" className="ddc-back-link">
          ← Back to Data Center
        </NavLink>
      </section>
    );
  }

  return (
    <section className="ddc-page">
      {/* HERO */}
      <header className="ddc-hero">
        <span className="ddc-category fw-bold">{item.category}</span>
        <h1 className="fw-bold">{item.title}</h1>
        <p className="ddc-description fw-bold">{item.description}</p>
      </header>

      {/* FEATURE IMAGE */}
      <div className="ddc-image-wrap">
        <img src={item.image} alt={item.title} />
      </div>

      {/* CONTENT */}
      <article className="ddc-content fw-bold">
        {item.content.split("\n").map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </article>

      {/* FOOTER NAV */}
      <div className="ddc-footer">
        <NavLink to="/data" className="ddc-back-link fw-bold">
          ← Back to Data Center
        </NavLink>
      </div>
    </section>
  );
};

export default DataDetail;
