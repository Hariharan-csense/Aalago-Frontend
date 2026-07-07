import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SafeImage from "../ui/SafeImage";
import type { Destination } from "../../types/api";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 group">
      <SafeImage src={destination.image} alt={destination.name} className="w-full h-52 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
      <div className="p-5">
        <h3 className="text-xl font-extrabold text-charcoal m-0 mb-2">{destination.name}</h3>
        <p className="text-sm text-charcoal/60 leading-relaxed mb-4">{destination.description}</p>
        <Link to={`/properties?destination=${destination.id}`} className="inline-flex items-center gap-1 text-brand font-bold text-sm no-underline hover:gap-2 transition-all">
          View Properties <ArrowForwardRoundedIcon fontSize="small" />
        </Link>
      </div>
    </article>
  );
}
