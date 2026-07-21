import { adminGetSubscribers } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";
import { ErrorState, LoadingState } from "../../components/ui/AsyncState";

export default function AdminSubscribersPage() {
  const { data, loading, error, refetch } = useAsync(adminGetSubscribers, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Subscribers</h2>
      <p className="text-charcoal/60 mb-6">
        Newsletter subscribers submitted from the public website.
      </p>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-charcoal">
              <tr>
                {["Date", "Email", "Source"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-extrabold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.length ? data.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 font-semibold">{item.email}</td>
                  <td className="px-4 py-3">{item.source}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-charcoal/50">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
