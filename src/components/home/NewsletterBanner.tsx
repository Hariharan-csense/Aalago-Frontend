import { type FormEvent, useState } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useToast } from "../ui/ToastProvider";

export default function NewsletterBanner({ title, text }: { title: string; text: string }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email address.", "warning");
      return;
    }
    showToast("Thanks for subscribing!", "success");
    setEmail("");
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
            className="flex-1 px-4 py-3 rounded-lg border-0 outline-0 text-sm"
          />
          <button type="submit" className="px-6 py-3 bg-charcoal text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-zinc-800">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
