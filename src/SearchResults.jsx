import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const data = [
  { title: "Home", path: "/" },
  { title: "About Us", path: "/about" },
  { title: "Services", path: "/services" },
  { title: "2D Animation", path: "/services/2d-animation" },
  { title: "3D Animation", path: "/services/3d-animation" },
  { title: "AR-VR", path: "/services/ar-vr" },
  { title: "Digital Marketing", path: "/services/digitalmarketing" },
  { title: "Web Design", path: "/services/web-design" },
  { title: "Website Design", path: "/services/web-design" },
  { title: "Live Shoots", path: "/services/liveshoots" },
  { title: "Data", path: "/data" },
  { title: "Gallery", path: "/gallery" },
  { title: "Careers", path: "/careers" },
  { title: "Contact Us - Enquiry", path: "/contact" },
  { title: "Blogs", path: "/data/blogs" },
  { title: "Testimonials", path: "/data/testimonials" },
  { title: "Faq", path: "/data/faq" },
  { title: "News", path: "/data/news" },
  {title:'Graphics Design', path:"/services/graphicsdesign"},
  {title:'Products Branding', path:"/services/product-branding"},
  {title:'E Learning', path:"/services/e-learning"},
  {title:'ELearning', path:"/services/e-learning"},
  {title:'Print Media', path:"/services/print-media"},
  {title:'Motion Graphics', path:"/services/motiongraphics"},
  {title:'SOP', path:"/services/sop"},
  {title:'TestCases', path:"/data/testcases"},
  {title:'WhitePapers', path:"/data/whitepapers"},
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  const results = query
    ? data.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (query.length >= 3 && results.length === 1) {
      navigate(results[0].path, { replace: true });
    }
  }, [results, query, navigate]);

  if (!query) return null;

  return (
    <div className="container py-4">
      <h4 className="mb-3">
        Search results for: <strong>{query}</strong>
      </h4>

      {results.length === 0 && (
        <div className="alert alert-danger">No results found</div>
      )}

      <div className="list-group">
        {results.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className="list-group-item list-group-item-action"
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
