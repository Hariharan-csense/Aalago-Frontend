import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getDestinations } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";

const BUDGET_OPTIONS = [
  { value: "", label: "Any Budget" },
  { value: "under-2000", label: "Under ₹2,000" },
  { value: "2000-3000", label: "₹2,000 - ₹3,000" },
  { value: "above-3000", label: "Above ₹3,000" },
];

const PROPERTY_TYPES = ["", "Homestay", "Hotel", "Inn"];
const AMENITIES = ["", "WiFi", "Parking", "AC"];

export default function SearchBar() {
  const navigate = useNavigate();
  const [destinationId, setDestinationId] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [amenityFilter, setAmenityFilter] = useState("");
  const { data: destinations } = useAsync(getDestinations, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (destinationId) params.set("destination", destinationId);
    if (typeFilter) params.set("type", typeFilter);
    if (budgetFilter) params.set("budget", budgetFilter);
    if (amenityFilter) params.set("amenity", amenityFilter);
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <div className="absolute left-0 right-0 -bottom-12 px-4">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        <label className="block">
          <select
            value={destinationId}
            onChange={(event) => setDestinationId(event.target.value)}
            aria-label="Destination"
            className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none cursor-pointer"
          >
            <option value="">All Destinations</option>
            {destinations?.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Property Type"
            className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none cursor-pointer"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type || "Property Type"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <select
            value={budgetFilter}
            onChange={(event) => setBudgetFilter(event.target.value)}
            aria-label="Budget"
            className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none cursor-pointer"
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <select
            value={amenityFilter}
            onChange={(event) => setAmenityFilter(event.target.value)}
            aria-label="Amenities"
            className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none cursor-pointer"
          >
            {AMENITIES.map((amenity) => (
              <option key={amenity} value={amenity}>
                {amenity || "Amenities"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 px-4 bg-brand text-white font-bold rounded-lg border-0 hover:bg-brand-dark whitespace-nowrap cursor-pointer">
          <SearchRoundedIcon fontSize="small" /> Search
        </button>
      </form>
    </div>
  );
}
