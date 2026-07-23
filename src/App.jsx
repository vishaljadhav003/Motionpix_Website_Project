import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import PageNotFound from "./PageNotFound";
import Contact from "./Contact";
import Footer from "./Footer";
import Career from "./Career";
import Gallery from "./Gallery";
import EarthPhoneIcon from "./EarthPhoneIcon";
import About from "./About";
import Animation2D from "./Animation2D";
import Animation3D from "./Animation3D";
import WebsiteDesign from "./WebsiteDesign";
import DigitalMarketing from "./DigitalMarketing";
import ARVR from "./ARVR";
import LiveShoots from "./LiveShoots";
import GraphicsIndustrial from "./GraphicsIndustrial";
import ProductBranding from "./ProductBranding";
import ELearning from "./ELearning";
import PrintMedia from "./PrimntMedia";
import MotionGraphics from "./MotionGraphics";
import SOPDigitization from "./SOPDigitization";
import ScrollToTop from "./ScrollToTop";
import ScrollTopButton from "./ScrollTopButton";
import Cursor from "./Cursor";
import ServicesPage from "./ServicesPage";
import DataPage from "./DataPage";
import DataDetail from "./DataDetail";
import Blog from "./Blog";
import SearchResults from "./SearchResults";
import Faq from "./Faq";
import News from "./News";
import CineTestimonials from "./CineTestimonials";
import WhitepapersPage from "./WhitePapersPage";
import TestCasesPage from "./TestCasesPage";
import Home from "./Home";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import Chatbot from "./Chatbot";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
   const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  if (showIntro) {
    return (
      <Loader
        videoSrc="/Loader 1.mp4"
        speedBoost={1.15}
        onDone={() => {
          window.scrollTo(0, 0);
          setShowIntro(false);
        }}
      />
    );
  }

  return (
     <HelmetProvider>
    <Router>
      <Navbar />
      <EarthPhoneIcon/>
      <SearchResults/>
       <ScrollToTop/>
      <ScrollTopButton />
      <Cursor/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>} />
        <Route path="/services" element={<ServicesPage/>} />


         <Route path="/services/2d-animation" element={<Animation2D />} />
        <Route path="/services/3d-animation" element={<Animation3D />} />
        <Route path="/services/web-design" element={<WebsiteDesign />} />
        <Route path="/services/digitalmarketing" element={<DigitalMarketing />} />
        <Route path="/services/liveshoots" element={<LiveShoots />} />
        <Route path="/services/graphicsdesign" element={<GraphicsIndustrial />} />
        <Route path="/services/product-branding" element={<ProductBranding />} />
        <Route path="/services/e-learning" element={<ELearning />} />
        <Route path="/services/print-media" element={<PrintMedia />} />
        <Route path="/services/ar-vr" element={<ARVR />} />
        <Route path="/services/sop" element={<SOPDigitization />} />
        <Route path="/services/motiongraphics" element={<MotionGraphics />} />
        <Route path="/gallery" element={<Gallery/>}/>
         <Route path="/data" element={<DataPage />} />
         <Route path="/data/news" element={<News />} />
         <Route path="/data/faq" element={<Faq />} />
        <Route path="/data/:type" element={<DataDetail />} />
         <Route path="/data/blogs" element={<Blog />} />
        <Route path="/data/testimonials" element={<CineTestimonials />} />
        <Route path="/data/whitepapers" element={<WhitepapersPage/>} />
        <Route path="/data/testcases" element={<TestCasesPage />} />
        <Route path="/careers" element={<Career/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Chatbot/>
      <Footer/>
    </Router>
    </HelmetProvider>
  );
};

export default App;