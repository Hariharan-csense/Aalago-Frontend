import { adminGetPartnerEnquiries } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";
import { ErrorState, LoadingState } from "../../components/ui/AsyncState";

export default function AdminEnquiriesPage() {
  const { data, loading, error, refetch } = useAsync(adminGetPartnerEnquiries, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Enquiries</h2>
      <p className="text-charcoal/60 mb-6">
        Partner registration enquiries submitted from the public website.
      </p>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-charcoal">
              <tr>
                {["Date", "Name", "Phone", "Email", "City", "Hotel", "Pin Code", "Age", "Rooms"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-extrabold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.length ? data.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 font-semibold">{item.name}</td>
                  <td className="px-4 py-3">{item.phoneNumber}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3">{item.hotelName}</td>
                  <td className="px-4 py-3">{item.locationPinCode}</td>
                  <td className="px-4 py-3">{item.propertyAge}</td>
                  <td className="px-4 py-3">{item.numberOfRooms}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-charcoal/50">
                    No enquiries yet.
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
