import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import DestinationsPage from "../../pages/DestinationsPage";
import PropertiesPage from "../../pages/PropertiesPage";
import PropertyDetailPage from "../../pages/PropertyDetailPage";
import BlogPage from "../../pages/BlogPage";
import ContactPage from "../../pages/ContactPage";
import LegalPage from "../../pages/LegalPage";
import NotFoundPage from "../../pages/NotFoundPage";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
