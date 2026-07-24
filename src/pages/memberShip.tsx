import { useState } from "react";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { getMembershipPackages } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";
import type { MembershipBenefits, MembershipPackage } from "../types/api";
import logoMark from "../assets/AalaGo Primary-CYzc3xfU.png";

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

const fallbackPlans: MembershipPackage[] = [
  {
    id: 1,
    name: "AalaGO Explorer",
    price: 499,
    period: "Year",
    popular: false,
    sortOrder: 1,
    benefits: {
      bookingDiscount: "10% OFF (Up to Rs.500/year)",
      rewardWallet: "Rs.250",
      complimentaryBreakfast: "1 Stay",
      earlyCheckInLateCheckOut: "",
      priorityBooking: "No",
      memberOnlyDeals: "Yes",
      travelWelcomeKit: "No",
      priorityCustomerSupport: "No",
    },
    features: ["10% booking discount", "Rs.250 reward wallet", "1 complimentary breakfast stay", "Member-only deals"],
  },
  {
    id: 2,
    name: "AalaGO Premium",
    price: 999,
    period: "Year",
    popular: true,
    sortOrder: 2,
    benefits: {
      bookingDiscount: "15% OFF (Up to Rs.2,000/year)",
      rewardWallet: "Rs.600",
      complimentaryBreakfast: "2 Stays",
      earlyCheckInLateCheckOut: "1 Time",
      priorityBooking: "Yes",
      memberOnlyDeals: "Yes",
      travelWelcomeKit: "Yes",
      priorityCustomerSupport: "Yes",
    },
    features: ["15% booking discount", "Rs.600 reward wallet", "2 breakfast stays", "Priority booking"],
  },
  {
    id: 3,
    name: "AalaGO Legend",
    price: 1499,
    period: "Year",
    popular: false,
    sortOrder: 3,
    benefits: {
      bookingDiscount: "20% OFF (Up to Rs.3,000/year)",
      rewardWallet: "Rs.1,000",
      complimentaryBreakfast: "3 Stays",
      earlyCheckInLateCheckOut: "3 Times",
      priorityBooking: "Yes",
      memberOnlyDeals: "Yes",
      travelWelcomeKit: "Premium Kit",
      priorityCustomerSupport: "Premium Support",
    },
    features: ["20% booking discount", "Rs.1,000 reward wallet", "3 breakfast stays", "Premium support"],
  },
];

const comparisonRows: { key: keyof MembershipBenefits | "fee"; label: string }[] = [
  { key: "fee", label: "Annual Fee" },
  { key: "bookingDiscount", label: "Booking Discount" },
  { key: "rewardWallet", label: "Reward Wallet" },
  { key: "complimentaryBreakfast", label: "Complimentary Breakfast" },
  { key: "earlyCheckInLateCheckOut", label: "Early Check-in / Late Check-out" },
  { key: "priorityBooking", label: "Priority Booking" },
  { key: "memberOnlyDeals", label: "Member-Only Deals" },
  { key: "travelWelcomeKit", label: "Travel Welcome Kit" },
  { key: "priorityCustomerSupport", label: "Priority Customer Support" },
];

const benefits = [
  {
    title: "Exclusive Discounts",
    copy: "Special offers from participating hospitality partners.",
    icon: CardGiftcardOutlinedIcon,
  },
  {
    title: "Personalized Recommendations",
    copy: "Get stay suggestions based on your travel preferences.",
    icon: LocationOnOutlinedIcon,
  },
  {
    title: "Destination Guides",
    copy: "Access curated travel guides and pilgrimage information.",
    icon: MenuBookOutlinedIcon,
  },
  {
    title: "Travel Community",
    copy: "Connect with fellow travellers and spiritual explorers.",
    icon: GroupsOutlinedIcon,
  },
];

const terms = [
  "Membership valid for 1 year from the date of purchase.",
  "Membership is non-transferable and non-refundable.",
  "Benefits are subject to participating partner properties and availability.",
  "Aala Go reserves the right to modify or discontinue any membership benefits.",
];

export default function MemberShip() {
  const { data } = useAsync(getMembershipPackages, []);
  const [showFullComparison, setShowFullComparison] = useState(false);
  const plans = (data?.length ? data : fallbackPlans).map(normalizePlan);
  const visibleComparisonRows = showFullComparison ? comparisonRows : comparisonRows.slice(0, 2);

  return (
    <>
      <section
        className="relative min-h-[330px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(17,17,17,0.78), rgba(17,17,17,0.42), rgba(17,17,17,0.08)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 text-white lg:px-6 md:py-20">
          <h1 className="m-0 mb-4 text-4xl font-extrabold md:text-5xl">AalaGO Membership</h1>
          <p className="m-0 mb-5 text-xl font-extrabold">Travel More. Experience More. Save More.</p>
          <p className="m-0 max-w-xl leading-relaxed text-white/82">
            Unlock exclusive benefits and special privileges designed for frequent spiritual and cultural travellers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <SectionHeading>Membership Plans</SectionHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <article key={plan.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/5">
              <div className={`relative h-52 overflow-hidden p-8 text-white ${cardGradient(index)}`}>
                <div className="absolute -right-16 -top-12 h-56 w-72 rounded-full bg-white/10" />
                <div className="absolute -right-24 top-10 h-80 w-96 rounded-full border border-white/10" />
                <p className="relative m-0 text-2xl font-extrabold tracking-tight">{plan.name}</p>
                {plan.popular && (
                  <span className="relative mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">
                    Most Popular
                  </span>
                )}
                <p className="absolute bottom-7 left-8 m-0 text-3xl font-extrabold">
                  Rs.{plan.price.toLocaleString("en-IN")}
                  <span className="text-base font-semibold text-white/55"> /{plan.period.toLowerCase()}</span>
                </p>
              </div>
              <div className="p-7">
                <ul className="m-0 mb-7 p-0 text-left">
                  {plan.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="mb-3 flex items-start gap-2 text-sm text-charcoal/70">
                      <CheckCircleRoundedIcon className="mt-0.5 text-brand" fontSize="small" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" className="w-full rounded-lg border-0 bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-dark">
                  Join Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <SectionHeading>Plan Comparison</SectionHeading>
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-xl shadow-black/5">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-4 text-base font-extrabold text-charcoal">Benefits</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-5 py-4 text-base font-extrabold text-charcoal">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleComparisonRows.map((row) => (
                <tr key={row.key} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-5 py-4 text-base font-extrabold text-charcoal">{row.label}</td>
                  {plans.map((plan) => (
                    <td key={`${plan.id}-${row.key}`} className="px-5 py-4 text-base text-charcoal">
                      {renderComparisonValue(row.key, plan)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setShowFullComparison((current) => !current)}
            className="rounded-lg border border-brand bg-white px-5 py-2.5 text-sm font-extrabold text-brand hover:bg-brand hover:text-white"
          >
            {showFullComparison ? "Show Less" : "See Full Details"}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <SectionHeading>Membership Benefits</SectionHeading>
        <div className="mt-8 grid gap-y-8 rounded-xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, copy, icon: Icon }, index) => (
            <div key={title} className={`px-5 text-center ${index ? "lg:border-l lg:border-gray-200" : ""}`}>
              <Icon className="mb-3 text-brand" fontSize="large" />
              <h3 className="m-0 mb-2 text-sm font-extrabold text-charcoal">{title}</h3>
              <p className="m-0 text-xs leading-relaxed text-charcoal/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-6">
        <div className="relative overflow-hidden rounded-xl border border-brand/10 bg-brand/5 p-6 md:p-8">
          <div className="relative z-10 max-w-3xl">
            <h2 className="m-0 mb-4 text-xl font-extrabold text-charcoal">Membership Terms</h2>
            <ul className="m-0 p-0">
              {terms.map((term) => (
                <li key={term} className="mb-2 list-none text-sm text-charcoal/70">
                  <span className="font-extrabold text-brand">-</span> {term}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-5 right-8 hidden rounded-2xl bg-white/55 p-5 opacity-20 md:block">
            <img src={logoMark} alt="" className="h-35 w-auto" />
          </div>
        </div>
      </section>
    </>
  );
}

function normalizePlan(plan: MembershipPackage): MembershipPackage {
  const benefits = { ...emptyBenefits, ...(plan.benefits ?? {}) };
  return {
    ...plan,
    benefits,
    features: plan.features?.length ? plan.features : buildFeatureList(benefits),
  };
}

function renderComparisonValue(key: keyof MembershipBenefits | "fee", plan: MembershipPackage) {
  if (key === "fee") {
    return <strong>Rs.{plan.price.toLocaleString("en-IN")}/{plan.period.toLowerCase()}</strong>;
  }
  const value = plan.benefits[key];
  if (!value) return <span className="text-xl leading-none">-</span>;
  if (isNo(value)) return <CloseRoundedIcon className="text-brand" />;
  if (isYes(value)) return <CheckCircleRoundedIcon className="text-green-600" />;
  return value;
}

function isYes(value: string) {
  return ["yes", "true", "included"].includes(value.trim().toLowerCase());
}

function isNo(value: string) {
  return ["no", "false", "not included"].includes(value.trim().toLowerCase());
}

function buildFeatureList(benefits: MembershipBenefits) {
  return [
    benefits.bookingDiscount,
    benefits.rewardWallet ? `${benefits.rewardWallet} Reward Wallet` : "",
    benefits.complimentaryBreakfast ? `${benefits.complimentaryBreakfast} Complimentary Breakfast` : "",
    benefits.earlyCheckInLateCheckOut ? `${benefits.earlyCheckInLateCheckOut} Early Check-in / Late Check-out` : "",
    isYes(benefits.priorityBooking) ? "Priority Booking" : "",
    isYes(benefits.memberOnlyDeals) ? "Member-Only Deals" : "",
    benefits.travelWelcomeKit && !isNo(benefits.travelWelcomeKit) ? `Travel Welcome Kit: ${benefits.travelWelcomeKit}` : "",
    benefits.priorityCustomerSupport && !isNo(benefits.priorityCustomerSupport)
      ? `Priority Customer Support: ${benefits.priorityCustomerSupport}`
      : "",
  ].filter(Boolean);
}

function cardGradient(index: number) {
  const styles = [
    "membership-card-insider",
    "membership-card-pro",
    "membership-card-legend",
  ];
  return styles[index % styles.length];
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="text-center">
      <h2 className="m-0 text-2xl font-extrabold text-charcoal">{children}</h2>
      <span className="mx-auto mt-3 block h-1 w-10 rounded-full bg-brand" />
    </div>
  );
}
