import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("../data/newsApi.json")
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find(
          (item) => item.slug === slug
        );
        setNews(selected);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <section className="nd-loading">
        <p>Loading story…</p>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="nd-loading">
        <p>Story not found.</p>
        <NavLink to="/news" className="nd-back">
          ← Back to News
        </NavLink>
      </section>
    );
  }

  return (
    <section className="nd-page">
      {/* HERO */}
      <header className="nd-hero">
        <span className="nd-category">{news.category}</span>
        <h1>{news.title}</h1>
        <p>{news.description}</p>
      </header>

      {/* IMAGE */}
      <div className="nd-image">
        <img src={news.image} alt={news.title} />
      </div>

      {/* CONTENT */}
      <article className="nd-content">
        {news.content.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      {/* FOOTER */}
      <div className="nd-footer">
        <NavLink to="/news" className="nd-back">
          ← Back to News
        </NavLink>
      </div>
    </section>
  );
};

export default NewsDetail;
