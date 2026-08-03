import { Link } from "react-router-dom";
import type { HomeContent } from "../../types/api";
import SearchBar from "./SearchBar";

export default function HeroSection({ content }: { content: HomeContent }) {
  return (
    <section
      className="relative min-h-[520px] flex items-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(17,17,17,0.45), rgba(17,17,17,0.35)), url(${content.heroImage})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full py-16">
        {content.heroKicker && (
          <p className="text-white text-sm md:text-base font-extrabold uppercase tracking-widest mb-3">
            {content.heroKicker}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight max-w-2xl m-0">
          {content.heroTitle}{" "}
          {content.heroHighlight && (
            <span className="text-white">{content.heroHighlight}</span>
          )}
        </h1>
        <p className="text-white/100 text-lg max-w-xl mt-4 mb-8 leading-relaxed">
          {content.heroSubtitle}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/properties"
            className="px-6 py-3 bg-brand text-white font-bold rounded-full no-underline hover:bg-brand-dark"
          >
            Explore Properties
          </Link>
          <Link
            to="/destinations"
            className="px-6 py-3 border-2 border-white text-white font-bold rounded-full no-underline hover:bg-white hover:text-charcoal"
          >
            Discover Destinations
          </Link>
        </div>
      </div>
      <SearchBar />
    </section>
  );
}
