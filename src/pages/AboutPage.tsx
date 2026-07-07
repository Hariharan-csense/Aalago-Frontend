import PageBanner from "../components/layout/PageBanner";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import SafeImage from "../components/ui/SafeImage";
import { getPageContent } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";

export default function AboutPage() {
  const { data: content, loading, error, refetch } = useAsync(() => getPageContent("about"), []);

  return (
    <>
      <PageBanner title="About Us" breadcrumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]} />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {content && (
        <>
          <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">{content.subtitle}</p>
              <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-4">{content.title}</h2>
              {content.paragraphs.map((p) => <p key={p} className="text-charcoal/70 leading-relaxed mb-4">{p}</p>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {content.galleryImages.map((src, i) => <SafeImage key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />)}
            </div>
          </section>
          <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-16 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-charcoal mb-3">Our Mission</h3>
              <p className="text-charcoal/70 leading-relaxed m-0">{content.mission}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-charcoal mb-3">Our Vision</h3>
              <p className="text-charcoal/70 leading-relaxed m-0">{content.vision}</p>
            </div>
          </section>
          <section className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {content.stats.map((s) => (
                <div key={s.label}>
                  <strong className="block text-3xl font-extrabold text-brand mb-1">{s.value}</strong>
                  <span className="text-sm text-charcoal/70 font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
