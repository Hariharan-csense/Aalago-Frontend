import { Link } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import NewsletterBanner from "../components/home/NewsletterBanner";
import PropertyCard from "../components/cards/PropertyCard";
import TestimonialCard from "../components/cards/TestimonialCard";
import BlogCard from "../components/cards/BlogCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import SafeImage from "../components/ui/SafeImage";
import { getBlogPosts, getDestinations, getPageContent, getProperties } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";

export default function HomePage() {
  const { data: content, loading, error, refetch } = useAsync(() => getPageContent("home"), []);
  const { data: destinations } = useAsync(getDestinations, []);
  const { data: properties } = useAsync(() => getProperties(), []);
  const { data: blogPosts } = useAsync(getBlogPosts, []);

  if (loading) return <LoadingState />;
  if (error || !content) return <ErrorState message={error ?? "Failed to load"} onRetry={refetch} />;

  return (
    <>
      <HeroSection content={content} />
      <div className="h-16" />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">About Aala Go</p>
          <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-4">{content.aboutTitle}</h2>
          {content.aboutText.map((p) => <p key={p} className="text-charcoal/70 leading-relaxed mb-4">{p}</p>)}
          <Link to="/about" className="inline-flex px-5 py-2.5 bg-brand text-white font-bold rounded-lg no-underline hover:bg-brand-dark">Learn More</Link>
        </div>
        <SafeImage src={content.aboutImage} alt="Pilgrims at temple" className="w-full h-[380px] object-cover rounded-xl shadow-lg" />
      </section>

      <WhyChooseUs items={content.whyChooseUs} />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand text-sm font-bold uppercase tracking-widest mb-1">Explore</p>
            <h2 className="text-3xl font-extrabold text-charcoal m-0">Featured Destinations</h2>
          </div>
          <Link to="/destinations" className="text-brand font-bold no-underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations?.slice(0, 6).map((d) => (
            <Link key={d.id} to="/destinations" className="text-center no-underline group">
              <SafeImage src={d.image} alt={d.name} className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:opacity-90 transition-opacity" />
              <span className="text-sm font-bold text-charcoal group-hover:text-brand">{d.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand text-sm font-bold uppercase tracking-widest mb-1">Stays</p>
              <h2 className="text-3xl font-extrabold text-charcoal m-0">Featured Properties</h2>
            </div>
            <Link to="/properties" className="text-brand font-bold no-underline text-sm">View All →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.filter((p) => p.popular).slice(0, 3).map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center text-charcoal mb-10">What Our Travelers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.testimonials.map((t) => <TestimonialCard key={t.name} testimonial={t} />)}
        </div>
      </section>

      <NewsletterBanner title={content.newsletterTitle} text={content.newsletterText} />

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-charcoal m-0">Latest From Blog</h2>
          <Link to="/blog" className="text-brand font-bold no-underline text-sm">View All →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts?.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </section>
    </>
  );
}
