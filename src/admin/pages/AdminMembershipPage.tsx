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
import type { MembershipPackage } from "../../types/api";

type MembershipForm = Omit<MembershipPackage, "id" | "features"> & {
  featuresText: string;
};

const emptyForm: MembershipForm = {
  name: "",
  price: 0,
  period: "Year",
  featuresText: "",
  popular: false,
  sortOrder: 0,
};

function toPayload(form: MembershipForm): Omit<MembershipPackage, "id"> {
  return {
    name: form.name,
    price: Number(form.price),
    period: form.period,
    features: form.featuresText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
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
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: MembershipPackage) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      period: item.period,
      featuresText: item.features.join("\n"),
      popular: item.popular,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Membership Packages</h2>
          <p className="text-charcoal/60 text-sm m-0">{items.length} package(s)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer"
        >
          <AddRoundedIcon fontSize="small" />
          Add Package
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Package Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-3 py-2 rounded-lg border border-gray-200 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Price
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="px-3 py-2 rounded-lg border border-gray-200 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Period
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required className="px-3 py-2 rounded-lg border border-gray-200 font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Sort Order
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-gray-200 font-normal" />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="h-4 w-4 accent-brand" />
            Mark as Most Popular
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
            Features (one per line)
            <textarea value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} required rows={5} className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y" />
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Package</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Period</th>
              <th className="px-4 py-3 font-semibold">Popular</th>
              <th className="px-4 py-3 font-semibold">Sort</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td className="px-4 py-3">₹{item.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3">{item.popular ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(item)} className="p-2 border-0 bg-transparent cursor-pointer text-charcoal/60 hover:text-brand">
                    <EditRoundedIcon fontSize="small" />
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="p-2 border-0 bg-transparent cursor-pointer text-charcoal/60 hover:text-brand">
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
