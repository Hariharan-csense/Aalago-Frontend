import { type FormEvent, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  adminCreateMembershipPackage,
  adminDeleteMembershipPackage,
  adminGetMembershipPackages,
  adminUpdateMembershipPackage,
} from "../../api/endpoints";
import { ErrorState, LoadingState } from "../../components/ui/AsyncState";
import { useToast } from "../../components/ui/ToastProvider";
import type { MembershipBenefits, MembershipPackage } from "../../types/api";

const benefitFields: { key: keyof MembershipBenefits; label: string; placeholder: string }[] = [
  { key: "bookingDiscount", label: "Booking Discount", placeholder: "10% OFF (Up to Rs.500/year)" },
  { key: "rewardWallet", label: "Reward Wallet", placeholder: "Rs.250" },
  { key: "complimentaryBreakfast", label: "Complimentary Breakfast", placeholder: "1 Stay" },
  { key: "earlyCheckInLateCheckOut", label: "Early Check-in / Late Check-out", placeholder: "1 Time or leave blank" },
  { key: "priorityBooking", label: "Priority Booking", placeholder: "Yes / No" },
  { key: "memberOnlyDeals", label: "Member-Only Deals", placeholder: "Yes / No" },
  { key: "travelWelcomeKit", label: "Travel Welcome Kit", placeholder: "Yes / No / Premium Kit" },
  { key: "priorityCustomerSupport", label: "Priority Customer Support", placeholder: "Yes / No / Premium Support" },
];

const emptyBenefits: MembershipBenefits = {
  bookingDiscount: "",
  rewardWallet: "",
  complimentaryBreakfast: "",
  earlyCheckInLateCheckOut: "",
  priorityBooking: "No",
  memberOnlyDeals: "Yes",
  travelWelcomeKit: "No",
  priorityCustomerSupport: "No",
};

type MembershipForm = Omit<MembershipPackage, "id" | "features"> & {
  featuresText: string;
};

const emptyForm: MembershipForm = {
  name: "",
  price: 0,
  period: "Year",
  featuresText: "",
  benefits: emptyBenefits,
  popular: false,
  sortOrder: 0,
};

function buildFeatureList(benefits: MembershipBenefits) {
  return [
    benefits.bookingDiscount,
    benefits.rewardWallet ? `${benefits.rewardWallet} Reward Wallet` : "",
    benefits.complimentaryBreakfast ? `${benefits.complimentaryBreakfast} Complimentary Breakfast` : "",
    benefits.earlyCheckInLateCheckOut ? `${benefits.earlyCheckInLateCheckOut} Early Check-in / Late Check-out` : "",
    yesLike(benefits.priorityBooking) ? "Priority Booking" : "",
    yesLike(benefits.memberOnlyDeals) ? "Member-Only Deals" : "",
    benefits.travelWelcomeKit && benefits.travelWelcomeKit !== "No" ? `Travel Welcome Kit: ${benefits.travelWelcomeKit}` : "",
    benefits.priorityCustomerSupport && benefits.priorityCustomerSupport !== "No"
      ? `Priority Customer Support: ${benefits.priorityCustomerSupport}`
      : "",
  ].filter(Boolean);
}

function yesLike(value: string) {
  return ["yes", "true", "included"].includes(value.trim().toLowerCase());
}

function toPayload(form: MembershipForm): Omit<MembershipPackage, "id"> {
  const typedFeatures = form.featuresText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    name: form.name,
    price: Number(form.price),
    period: form.period,
    features: typedFeatures.length ? typedFeatures : buildFeatureList(form.benefits),
    benefits: form.benefits,
    popular: form.popular,
    sortOrder: Number(form.sortOrder),
  };
}

export default function AdminMembershipPage() {
  const { showToast, showConfirm } = useToast();
  const [items, setItems] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<MembershipForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminGetMembershipPackages());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, benefits: { ...emptyBenefits } });
    setShowForm(true);
  }

  function openEdit(item: MembershipPackage) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      period: item.period,
      featuresText: item.features.join("\n"),
      benefits: { ...emptyBenefits, ...item.benefits },
      popular: item.popular,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  }

  function updateBenefit(key: keyof MembershipBenefits, value: string) {
    setForm((current) => ({
      ...current,
      benefits: {
        ...current.benefits,
        [key]: value,
      },
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminUpdateMembershipPackage(editingId, toPayload(form));
        showToast("Membership package updated", "success");
      } else {
        await adminCreateMembershipPackage(toPayload(form));
        showToast("Membership package created", "success");
      }
      setShowForm(false);
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = await showConfirm({
      title: "Delete package?",
      message: "This membership package will be removed from the public page.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;
    try {
      await adminDeleteMembershipPackage(id);
      setItems((current) => current.filter((item) => item.id !== id));
      showToast("Membership package deleted", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Membership Packages</h2>
          <p className="m-0 text-sm text-charcoal/60">{items.length} package(s)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg border-0 bg-brand px-4 py-2 font-bold text-white"
        >
          <AddRoundedIcon fontSize="small" />
          Add Package
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-6 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Package Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg border border-gray-200 px-3 py-2 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Annual Fee
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="rounded-lg border border-gray-200 px-3 py-2 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Period
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required className="rounded-lg border border-gray-200 px-3 py-2 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Sort Order
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="rounded-lg border border-gray-200 px-3 py-2 font-normal" />
          </label>

          <div className="md:col-span-2">
            <h3 className="mb-3 mt-1 text-sm font-extrabold text-charcoal">Benefit Values</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {benefitFields.map((field) => (
                <label key={field.key} className="flex flex-col gap-1 text-sm font-semibold">
                  {field.label}
                  <input
                    value={form.benefits[field.key]}
                    onChange={(e) => updateBenefit(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-lg border border-gray-200 px-3 py-2 font-normal"
                  />
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="h-4 w-4 accent-brand" />
            Mark as Most Popular
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
            Card Features (optional, one per line)
            <textarea value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} rows={4} className="resize-y rounded-lg border border-gray-200 px-3 py-2 font-normal" />
          </label>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" disabled={saving} className="rounded-lg border-0 bg-brand px-4 py-2 font-bold text-white disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Package</th>
              <th className="px-4 py-3 font-semibold">Annual Fee</th>
              <th className="px-4 py-3 font-semibold">Booking Discount</th>
              <th className="px-4 py-3 font-semibold">Reward Wallet</th>
              <th className="px-4 py-3 font-semibold">Breakfast</th>
              <th className="px-4 py-3 font-semibold">Sort</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td className="px-4 py-3">Rs.{item.price.toLocaleString("en-IN")}/{item.period.toLowerCase()}</td>
                <td className="px-4 py-3">{item.benefits.bookingDiscount || "-"}</td>
                <td className="px-4 py-3">{item.benefits.rewardWallet || "-"}</td>
                <td className="px-4 py-3">{item.benefits.complimentaryBreakfast || "-"}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(item)} className="border-0 bg-transparent p-2 text-charcoal/60 hover:text-brand">
                    <EditRoundedIcon fontSize="small" />
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="border-0 bg-transparent p-2 text-charcoal/60 hover:text-brand">
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
