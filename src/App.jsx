import { Routes, Route } from "react-router-dom";
import useLenis from "./hooks/useLenis";
import useScrollRefresh from "./hooks/useScrollRefresh";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Grain from "./components/ui/Grain";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TheArt from "./pages/TheArt";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";

export default function App() {
  useLenis();
  useScrollRefresh();

  return (
    <>
      <Grain />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/the-art" element={<TheArt />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
