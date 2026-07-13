import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { getDestinations } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";

export default function SearchBar() {
  const navigate = useNavigate();
  const [destinationId, setDestinationId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);
  const { data: destinations } = useAsync(getDestinations, []);

  const totalGuests = adults + children;
  const guestLabel = `${totalGuests} Guest${totalGuests === 1 ? "" : "s"}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (destinationId) params.set("destination", destinationId);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (totalGuests) params.set("guests", String(totalGuests));
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <div className="absolute left-0 right-0 -bottom-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 items-center">
        <label className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
          <LocationOnRoundedIcon className="text-brand shrink-0" fontSize="small" />
          <select
            value={destinationId}
            onChange={(event) => setDestinationId(event.target.value)}
            aria-label="Destination"
            className="w-full border-0 outline-0 text-sm bg-transparent cursor-pointer"
          >
            <option value="">All Destinations</option>
            {destinations?.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
          <CalendarMonthRoundedIcon className="text-brand shrink-0" fontSize="small" />
          <input
            type="date"
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);
              if (checkOut && event.target.value > checkOut) setCheckOut("");
            }}
            aria-label="Check-in"
            className="w-full border-0 outline-0 text-sm bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
          <CalendarMonthRoundedIcon className="text-brand shrink-0" fontSize="small" />
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(event) => setCheckOut(event.target.value)}
            aria-label="Check-out"
            className="w-full border-0 outline-0 text-sm bg-transparent"
          />
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setGuestOpen((open) => !open)}
            className="w-full flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-left cursor-pointer"
          >
          <PeopleRoundedIcon className="text-brand shrink-0" fontSize="small" />
            <span className="w-full text-sm text-charcoal/70">{guestLabel}</span>
          </button>
          {guestOpen && (
            <div className="absolute z-30 left-0 right-0 min-w-[240px] bottom-[calc(100%+0.5rem)] md:bottom-[calc(100%+0.75rem)] bg-white rounded-lg shadow-xl border border-gray-100 p-4">
              {[
                { label: "Adults", value: adults, setValue: setAdults, min: 1 },
                { label: "Children", value: children, setValue: setChildren, min: 0 },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4 py-2">
                  <span className="text-sm font-semibold text-charcoal whitespace-nowrap">{item.label}</span>
                  <div className="grid grid-cols-[32px_28px_32px] items-center gap-2">
                    <button
                      type="button"
                      onClick={() => item.setValue(Math.max(item.min, item.value - 1))}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-brand cursor-pointer hover:bg-brand hover:text-white transition-colors"
                      aria-label={`Decrease ${item.label}`}
                    >
                      <RemoveRoundedIcon fontSize="small" />
                    </button>
                    <span className="text-center text-sm font-bold text-charcoal tabular-nums">{item.value}</span>
                    <button
                      type="button"
                      onClick={() => item.setValue(item.value + 1)}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-brand cursor-pointer hover:bg-brand hover:text-white transition-colors"
                      aria-label={`Increase ${item.label}`}
                    >
                      <AddRoundedIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand text-white font-bold rounded-lg border-0 hover:bg-brand-dark whitespace-nowrap cursor-pointer">
          <SearchRoundedIcon fontSize="small" /> Search Properties
        </button>
      </form>
    </div>
  );
}
