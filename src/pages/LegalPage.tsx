import PageBanner from "../components/layout/PageBanner";

export default function LegalPage() {
  return (
    <>
      <PageBanner title="Legal" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Legal" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid md:grid-cols-2 gap-8">
        <article className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">Privacy Policy</p>
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-4">Your travel details stay protected</h2>
          <p className="text-charcoal/70 leading-relaxed m-0">aalaGo collects only the details needed to help travellers discover temple-town stays and support property-owner partnerships.</p>
        </article>
        <article className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">Terms</p>
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-4">Use aalaGo with clear expectations</h2>
          <p className="text-charcoal/70 leading-relaxed m-0">Stay availability, prices, and amenities may vary by property. Confirm final booking details before travel.</p>
        </article>
      </section>
    </>
  );
}
