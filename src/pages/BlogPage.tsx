import PageBanner from "../components/layout/PageBanner";
import BlogCard from "../components/cards/BlogCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { getBlogPosts } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";

export default function BlogPage() {
  const { data, loading, error, refetch } = useAsync(getBlogPosts, []);

  return (
    <>
      <PageBanner title="Blog" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-3">Temple Town Guides &amp; Travel Reads</h2>
          <p className="text-charcoal/70 m-0">Expert-curated guides for spiritual journeys</p>
        </div>
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </>
  );
}
