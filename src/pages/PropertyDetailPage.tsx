import { Link, useParams } from "react-router-dom";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import PageBanner from "../components/layout/PageBanner";
import PropertyCard from "../components/cards/PropertyCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import SafeImage from "../components/ui/SafeImage";
import { getProperties, getProperty } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";
import { amenityKey, normalizeAmenities } from "../utils/amenities";

const amenityIcons: Record<string, typeof WifiRoundedIcon> = {
  ac: AcUnitRoundedIcon,
  parking: LocalParkingRoundedIcon,
  wifi: WifiRoundedIcon,
};
const defaultBookingUrl = "https://aalastays.com";
const allowedBookingHosts = new Set(["aalastays.com", "www.aalastays.com", "book.aalabnb.com"]);

function safeBookingUrl(value?: string) {
  if (!value) return defaultBookingUrl;
  try {
    const url = new URL(value);
    return allowedBookingHosts.has(url.hostname.toLowerCase()) ? url.toString() : defaultBookingUrl;
  } catch {
    return defaultBookingUrl;
  }
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { data: property, loading, error, refetch } = useAsync(() => getProperty(id!), [id]);
  const { data: allProps } = useAsync(() => getProperties(property?.destinationId), [property?.destinationId]);
  const similar = allProps?.filter((p) => p.id !== property?.id).slice(0, 3) ?? [];
  const bookingUrl = safeBookingUrl(property?.bookingUrl);

  if (loading) return <LoadingState />;
  if (error || !property) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <ErrorState message={error ?? "Property not found"} onRetry={refetch} />
      <Link to="/properties" className="text-brand font-bold mt-4 inline-block">Back to Properties</Link>
    </div>
  );

  const amenities = normalizeAmenities(property.amenities);

  return (
    <>
      <PageBanner title={property.name} breadcrumbs={[{ label: "Home", to: "/" }, { label: "Properties", to: "/properties" }, { label: property.name }]} image={property.image} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {property.images.map((img, i) => (
                <SafeImage key={i} src={img} alt="" className={`w-full object-cover rounded-xl ${i === 0 ? "sm:col-span-3 h-72" : "h-36"}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-brand uppercase">{property.type}</span>
            <h1 className="text-3xl font-extrabold text-charcoal mt-2 mb-2">{property.name}</h1>
            <p className="flex items-center gap-1 text-charcoal/60 mb-4"><LocationOnRoundedIcon fontSize="small" className="text-brand" />{property.location}</p>
            <div className="flex items-center gap-1 text-amber-500 mb-6"><StarRoundedIcon /><span className="font-bold text-charcoal">{property.rating}</span><span className="text-charcoal/50 text-sm">({property.reviews} reviews)</span></div>
            <h2 className="text-xl font-bold mb-3">About This Property</h2>
            <p className="text-charcoal/70 leading-relaxed mb-8">{property.description}</p>
            <h2 className="text-xl font-bold mb-3">Highlights</h2>
            <ul className="grid sm:grid-cols-2 gap-3 p-0 m-0 list-none mb-8">
              {property.highlights.map((h) => <li key={h} className="flex items-center gap-2 text-sm text-charcoal/70"><CheckCircleRoundedIcon fontSize="small" className="text-brand" />{h}</li>)}
            </ul>
            <div className="flex flex-wrap gap-4">
              {amenities.map((a) => {
                const Icon = amenityIcons[amenityKey(a)] ?? CheckCircleRoundedIcon;
                return (
                  <span key={amenityKey(a)} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm">
                    <Icon fontSize="small" className="text-brand" />
                    {a}
                  </span>
                );
              })}
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <p className="m-0 mb-4"><span className="text-3xl font-extrabold text-brand">₹{property.price.toLocaleString("en-IN")}</span><span className="text-charcoal/50 text-sm"> /night</span></p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer mb-3 text-center no-underline"
              >
                Check Availability & Book
              </a>
              <p className="m-0 mb-4 text-xs leading-relaxed text-charcoal/50 text-center">
                Availability, room selection, and booking are handled on our booking partner site.
              </p>
              <Link to="/contact" className="block w-full py-3 text-center border-2 border-brand text-brand font-bold rounded-lg no-underline">Send Enquiry</Link>
            </div>
          </aside>
        </div>
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold mb-6">Similar Properties</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{similar.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
          </div>
        )}
      </section>
    </>
  );
}
