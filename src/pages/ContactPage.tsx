import { type FormEvent, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PageBanner from "../components/layout/PageBanner";
import { useToast } from "../components/ui/ToastProvider";
import { siteInfo } from "../config/site";

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const contacts = [
    { icon: CallRoundedIcon, label: "Phone", value: siteInfo.phone },
    { icon: EmailRoundedIcon, label: "Email", value: siteInfo.email },
    { icon: LocationOnRoundedIcon, label: "Address", value: siteInfo.address },
    { icon: AccessTimeRoundedIcon, label: "Working Hours", value: siteInfo.hours },
  ];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill in name, email, and message.", "warning");
      return;
    }
    showToast("Your inquiry has been sent. We will get back to you soon.", "success");
    setName("");
    setEmail("");
    setMobile("");
    setSubject("");
    setMessage("");
  }

  return (
    <>
      <PageBanner title="Contact Us" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-6">Contact Info</h2>
          <div className="space-y-5">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0"><Icon className="text-brand" fontSize="small" /></div>
                <div><p className="text-sm font-bold text-charcoal m-0 mb-0.5">{label}</p><p className="text-sm text-charcoal/70 m-0">{value}</p></div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-6">Send Inquiry</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70">
              Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">
              Mobile
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 98765 43210" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">
              Subject
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">
              Message
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Your message" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none resize-y font-normal" />
            </label>
          </div>
          <button type="submit" className="w-full mt-5 py-3 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-brand-dark">
            Send Inquiry
          </button>
        </form>
      </section>
    </>
  );
}
