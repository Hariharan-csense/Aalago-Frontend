import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { getMembershipPackages } from "../api/endpoints";
import { useAsync } from "../hooks/useAsync";
import type { MembershipPackage } from "../types/api";
import logoMark from "../assets/AalaGo Primary-CYzc3xfU.png";

const fallbackPlans: MembershipPackage[] = [
  {
    id: 1,
    name: "Explorer Membership",
    price: 499,
    period: "Year",
    popular: false,
    sortOrder: 1,
    features: [
      "Member Newsletter",
      "Early Access to Offers",
      "Destination Updates",
      "Member Community Access",
    ],
  },
  {
    id: 2,
    name: "Traveller Membership",
    price: 999,
    period: "Year",
    popular: true,
    sortOrder: 2,
    features: [
      "Everything in Explorer",
      "Priority Property Recommendations",
      "Special Partner Discounts",
      "Festival Travel Alerts",
    ],
  },
  {
    id: 3,
    name: "Pilgrim Membership",
    price: 1499,
    period: "Year",
    popular: false,
    sortOrder: 3,
    features: [
      "Everything in Traveller",
      "Premium Destination Guides",
      "Exclusive Spiritual Event Access",
      "Personalized Travel Assistance",
    ],
  },
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
  const plans = data?.length ? data : fallbackPlans;

  return (
    <>
      <section
        className="relative min-h-[330px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(17,17,17,0.78), rgba(17,17,17,0.42), rgba(17,17,17,0.08)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 md:py-20 text-white">
          <h1 className="m-0 mb-4 text-4xl md:text-5xl font-extrabold">
            Aala Go Membership
          </h1>
          <p className="m-0 mb-5 text-xl font-extrabold">
            Travel More. Experience More. Save More.
          </p>
          <p className="m-0 max-w-xl text-white/82 leading-relaxed">
            Unlock exclusive benefits and special privileges designed for frequent
            spiritual and cultural travellers.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <SectionHeading>Membership Plans</SectionHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/5"
            >
              <div className={`relative h-52 overflow-hidden p-8 text-white ${cardGradient(index)}`}>
                <div className="absolute -right-16 -top-12 h-56 w-72 rounded-full bg-white/10" />
                <div className="absolute -right-24 top-10 h-80 w-96 rounded-full border border-white/10" />
                <p className="relative m-0 text-2xl font-extrabold tracking-tight">
                  {/* <span className="text-white/55">aala</span> */}
                  <span className="ml-1 uppercase text-white">{cardName(plan, index)}</span>
                </p>
                {plan.popular && (
                  <span className="relative mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">
                    Most Popular
                  </span>
                )}
                <p className="absolute bottom-7 left-8 m-0 text-3xl font-extrabold">
                  ₹{plan.price.toLocaleString("en-IN")}
                  <span className="text-base font-semibold text-white/55"> /{plan.period.toLowerCase()}</span>
                </p>
              </div>
              <div className="p-7">
                <h3 className="m-0 mb-5 text-lg font-extrabold text-charcoal">{plan.name}</h3>
                <ul className="m-0 mb-7 p-0 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="mb-3 flex items-start gap-2 text-sm text-charcoal/70">
                      <CheckCircleRoundedIcon className="text-brand mt-0.5" fontSize="small" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="w-full rounded-lg border-0 bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-dark cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <SectionHeading>Membership Benefits</SectionHeading>
        <div className="mt-8 grid gap-y-8 rounded-xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, copy, icon: Icon }, index) => (
            <div
              key={title}
              className={`px-5 text-center ${index ? "lg:border-l lg:border-gray-200" : ""}`}
            >
              <Icon className="text-brand mb-3" fontSize="large" />
              <h3 className="m-0 mb-2 text-sm font-extrabold text-charcoal">{title}</h3>
              <p className="m-0 text-xs leading-relaxed text-charcoal/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-14">
        <div className="relative overflow-hidden rounded-xl bg-brand/5 border border-brand/10 p-6 md:p-8">
          <div className="relative z-10 max-w-3xl">
            <h2 className="m-0 mb-4 text-xl font-extrabold text-charcoal">Membership Terms</h2>
            <ul className="m-0 p-0">
              {terms.map((term) => (
                <li key={term} className="mb-2 list-none text-sm text-charcoal/70">
                  <span className="text-brand font-extrabold">•</span> {term}
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

function cardName(plan: MembershipPackage, _index: number) {
  const name = plan.name.toLowerCase();
  if (name.includes("explorer")) return "Insider";
  if (name.includes("traveller")) return "Pro";
  if (name.includes("pilgrim")) return "Legend";
 // return ["Insider", "Pro", "Legend"][index] ?? "Member";
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
