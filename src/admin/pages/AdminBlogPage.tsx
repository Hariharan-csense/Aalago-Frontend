import { type FormEvent, useEffect, useRef, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  adminCreateBlogPost,
  adminDeleteBlogPost,
  adminGetBlogPosts,
  adminUpdateBlogPost,
  adminUploadImage,
} from "../../api/endpoints";
import { LoadingState, ErrorState } from "../../components/ui/AsyncState";
import SafeImage from "../../components/ui/SafeImage";
import { useToast } from "../../components/ui/ToastProvider";
import type { BlogPost } from "../../types/api";

const emptyForm: BlogPost = {
  id: "",
  title: "",
  excerpt: "",
  author: "",
  readTime: "",
  category: "",
  date: "",
  image: "",
};

export default function AdminBlogPage() {
  const { showToast, showConfirm } = useToast();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<BlogPost>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const latestImageRef = useRef("");

  async function reloadItems() {
    try {
      setItems(await adminGetBlogPosts());
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to refresh list", "error");
    }
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminGetBlogPosts());
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
    latestImageRef.current = "";
    setShowForm(true);
  }

  function openEdit(item: BlogPost) {
    setEditingId(item.id);
    setForm(item);
    latestImageRef.current = item.image ?? "";
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    const payload = { ...form, image: latestImageRef.current || form.image };
    try {
      if (editingId) {
        await adminUpdateBlogPost(editingId, payload);
        showToast("Blog post updated", "success");
      } else {
        await adminCreateBlogPost(payload);
        showToast("Blog post created", "success");
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
      title: "Delete blog post?",
      message: "This blog post will be permanently removed.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;
    try {
      await adminDeleteBlogPost(id);
      setItems((current) => current.filter((item) => item.id !== id));
      showToast("Blog post deleted", "success");
      await reloadItems();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  async function uploadBlogImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await adminUploadImage(file);
      latestImageRef.current = uploaded.url;
      setForm((current) => ({ ...current, image: uploaded.url }));
      showToast("Image uploaded", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Blog</h2>
          <p className="text-charcoal/60 text-sm m-0">{items.length} post(s)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer"
        >
          <AddRoundedIcon fontSize="small" />
          Add Blog
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
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              required
              disabled={Boolean(editingId)}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Author
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Date
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Category
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Read Time
            <input
              value={form.readTime}
              onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              required
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
            Image
            <input
              value={form.image ?? ""}
              onChange={(e) => {
                latestImageRef.current = e.target.value;
                setForm({ ...form, image: e.target.value });
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadBlogImage(e.target.files?.[0])}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
            />
            {form.image && (
              <SafeImage
                src={form.image}
                alt=""
                className="w-full max-w-sm h-32 object-cover rounded-lg border border-gray-100"
              />
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
            Excerpt
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              required
              rows={3}
              className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
            />
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
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{item.title}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.date}</td>
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
