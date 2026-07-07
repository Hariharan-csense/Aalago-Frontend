import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PageBanner from "../components/layout/PageBanner";
import PropertyCard from "../components/cards/PropertyCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { getDestinations, getProperties } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";

const BUDGET_OPTIONS = [
  { value: "", label: "Any Budget" },
  { value: "under-2000", label: "Under ₹2,000" },
  { value: "2000-3000", label: "₹2,000 - ₹3,000" },
  { value: "above-3000", label: "Above ₹3,000" },
];

const PROPERTY_TYPES = ["", "Homestay", "Hotel", "Inn"];
const AMENITIES = ["", "WiFi", "Parking", "AC"];

export default function PropertiesPage() {
  const [params, setParams] = useSearchParams();
  const destinationParam = params.get("destination") ?? "";
  const queryParam = params.get("q") ?? "";
  const typeParam = params.get("type") ?? "";
  const budgetParam = params.get("budget") ?? "";
  const amenityParam = params.get("amenity") ?? "";
  const checkInParam = params.get("checkIn") ?? "";
  const checkOutParam = params.get("checkOut") ?? "";
  const guestsParam = params.get("guests") ?? "";
  const [destinationId, setDestinationId] = useState(destinationParam);
  const [typeFilter, setTypeFilter] = useState(typeParam);
  const [budgetFilter, setBudgetFilter] = useState(budgetParam);
  const [amenityFilter, setAmenityFilter] = useState(amenityParam);
  const { data: destinations } = useAsync(getDestinations, []);
  const { data, loading, error, refetch } = useAsync(() => getProperties(), []);
  const currentFilters = useMemo(() => ({
    destination: destinationId,
    query: queryParam,
    type: typeFilter,
    budget: budgetFilter,
    amenity: amenityFilter,
    checkIn: checkInParam,
    checkOut: checkOutParam,
    guests: guestsParam,
  }), [destinationId, queryParam, typeFilter, budgetFilter, amenityFilter, checkInParam, checkOutParam, guestsParam]);
  const active = destinations?.find((d) => d.id === currentFilters.destination);
  const destinationById = useMemo(() => {
    return new Map(destinations?.map((destination) => [destination.id, destination]) ?? []);
  }, [destinations]);

  const propertyTypes = useMemo(() => {
    const types = new Set(PROPERTY_TYPES);
    data?.forEach((property) => types.add(property.type));
    return Array.from(types);
  }, [data]);

  const amenities = useMemo(() => {
    const values = new Set(AMENITIES);
    data?.forEach((property) => property.amenities.forEach((amenity) => values.add(amenity)));
    return Array.from(values);
  }, [data]);

  useEffect(() => {
    setDestinationId(destinationParam);
    setTypeFilter(typeParam);
    setBudgetFilter(budgetParam);
    setAmenityFilter(amenityParam);
  }, [destinationParam, queryParam, typeParam, budgetParam, amenityParam, checkInParam, checkOutParam, guestsParam]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = currentFilters.query.trim().toLowerCase();
    return data.filter((property) => {
      if (currentFilters.destination && property.destinationId !== currentFilters.destination) {
        return false;
      }
      if (normalizedQuery) {
        const destination = destinationById.get(property.destinationId);
        const searchable = [
          property.name,
          property.location,
          property.type,
          destination?.name,
          destination?.state,
          ...property.amenities,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!searchable.includes(normalizedQuery)) return false;
      }
      if (currentFilters.type && property.type !== currentFilters.type) {
        return false;
      }
      if (currentFilters.amenity && !property.amenities.includes(currentFilters.amenity)) {
        return false;
      }
      if (currentFilters.budget) {
        if (currentFilters.budget === "under-2000" && property.price >= 2000) return false;
        if (currentFilters.budget === "2000-3000" && (property.price < 2000 || property.price > 3000)) return false;
        if (currentFilters.budget === "above-3000" && property.price <= 3000) return false;
      }
      return true;
    });
  }, [data, currentFilters, destinationById]);

  const hasAppliedFilters = Boolean(
    currentFilters.destination
    || currentFilters.query
    || currentFilters.type
    || currentFilters.budget
    || currentFilters.amenity
    || currentFilters.checkIn
    || currentFilters.checkOut
    || currentFilters.guests,
  );

  const searchDetails = [
    active?.name,
    currentFilters.query,
    currentFilters.type,
    currentFilters.budget ? BUDGET_OPTIONS.find((option) => option.value === currentFilters.budget)?.label : "",
    currentFilters.amenity,
    currentFilters.checkIn ? `Check-in ${currentFilters.checkIn}` : "",
    currentFilters.checkOut ? `Check-out ${currentFilters.checkOut}` : "",
    currentFilters.guests ? `${currentFilters.guests} guests` : "",
  ].filter(Boolean);

  function handleSearch() {
    const nextParams = new URLSearchParams();
    if (destinationId) nextParams.set("destination", destinationId);
    if (queryParam) nextParams.set("q", queryParam);
    if (typeFilter) nextParams.set("type", typeFilter);
    if (budgetFilter) nextParams.set("budget", budgetFilter);
    if (amenityFilter) nextParams.set("amenity", amenityFilter);
    if (checkInParam) nextParams.set("checkIn", checkInParam);
    if (checkOutParam) nextParams.set("checkOut", checkOutParam);
    if (guestsParam) nextParams.set("guests", guestsParam);
    setParams(nextParams);
  }

  return (
    <>
      <PageBanner title="Properties" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Properties" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="bg-gray-100 rounded-xl p-4 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none"
          >
            <option value="">All Destinations</option>
            {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type || "Property Type"}</option>
            ))}
          </select>
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none"
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={amenityFilter}
            onChange={(e) => setAmenityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none"
          >
            {amenities.map((amenity) => (
              <option key={amenity} value={amenity}>{amenity || "Amenities"}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer"
          >
            <SearchRoundedIcon fontSize="small" /> Search
          </button>
        </div>
        {hasAppliedFilters && (
          <p className="text-charcoal/70 mb-6">
            Showing {filteredData.length} {filteredData.length === 1 ? "property" : "properties"}
            {searchDetails.length ? <> for <strong>{searchDetails.join(" | ")}</strong></> : null}
          </p>
        )}
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && (
          filteredData.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl py-16 px-4 text-center">
              <p className="text-xl font-extrabold text-charcoal mb-2">No properties found</p>
              <p className="text-sm text-charcoal/60 m-0">Try another destination, budget, property type, or amenity.</p>
            </div>
          )
        )}
        <div className="flex justify-center gap-2 mt-12">
          {[1, 2, 3].map((n) => <button key={n} type="button" className={`w-9 h-9 rounded-full border-0 cursor-pointer font-bold text-sm ${n === 1 ? "bg-brand text-white" : "bg-white text-charcoal border border-gray-200"}`}>{n}</button>)}
        </div>
      </section>
    </>
  );
}
