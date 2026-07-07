import { Link } from "react-router-dom";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import SafeImage from "../ui/SafeImage";
import type { Property } from "../../types/api";

const amenityIcons: Record<string, typeof WifiRoundedIcon> = { WiFi: WifiRoundedIcon, Parking: LocalParkingRoundedIcon, AC: AcUnitRoundedIcon };

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative">
        <SafeImage src={property.image} alt={property.name} className="w-full h-48 object-cover" />
        {property.popular && <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded">Popular</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
          <StarRoundedIcon fontSize="inherit" />
          <span className="font-bold text-charcoal">{property.rating}</span>
          <span className="text-charcoal/50">({property.reviews})</span>
        </div>
        <span className="text-xs font-semibold text-brand uppercase">{property.type}</span>
        <h3 className="text-lg font-bold text-charcoal mt-1 mb-1">{property.name}</h3>
        <p className="text-sm text-charcoal/60 mb-3">{property.location}</p>
        <div className="flex gap-3 mb-4">
          {property.amenities.map((a) => {
            const Icon = amenityIcons[a];
            return Icon ? <span key={a} className="flex items-center gap-1 text-xs text-charcoal/50"><Icon fontSize="inherit" className="text-brand" />{a}</span> : null;
          })}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="m-0"><span className="text-brand font-extrabold text-lg">₹{property.price.toLocaleString("en-IN")}</span><span className="text-charcoal/50 text-sm"> /night</span></p>
          <Link to={`/properties/${property.id}`} className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg no-underline hover:bg-brand-dark">View Details</Link>
        </div>
      </div>
    </article>
  );
}
