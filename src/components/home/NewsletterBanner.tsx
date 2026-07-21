import { type FormEvent, useState } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useToast } from "../ui/ToastProvider";
import { createSubscriber } from "../../api/endpoints";

export default function NewsletterBanner({ title, text }: { title: string; text: string }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email address.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await createSubscriber({
        email,
        source: "Home Newsletter Banner",
      });
      showToast("Thanks for subscribing!", "success");
      setEmail("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Subscription failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-brand py-14">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <FavoriteRoundedIcon className="text-white/80 mb-3" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-white m-0 mb-2">{title}</h2>
        <p className="text-white/80 mb-6">{text}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={submitting}
            className="flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm text-charcoal shadow-sm outline-0 placeholder:text-charcoal/45 disabled:opacity-70"
          />
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-charcoal text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-zinc-800 disabled:opacity-70">
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
