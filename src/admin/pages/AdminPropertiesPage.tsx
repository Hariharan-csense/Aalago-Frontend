import { type FormEvent, useEffect, useRef, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  adminCreateProperty,
  adminDeleteProperty,
  adminGetDestinations,
  adminGetProperties,
  adminUpdateProperty,
  adminUploadImage,
} from "../../api/endpoints";
import { LoadingState, ErrorState } from "../../components/ui/AsyncState";
import SafeImage from "../../components/ui/SafeImage";
import { useToast } from "../../components/ui/ToastProvider";
import type { Destination, Property } from "../../types/api";

const emptyForm: Property = {
  id: "",
  name: "",
  location: "",
  destinationId: "",
  type: "Homestay",
  price: 0,
  rating: 4.5,
  reviews: 0,
  popular: false,
  amenities: [],
  image: "",
  images: [],
  description: "",
  highlights: [],
  bookingUrl: "",
};

function toList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function fromList(list: string[]) {
  return list.join(", ");
}

export default function AdminPropertiesPage() {
  const { showToast, showConfirm } = useToast();
  const [items, setItems] = useState<Property[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Property>(emptyForm);
  const [mainImage, setMainImage] = useState("");
  const [amenitiesText, setAmenitiesText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [galleryText, setGalleryText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadPromiseRef = useRef<Promise<void> | null>(null);

  function patchForm(patch: Partial<Property>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function reloadItems() {
    try {
      const [props, dests] = await Promise.all([
        adminGetProperties(),
        adminGetDestinations(),
      ]);
      setItems(props);
      setDestinations(dests);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to refresh list", "error");
    }
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [props, dests] = await Promise.all([
        adminGetProperties(),
        adminGetDestinations(),
      ]);
      setItems(props);
      setDestinations(dests);
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
    setForm({ ...emptyForm, destinationId: destinations[0]?.id ?? "" });
    setMainImage("");
    setAmenitiesText("");
    setHighlightsText("");
    setGalleryText("");
    setShowForm(true);
  }

  function openEdit(item: Property) {
    setEditingId(item.id);
    setForm({ ...item, bookingUrl: item.bookingUrl ?? "" });
    setMainImage(item.image);
    setAmenitiesText(fromList(item.amenities));
    setHighlightsText(fromList(item.highlights));
    setGalleryText(fromList(item.images));
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    if (uploadPromiseRef.current) {
      try {
        await uploadPromiseRef.current;
      } catch {
        return;
      }
    }

    const galleryImages = toList(galleryText);
    const image = mainImage.trim() || galleryImages[0] || "";
    if (!image) {
      showToast("Please upload or paste a main image URL.", "error");
      return;
    }

    setSaving(true);
    const payload: Property = {
      ...form,
      image,
      amenities: toList(amenitiesText),
      highlights: toList(highlightsText),
      images: galleryImages.length ? galleryImages : [image],
      price: Number(form.price),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
    };

    try {
      if (editingId) {
        await adminUpdateProperty(editingId, payload);
        showToast("Property updated", "success");
      } else {
        await adminCreateProperty(payload);
        showToast("Property created", "success");
      }
      setShowForm(false);
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await showConfirm({
      title: "Delete property?",
      message: "This property will be permanently removed.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;
    try {
      await adminDeleteProperty(id);
      setItems((current) => current.filter((item) => item.id !== id));
      showToast("Property deleted", "success");
      await reloadItems();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  async function uploadMainImage(file: File | undefined) {
    if (!file) return;
    const task = (async () => {
      setUploading(true);
      try {
        const uploaded = await adminUploadImage(file);
        if (!uploaded.url) throw new Error("Upload returned no image URL");
        setMainImage(uploaded.url);
        patchForm({ image: uploaded.url });
        setGalleryText((current) => current || uploaded.url);
        showToast("Image uploaded", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Upload failed",
          "error",
        );
        throw err;
      } finally {
        setUploading(false);
      }
    })();
    uploadPromiseRef.current = task;
    await task;
    uploadPromiseRef.current = null;
  }

  async function uploadGalleryImages(files: FileList | null) {
    if (!files?.length) return;
    const task = (async () => {
      setUploading(true);
      try {
        const uploaded = await Promise.all(
          Array.from(files).map((file) => adminUploadImage(file)),
        );
        const urls = uploaded.map((item) => item.url).filter(Boolean);
        if (!urls.length) throw new Error("Upload returned no image URLs");
        setGalleryText((current) => fromList([...toList(current), ...urls]));
        setMainImage((current) => current || urls[0]);
        setForm((current) => ({ ...current, image: current.image || urls[0] }));
        showToast("Gallery images uploaded", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Upload failed",
          "error",
        );
        throw err;
      } finally {
        setUploading(false);
      }
    })();
    uploadPromiseRef.current = task;
    await task;
    uploadPromiseRef.current = null;
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Properties</h2>
          <p className="text-charcoal/60 text-sm m-0">
            {items.length} property(ies)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer"
        >
          <AddRoundedIcon fontSize="small" />
          Add Property
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="flex flex-col gap-1 text-sm font-semibold">
            ID (slug)
            <input
              value={form.id}
              onChange={(e) => patchForm({ id: e.target.value })}
              required
              disabled={Boolean(editingId)}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Name
            <input
              value={form.name}
              onChange={(e) => patchForm({ name: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Destination
            <select
              value={form.destinationId}
              onChange={(e) => patchForm({ destinationId: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Location
            <input
              value={form.location}
              onChange={(e) => patchForm({ location: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Type
            <input
              value={form.type}
              onChange={(e) => patchForm({ type: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            AalaStays Booking Link
            <input
              type="url"
              value={form.bookingUrl ?? ""}
              onChange={(e) => patchForm({ bookingUrl: e.target.value })}
              placeholder="https://book.aalabnb.com/?hotel_id=30521"
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Price (₹)
            <input
              type="number"
              value={form.price}
              onChange={(e) => patchForm({ price: Number(e.target.value) })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Main Image URL
            <input
              value={mainImage}
              onChange={(e) => {
                setMainImage(e.target.value);
                patchForm({ image: e.target.value });
              }}
              placeholder="Upload below or paste image URL"
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                void uploadMainImage(e.target.files?.[0]);
                e.target.value = "";
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
            />
            {mainImage && (
              <SafeImage
                src={mainImage}
                alt=""
                className="w-full h-32 object-cover rounded-lg border border-gray-100"
              />
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Gallery Images (comma separated URLs)
            <input
              value={galleryText}
              onChange={(e) => setGalleryText(e.target.value)}
              placeholder="Upload below or paste URLs separated by commas"
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                void uploadGalleryImages(e.target.files);
                e.target.value = "";
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
            />
            {toList(galleryText).length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {toList(galleryText)
                  .slice(0, 6)
                  .map((src) => (
                    <SafeImage
                      key={src}
                      src={src}
                      alt=""
                      className="w-full h-20 object-cover rounded-lg border border-gray-100"
                    />
                  ))}
              </div>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
            Description
            <textarea
              value={form.description}
              onChange={(e) => patchForm({ description: e.target.value })}
              required
              rows={3}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Amenities (comma separated)
            <input
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Highlights (comma separated)
            <input
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => patchForm({ popular: e.target.checked })}
            />
            Featured / Popular
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer disabled:opacity-60"
            >
              {uploading
                ? "Uploading..."
                : saving
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Create"}
            </button>
            {uploading && (
              <span className="self-center text-sm text-charcoal/60">
                Uploading image...
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Destination</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td className="px-4 py-3">
                  {destinations.find((d) => d.id === item.destinationId)
                    ?.name ?? item.destinationId}
                </td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">₹{item.price}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 border-0 bg-transparent cursor-pointer text-charcoal/60 hover:text-brand"
                  >
                    <EditRoundedIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 border-0 bg-transparent cursor-pointer text-charcoal/60 hover:text-brand"
                  >
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
