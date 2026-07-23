import { NavLink } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <section className="page-not-found">
      <div className="page-not-found-container">
        <img
          src="https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/error-500_f9bbb4.png"
          alt="Page Not Found"
          className="page-not-found-image"
        />

        <p className="page-not-found-text">
          Unfortunately, the page you are looking for has been moved, deleted,
          or is under construction.
        </p>

        <NavLink to="/" className="page-not-found-btn">
          Go to Homepage
        </NavLink>
      </div>
    </section>
  );
};

export default PageNotFound;