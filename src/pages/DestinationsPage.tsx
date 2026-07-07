import PageBanner from "../components/layout/PageBanner";
import DestinationCard from "../components/cards/DestinationCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { getDestinations } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";

export default function DestinationsPage() {
  const { data, loading, error, refetch } = useAsync(getDestinations, []);

  return (
    <>
      <PageBanner title="Destinations" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-3">Explore Destinations</h2>
          <p className="text-charcoal/70 m-0">Discover India&apos;s most revered temple towns and find curated stays near sacred sites.</p>
        </div>
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.map((d) => <DestinationCard key={d.id} destination={d} />)}
          </div>
        )}
      </section>
    </>
  );
}
