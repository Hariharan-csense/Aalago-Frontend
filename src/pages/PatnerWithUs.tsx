import { useState, type FormEvent, type ReactNode } from "react";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import TempleHinduOutlinedIcon from "@mui/icons-material/TempleHinduOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VillaOutlinedIcon from "@mui/icons-material/VillaOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { createPartnerEnquiry } from "../api/endpoints";

const whyPartner = [
  {
    title: "Increased Visibility",
    copy: "Showcase your property to travellers actively seeking stays near spiritual destinations.",
    icon: TrendingUpOutlinedIcon,
  },
  {
    title: "Qualified Guests",
    copy: "Reach pilgrims, families, wellness seekers, and cultural travellers.",
    icon: GroupsOutlinedIcon,
  },
  {
    title: "Dedicated Property Page",
    copy: "Get a professionally managed listing with photos, amenities, location details, and direct booking access.",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    title: "Marketing Support",
    copy: "Benefit from destination-focused campaigns and digital promotions.",
    icon: CampaignOutlinedIcon,
  },
];

const partnerTypes = [
  { label: "Home Stays", icon: HomeWorkOutlinedIcon },
  { label: "Hotels", icon: HotelOutlinedIcon },
  { label: "Resorts", icon: VillaOutlinedIcon },
  { label: "Ashrams", icon: TempleHinduOutlinedIcon },
  { label: "Retreat Centers", icon: SpaOutlinedIcon },
  { label: "Heritage Properties", icon: ApartmentOutlinedIcon },
  { label: "Temple Guest Houses", icon: TempleHinduOutlinedIcon },
];

const processSteps = [
  {
    number: "01",
    title: "Reach Out",
    copy: "Share your property details and our partnership team will connect with you.",
  },
  {
    number: "02",
    title: "The Match",
    copy: "We review your stay, location, rooms, and guest experience standards.",
  },
  {
    number: "03",
    title: "We Have A Deal",
    copy: "We agree on commercial terms and prepare your listing for AalaGo.",
  },
  {
    number: "04",
    title: "Transformation",
    copy: "Our team helps with content, operations, and readiness for travellers.",
  },
  {
    number: "05",
    title: "Sit Back & Relax",
    copy: "Your property goes live for pilgrims, families, and spiritual travellers.",
  },
];

const benefits = [
  {
    title: "End-to-End Managed Operations",
    copy: "AalaGo handles onboarding, listing support, and guest readiness for your property.",

    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Professional Sales & Marketing",
    copy: "Curated property pages and destination visibility help improve occupancy.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Insight-Based Design Intelligence",
    copy: "We help position your stay for temple-town travellers and family guests.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Best-in-Class Technology",
    copy: "Admin tools, booking links, and performance visibility keep your operations simple.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
  },
];

const faqs = [
  {
    question: "What kind of property can I partner with?",
    answer:
      "We welcome hotels, home stays, resorts, ashrams, retreat centers, heritage properties, and temple guest houses that provide quality accommodation for travelers.",
  },
  {
    question: "How much investment is required from my side?",
    answer:
      "There is no large upfront investment required. Our team will discuss the partnership model based on your property's size, facilities, and business goals.",
  },
  {
    question: "What returns can I expect?",
    answer:
      "Your returns depend on your property's location, occupancy, pricing, and demand. We help improve visibility and bookings through marketing and technology support.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Most properties can be onboarded within 5–10 business days after document verification and property review.",
  },
  {
    question: "Do I need hospitality experience to become a partner?",
    answer:
      "No. While hospitality experience is helpful, our team will guide you through onboarding, operations, and guest experience standards.",
  },
  {
    question: "How do I track revenue and performance?",
    answer:
      "You'll receive regular booking updates, occupancy insights, and performance reports to help you monitor your property's growth.",
  },
];

const ageOptions = [
  "0-1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];
const roomOptions = [
  "0-10 Rooms",
  "10-20 Rooms",
  "20-30 Rooms",
  "30-40 Rooms",
  "40-50 Rooms",
  "50+ Rooms",
];

export default function PatnerWithUs() {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function openForm() {
    setMessage("");
    setOpen(true);
  }

  function closeForm() {
    setMessage("");
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const lead = {
      name: String(data.get("full_name") || "").trim(),
      phoneNumber: String(data.get("phone_number") || "").trim(),
      email: String(data.get("email") || "").trim(),
      city: String(data.get("city") || "").trim(),
      hotelName: String(data.get("hotel_name") || "").trim(),
      locationPinCode: String(data.get("location_pin_code") || "").trim(),
      propertyAge: String(data.get("property_age") || "").trim(),
      numberOfRooms: String(data.get("number_of_rooms") || "").trim(),
    };
    const crmPayload = {
      name: lead.name,
      email: lead.email,
      phone: lead.phoneNumber,
      company: lead.hotelName,
      message: [
        `City: ${lead.city}`,
        `Pin Code: ${lead.locationPinCode}`,
        `Property Age: ${lead.propertyAge}`,
        `Rooms: ${lead.numberOfRooms}`,
      ].join("\n"),
      form_id: "partner-registration",
      source: "Partner With Us Popup",
    };

    setSubmitting(true);
    setMessage("");
    try {
      await createPartnerEnquiry({ ...lead, crmPayload });
      try {
        await (
          window as typeof window & {
            submitProceaseLead?: (
              leadData: Record<string, string>,
            ) => Promise<Response>;
          }
        ).submitProceaseLead?.(crmPayload);
      } catch {
        // CRM failure should not block local enquiry capture.
      }
      form.reset();
      setOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Unable to submit enquiry",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          className="relative min-h-[420px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(17,17,17,0.78), rgba(17,17,17,0.42), rgba(17,17,17,0.08)), url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=80')",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight m-0 mb-5">
                Partner With Aala Go
              </h1>
              <p className="text-lg font-extrabold leading-relaxed max-w-md mb-4">
                Grow Your Hospitality Business With India's Spiritual Travel
                Community
              </p>
              <p className="text-white/80 leading-relaxed max-w-md mb-8">
                Join our growing network of home stays, resorts, retreat
                centers, heritage properties, and hospitality partners serving
                spiritual and cultural travellers.
              </p>
              <button
                type="button"
                onClick={openForm}
                className="rounded-lg border-0 bg-brand px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark cursor-pointer"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <SectionHeading>Why Partner With Us?</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {whyPartner.map(({ title, copy, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl bg-brand/5 border border-brand/10 p-6 text-center"
            >
              <Icon className="text-brand mb-3" fontSize="large" />
              <h3 className="m-0 mb-2 text-base font-extrabold text-charcoal">
                {title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-charcoal/65">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-10">
        <SectionHeading>Who Can Partner?</SectionHeading>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          {partnerTypes.map(({ label, icon: Icon }, index) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 px-3 text-center ${index ? "lg:border-l lg:border-gray-200" : ""}`}
            >
              <Icon className="text-brand" fontSize="large" />
              <p className="m-0 text-xs font-extrabold text-charcoal">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
        <p className="text-brand text-xs font-extrabold uppercase tracking-[0.18em] mb-2">
          The Process
        </p>
        <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-10">
          How does it work?
        </h2>
        <div className="grid md:grid-cols-5 gap-6">
          {processSteps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                {step.number}
              </div>
              <h3 className="text-sm font-extrabold text-charcoal m-0 mb-2">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-charcoal/60 m-0">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-2">
          Why AalaGo, and{" "}
          <span className="text-brand">not any other brand?</span>
        </h2>
        <p className="text-sm font-bold uppercase text-charcoal/45 mb-10">
          Here's why
        </p>
        <div className="grid gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`grid lg:grid-cols-2 gap-10 items-center ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <img
                src={benefit.image}
                alt={benefit.title}
                className="h-[280px] w-full rounded-xl object-cover shadow-xl"
              />
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand font-extrabold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-extrabold text-charcoal m-0">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-charcoal/60 max-w-md m-0">
                  {benefit.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div>
          <p className="text-brand text-xs font-extrabold uppercase tracking-[0.18em] mb-2">
            Need Help?
          </p>
          <h2 className="text-3xl font-extrabold text-charcoal m-0 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-charcoal/60 mb-8">
            Find answers to common questions about our services and offerings.
          </p>
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
            alt="Support team"
            className="h-[260px] w-full rounded-xl object-cover"
          />
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-charcoal">
                {question}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-xl bg-brand text-white shadow-xl">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-extrabold m-0 mb-4">
              Ready to grow with India's temple stay chain?
            </h2>
            <p className="text-white/80 mb-7 max-w-md">
              Partner with AalaGo and take your property to travellers looking
              for trusted stays near sacred destinations.
            </p>
            <button
              type="button"
              onClick={openForm}
              className="rounded-lg border-0 bg-white px-6 py-3 text-sm font-extrabold text-brand cursor-pointer"
            >
              Register Now
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80"
            alt="Hotel terrace"
            className="h-full min-h-[280px] w-full object-cover"
          />
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 px-4 py-8">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4">
                <div>
                  <h2 className="m-0 text-xl font-extrabold text-charcoal">
                    Register Your Property
                  </h2>
                  <p className="m-0 mt-1 text-sm text-charcoal/55">
                    Our team will contact you soon.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close"
                  className="h-9 w-9 rounded-full border-0 bg-gray-100 text-xl font-bold text-charcoal cursor-pointer"
                >
                  x
                </button>
              </div>
              <form
                id="partner-registration-form"
                data-procease-crm-form
                data-form-id="partner-registration"
                data-source="Partner With Us Popup"
                onSubmit={handleSubmit}
                className="grid max-h-[72vh] gap-4 overflow-y-auto p-6 md:grid-cols-2"
              >
                <FormField
                  name="full_name"
                  label="Name"
                  placeholder="First and last name"
                  required
                />
                <FormField
                  name="phone_number"
                  label="Phone number"
                  type="tel"
                  required
                />
                <FormField
                  name="email"
                  label="Email ID"
                  type="email"
                  required
                />
                <FormField name="city" label="City" required />
                <FormField name="hotel_name" label="Hotel Name" required />
                <FormField
                  name="location_pin_code"
                  label="Location Pin Code"
                  required
                />
                <label className="flex flex-col gap-2 text-sm font-bold text-charcoal">
                  <span>
                    Age of the property <span className="text-brand">*</span>
                  </span>
                  <select
                    name="property_age"
                    required
                    className="h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm font-normal outline-none"
                  >
                    <option value="">Select age</option>
                    {ageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold text-charcoal">
                  <span>
                    Number of Rooms <span className="text-brand">*</span>
                  </span>
                  <select
                    name="number_of_rooms"
                    required
                    className="h-12 rounded-lg border border-gray-200 bg-white px-3 text-sm font-normal outline-none"
                  >
                    <option value="">Select rooms</option>
                    {roomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                {message && (
                  <p
                    className="md:col-span-2 m-0 text-sm font-bold text-brand"
                  >
                    {message}
                  </p>
                )}
                <div className="md:col-span-2 flex justify-end gap-3 border-t border-gray-100 bg-white pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-charcoal cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg border-0 bg-brand px-6 py-3 text-sm font-extrabold text-white cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {successOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 px-4 py-8">
          <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white p-7 text-center shadow-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden">
              {["left-[12%] bg-brand", "left-[28%] bg-amber-400", "left-[46%] bg-emerald-500", "left-[64%] bg-sky-500", "left-[80%] bg-brand-dark"].map(
                (style, index) => (
                  <span
                    key={style}
                    className={`absolute top-3 h-3 w-2 animate-bounce rounded-sm ${style}`}
                    style={{ animationDelay: `${index * 120}ms` }}
                  />
                ),
              )}
            </div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircleRoundedIcon fontSize="large" />
            </div>
            <h2 className="m-0 text-2xl font-extrabold text-charcoal">
              Thank you!
            </h2>
            <p className="mx-auto mt-3 mb-6 max-w-xs text-sm leading-relaxed text-charcoal/65">
              Your property enquiry has been submitted. Our team will contact
              you soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="rounded-lg border-0 bg-brand px-6 py-3 text-sm font-extrabold text-white cursor-pointer hover:bg-brand-dark"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="m-0 text-2xl md:text-3xl font-extrabold text-charcoal">
        {children}
      </h2>
      <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-brand" />
    </div>
  );
}

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-bold text-charcoal">
      <span>
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-lg border border-gray-200 px-3 text-sm font-normal outline-none focus:border-brand"
      />
    </label>
  );
}
