import { Link } from "react-router-dom";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import TempleHinduOutlinedIcon from "@mui/icons-material/TempleHinduOutlined";
import VillaOutlinedIcon from "@mui/icons-material/VillaOutlined";
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

const stayTypeIcons = [
  HotelOutlinedIcon,
  HomeWorkOutlinedIcon,
  VillaOutlinedIcon,
  HomeWorkOutlinedIcon,
  ApartmentOutlinedIcon,
  HotelOutlinedIcon,
  TempleHinduOutlinedIcon,
  VillaOutlinedIcon,
];

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

      {content.stayTypes?.length ? (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-3xl font-extrabold text-charcoal m-0">Explore by Stay Type</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.stayTypes.map((type, index) => {
              const Icon = stayTypeIcons[index % stayTypeIcons.length];
              return (
                <Link
                  key={type}
                  to="/properties"
                  className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-gray-100 bg-white p-5 text-center no-underline shadow-sm transition hover:border-brand/30 hover:shadow-md"
                >
                  <Icon className="text-brand" fontSize="large" />
                  <span className="text-sm font-extrabold text-charcoal">{type}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {content.popularDestinations?.length ? (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-10">
              <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">Destinations</p>
              <h2 className="text-3xl font-extrabold text-charcoal m-0">Popular Destinations</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {content.popularDestinations.map((destination) => (
                <Link
                  key={destination}
                  to="/destinations"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-charcoal no-underline hover:border-brand hover:text-brand"
                >
                  {destination}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.templeTourism ? (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">{content.templeTourism.title}</p>
              <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-4">{content.templeTourism.subtitle}</h2>
              <p className="text-charcoal/70 leading-relaxed mb-6">{content.templeTourism.copy}</p>
              <p className="m-0 inline-flex rounded-lg bg-brand/10 px-4 py-2 text-sm font-extrabold text-brand">
                {content.templeTourism.tagline}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.templeTourism.temples.map((temple) => (
                <div key={temple} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                  <CheckCircleRoundedIcon className="text-brand" fontSize="small" />
                  <span className="text-sm font-bold text-charcoal">{temple}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
