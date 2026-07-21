import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/cards/PropertyCard";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { getDestinations, getProperties } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";
import { amenityKey, normalizeAmenities } from "../utils/amenities";

const BUDGET_OPTIONS = [
  { value: "under-2000", label: "Under Rs.2,000" },
  { value: "2000-3000", label: "Rs.2,000 - Rs.3,000" },
  { value: "above-3000", label: "Above Rs.3,000" },
];

const DEFAULT_PROPERTY_TYPES = ["Homestay", "Hotel", "Inn"];
const DEFAULT_AMENITIES = ["WiFi", "Parking", "AC"];
const PROPERTIES_PER_PAGE = 4;

function getParamList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function getAmenityParamList(value: string | null) {
  return normalizeAmenities(getParamList(value));
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function PropertiesPage() {
  const [params, setParams] = useSearchParams();
  const queryParam = params.get("q") ?? "";
  const checkInParam = params.get("checkIn") ?? "";
  const checkOutParam = params.get("checkOut") ?? "";
  const guestsParam = params.get("guests") ?? "";

  const [destinationFilters, setDestinationFilters] = useState<string[]>(() => getParamList(params.get("destination")));
  const [typeFilters, setTypeFilters] = useState<string[]>(() => getParamList(params.get("type")));
  const [budgetFilters, setBudgetFilters] = useState<string[]>(() => getParamList(params.get("budget")));
  const [amenityFilters, setAmenityFilters] = useState<string[]>(() => getAmenityParamList(params.get("amenity")));
  const [currentPage, setCurrentPage] = useState(1);

  const { data: destinations } = useAsync(getDestinations, []);
  const { data, loading, error, refetch } = useAsync(() => getProperties(), []);

  const destinationById = useMemo(() => {
    return new Map(destinations?.map((destination) => [destination.id, destination]) ?? []);
  }, [destinations]);

  const propertyTypes = useMemo(() => {
    const types = new Set(DEFAULT_PROPERTY_TYPES);
    data?.forEach((property) => types.add(property.type));
    return Array.from(types).filter(Boolean);
  }, [data]);

  const amenities = useMemo(() => {
    return normalizeAmenities([
      ...DEFAULT_AMENITIES,
      ...(data?.flatMap((property) => property.amenities) ?? []),
    ]);
  }, [data]);

  const hasAppliedFilters = Boolean(
    destinationFilters.length
    || queryParam
    || typeFilters.length
    || budgetFilters.length
    || amenityFilters.length
    || checkInParam
    || checkOutParam
    || guestsParam,
  );

  useEffect(() => {
    setDestinationFilters(getParamList(params.get("destination")));
    setTypeFilters(getParamList(params.get("type")));
    setBudgetFilters(getParamList(params.get("budget")));
    setAmenityFilters(getAmenityParamList(params.get("amenity")));
  }, [params]);

  function updateFilters(next: {
    destinations?: string[];
    types?: string[];
    budgets?: string[];
    amenities?: string[];
  }) {
    const destination = next.destinations ?? destinationFilters;
    const type = next.types ?? typeFilters;
    const budget = next.budgets ?? budgetFilters;
    const amenity = next.amenities ?? amenityFilters;
    const nextParams = new URLSearchParams();

    if (destination.length) nextParams.set("destination", destination.join(","));
    if (queryParam) nextParams.set("q", queryParam);
    if (type.length) nextParams.set("type", type.join(","));
    if (budget.length) nextParams.set("budget", budget.join(","));
    if (amenity.length) nextParams.set("amenity", amenity.join(","));
    if (checkInParam) nextParams.set("checkIn", checkInParam);
    if (checkOutParam) nextParams.set("checkOut", checkOutParam);
    if (guestsParam) nextParams.set("guests", guestsParam);
    setParams(nextParams);
  }

  function clearFilters() {
    const nextParams = new URLSearchParams();
    if (queryParam) nextParams.set("q", queryParam);
    setParams(nextParams);
  }

  const filteredData = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = queryParam.trim().toLowerCase();

    return data.filter((property) => {
      if (destinationFilters.length && !destinationFilters.includes(property.destinationId)) {
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
      if (typeFilters.length && !typeFilters.includes(property.type)) {
        return false;
      }
      if (amenityFilters.length) {
        const propertyAmenityKeys = new Set(
          normalizeAmenities(property.amenities).map(amenityKey),
        );
        if (!amenityFilters.every((amenity) => propertyAmenityKeys.has(amenityKey(amenity)))) {
          return false;
        }
      }
      if (budgetFilters.length) {
        const matchesBudget = budgetFilters.some((budget) => {
          if (budget === "under-2000") return property.price < 2000;
          if (budget === "2000-3000") return property.price >= 2000 && property.price <= 3000;
          if (budget === "above-3000") return property.price > 3000;
          return true;
        });
        if (!matchesBudget) return false;
      }
      return true;
    });
  }, [data, queryParam, destinationById, destinationFilters, typeFilters, amenityFilters, budgetFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PROPERTIES_PER_PAGE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam, destinationFilters, typeFilters, budgetFilters, amenityFilters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PROPERTIES_PER_PAGE;
    return filteredData.slice(start, start + PROPERTIES_PER_PAGE);
  }, [filteredData, currentPage]);

  const searchDetails = [
    ...destinationFilters.map((id) => destinationById.get(id)?.name).filter(Boolean),
    queryParam,
    ...typeFilters,
    ...budgetFilters.map((budget) => BUDGET_OPTIONS.find((option) => option.value === budget)?.label).filter(Boolean),
    ...amenityFilters,
    checkInParam ? `Check-in ${checkInParam}` : "",
    checkOutParam ? `Check-out ${checkOutParam}` : "",
    guestsParam ? `${guestsParam} guests` : "",
  ].filter(Boolean);

  return (
    <>
      <section className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm text-charcoal">
            {filteredData.length} {filteredData.length === 1 ? "result" : "results"}
            {searchDetails.length ? <> for <strong className="text-brand">{searchDetails.join(" | ")}</strong></> : null}
          </p>
          <button type="button" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-charcoal">
            Sort by: Featured
          </button>
        </div>
      </section>
      <section className="w-full px-4 py-8">
        <div className="properties-results-layout">
          <aside className="properties-filter-sidebar">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="m-0 text-lg font-extrabold text-charcoal">Filters</h2>
              {hasAppliedFilters && (
                <button type="button" onClick={clearFilters} className="border-0 bg-transparent text-sm font-bold text-brand cursor-pointer">
                  Clear
                </button>
              )}
            </div>

            <FilterGroup title="Destination">
              {destinations?.map((destination) => (
                <CheckboxFilter
                  key={destination.id}
                  label={destination.name}
                  checked={destinationFilters.includes(destination.id)}
                  onChange={() => updateFilters({ destinations: toggleValue(destinationFilters, destination.id) })}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Property Type">
              {propertyTypes.map((type) => (
                <CheckboxFilter
                  key={type}
                  label={type}
                  checked={typeFilters.includes(type)}
                  onChange={() => updateFilters({ types: toggleValue(typeFilters, type) })}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Budget">
              {BUDGET_OPTIONS.map((option) => (
                <CheckboxFilter
                  key={option.value}
                  label={option.label}
                  checked={budgetFilters.includes(option.value)}
                  onChange={() => updateFilters({ budgets: toggleValue(budgetFilters, option.value) })}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Amenities" isLast>
              {amenities.map((amenity) => (
                <CheckboxFilter
                  key={amenity}
                  label={amenity}
                  checked={amenityFilters.includes(amenity)}
                  onChange={() => updateFilters({ amenities: toggleValue(amenityFilters, amenity) })}
                />
              ))}
            </FilterGroup>
          </aside>

          <main className="min-w-0">
            <div className="mb-5">
              <h2 className="m-0 text-2xl font-extrabold text-charcoal">Results</h2>
              <p className="m-0 mt-1 text-sm text-charcoal/60">Check each property page for stay details and booking options.</p>
            </div>
            {loading && <LoadingState />}
            {error && <ErrorState message={error} onRetry={refetch} />}
            {!loading && !error && (
              filteredData.length ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {paginatedData.map((p) => (
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
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-full border px-3 text-sm font-bold cursor-pointer ${
                      currentPage === page
                        ? "border-brand bg-brand text-white"
                        : "border-gray-200 bg-white text-charcoal hover:border-brand hover:text-brand"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, children, isLast = false }: { title: string; children: React.ReactNode; isLast?: boolean }) {
  return (
    <div className={isLast ? "pb-0" : "border-b border-gray-100 pb-5 mb-5"}>
      <h3 className="m-0 mb-3 text-sm font-extrabold text-charcoal">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function CheckboxFilter({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-charcoal/75 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand cursor-pointer"
      />
      <span>{label}</span>
    </label>
  );
}
