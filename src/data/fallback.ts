import type { AboutContent, BannerContent, BlogPost, Destination, HomeContent, Property } from "../types/api";

export const whyChooseUs = [
  { title: "Best Price Guarantee", copy: "Enjoy competitive prices with exclusive member discounts." },
  { title: "Verified Properties", copy: "Every property is carefully verified for quality and comfort." },
  { title: "Instant Confirmation", copy: "Receive instant booking confirmation." },
  { title: "Secure Payments", copy: "100% secure online payment gateway." },
  { title: "24x7 Customer Support", copy: "Our team is always ready to help." },
  { title: "Trusted by Thousands of Travelers", copy: "Hotels, Homestays, Resorts, Villas & Temple Stays." },
];

export const stayTypes = [
  "Hotels",
  "Homestays",
  "Resorts",
  "Farm Stays",
  "Serviced Apartments",
  "Dormitories",
  "Temple Stays",
  "Holiday Villas",
];

export const popularDestinations = [
  "Tiruchendur",
  "Madurai",
  "Kanyakumari",
  "Courtallam",
  "Rameswaram",
  "Velankanni",
  "Tirunelveli",
  "Chennai",
  "Ooty",
  "Kodaikanal",
  "Yercaud",
  "Coimbatore",
  "Bengaluru",
  "Mysuru",
  "Hyderabad",
];

export const templeTourism = {
  title: "Temple Tourism",
  subtitle: "Stay Near India's Most Sacred Temples",
  copy: "Book accommodation close to famous pilgrimage destinations.",
  temples: [
    "Tiruchendur Murugan Temple",
    "Madurai Meenakshi Temple",
    "Rameswaram Ramanathaswamy Temple",
    "Kanyakumari Bhagavathy Temple",
    "Palani Murugan Temple",
    "Velankanni Basilica",
    "Sabarimala",
    "Tirupati",
  ],
  tagline: "Comfortable • Affordable • Family Friendly",
};

export const destinations: Destination[] = [
  { id: "rameswaram", name: "Rameswaram", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", description: "Walk the sacred corridors of Rameswaram and stay close to the Ramanathaswamy Temple.", properties: 11 },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=800&q=80", description: "Experience the grandeur of Meenakshi Amman Temple with comfortable stays.", properties: 14 },
  { id: "tirupati", name: "Tirupati", state: "Andhra Pradesh", image: "https://images.unsplash.com/photo-1609137144818-7fd85d3f3f3e?auto=format&fit=crop&w=800&q=80", description: "Find peaceful stays near Tirumala with easy darshan access.", properties: 18 },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", image: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=800&q=80", description: "Stay near the ghats and ancient temples of Kashi.", properties: 22 },
  { id: "kanchipuram", name: "Kanchipuram", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", description: "Discover heritage temple circuits and silk-town charm.", properties: 9 },
  { id: "shirdi", name: "Shirdi", state: "Maharashtra", image: "https://images.unsplash.com/photo-1609137144818-7fd85d3f3f3e?auto=format&fit=crop&w=800&q=80", description: "Comfortable senior-friendly stays with smooth darshan access.", properties: 16 },
];

export const properties: Property[] = [
  { id: "sri-murugan-homestay", name: "Sri Murugan Home Stay", location: "Rameswaram, Tamil Nadu", destinationId: "rameswaram", type: "Homestay", price: 2100, rating: 4.6, reviews: 128, popular: true, amenities: ["WiFi", "Parking", "AC"], image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"], description: "A warm family homestay minutes from Ramanathaswamy Temple with clean rooms and early check-in support.", highlights: ["Walkable to temple", "Early check-in", "Family rooms"] },
  { id: "meenakshi-retreat", name: "Meenakshi Retreat", location: "Madurai, Tamil Nadu", destinationId: "madurai", type: "Hotel", price: 2850, rating: 4.8, reviews: 214, popular: true, amenities: ["WiFi", "Parking", "AC"], image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"], description: "Premium rooms near Meenakshi Amman Temple with rooftop views and AC comfort.", highlights: ["5 min drive to temple", "Rooftop dining", "24h front desk"] },
  { id: "tirupati-darshan-inn", name: "Tirupati Darshan Inn", location: "Tirupati, Andhra Pradesh", destinationId: "tirupati", type: "Inn", price: 2450, rating: 4.7, reviews: 189, popular: false, amenities: ["WiFi", "Parking"], image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"], description: "Budget-friendly inn with darshan planning support and luggage storage.", highlights: ["Darshan assistance", "Luggage storage"] },
  { id: "kashi-ghat-residence", name: "Kashi Ghat Residence", location: "Varanasi, Uttar Pradesh", destinationId: "varanasi", type: "Homestay", price: 3150, rating: 4.7, reviews: 156, popular: true, amenities: ["WiFi", "AC"], image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80"], description: "Boutique stay near the ghats with river-view rooms and spiritual route guidance.", highlights: ["Ghat walk routes", "Boat booking help"] },
  { id: "shirdi-sai-comfort", name: "Shirdi Sai Comfort", location: "Shirdi, Maharashtra", destinationId: "shirdi", type: "Hotel", price: 2350, rating: 4.6, reviews: 142, popular: false, amenities: ["WiFi", "Parking", "AC"], image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"], description: "Senior-friendly hotel with elevator access and darshan queue support.", highlights: ["Senior-friendly", "Wheelchair access"] },
  { id: "kanchi-heritage-stay", name: "Kanchi Heritage Stay", location: "Kanchipuram, Tamil Nadu", destinationId: "kanchipuram", type: "Homestay", price: 1950, rating: 4.5, reviews: 98, popular: false, amenities: ["WiFi", "Parking"], image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"], description: "Heritage-style homestay near temple circuit with traditional breakfast.", highlights: ["Temple circuit map", "Traditional breakfast"] },
];

export const blogPosts: BlogPost[] = [
  { id: "1", title: "Complete Guide to Rameswaram Temple Visit", excerpt: "Everything you need to know about darshan timings and where to stay.", author: "Aayushi Goyal", readTime: "12 mins read", category: "Travel Tips", date: "June 28, 2026", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { id: "2", title: "Best Time to Visit Madurai Meenakshi Temple", excerpt: "Plan your spiritual journey around festivals and crowd patterns.", author: "Rajesh Kumar", readTime: "10 mins read", category: "Pilgrimage", date: "June 25, 2026", image: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=800&q=80" },
  { id: "3", title: "South India Pilgrimage Route Planning", excerpt: "Connect Rameswaram, Madurai, Kanchipuram, and Tirupati in one journey.", author: "Priya Sharma", readTime: "18 mins read", category: "Pilgrimage Routes", date: "June 22, 2026", image: "https://images.unsplash.com/photo-1609137144818-7fd85d3f3f3e?auto=format&fit=crop&w=800&q=80" },
  { id: "4", title: "Festival Calendar: Sacred Celebrations", excerpt: "Plan your spiritual journey around major festivals across India.", author: "Vineet Gupta", readTime: "14 mins read", category: "Festivals", date: "June 20, 2026", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { id: "5", title: "Offbeat Temples: Hidden Spiritual Gems", excerpt: "Discover lesser-known temples with unique architecture.", author: "Kajal Semwal", readTime: "11 mins read", category: "Offbeat", date: "June 18, 2026", image: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=800&q=80" },
  { id: "6", title: "Yoga & Wellness Near Temple Towns", excerpt: "Combine spiritual practices with temple visits for rejuvenation.", author: "Aayushi Goyal", readTime: "13 mins read", category: "Wellness", date: "June 15, 2026", image: "https://images.unsplash.com/photo-1609137144818-7fd85d3f3f3e?auto=format&fit=crop&w=800&q=80" },
];

export const testimonials = [
  { name: "Priya Sharma", location: "Chennai", text: "Our Rameswaram stay was perfectly located near the temple. Early check-in made our pilgrimage so much easier.", rating: 5 },
  { name: "Rajesh Kumar", location: "Bangalore", text: "aalaGo helped us find a family-friendly stay in Tirupati with great cleanliness and local hospitality.", rating: 5 },
  { name: "Anitha Menon", location: "Kochi", text: "The Madurai property exceeded expectations. Trusted standards and helpful staff throughout our trip.", rating: 5 },
];

export const fallbackHomeContent: HomeContent = {
  heroKicker: "AalaGO Book Direct. Save More. Travel Better",
  heroTitle: "Find Your Perfect Stay,",
  heroHighlight: "Anywhere in India",
  heroSubtitle: "Book Hotels • Homestays • Temple Stays • Holiday Homes Across India",
  heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
  aboutTitle: "Temple-Town Hospitality You Can Trust",
  aboutText: [
    "aalaGo connects travellers with curated stays near India's most sacred destinations.",
    "We partner with property owners to raise hospitality standards across temple towns.",
  ],
  aboutImage: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=800&q=80",
  newsletterTitle: "Begin Your Spiritual Journey Today",
  newsletterText: "Get temple-town openings, stay standards, and route ideas in your inbox.",
  whyChooseUs,
  stayTypes,
  popularDestinations,
  templeTourism,
  testimonials,
};

export const fallbackAboutContent: AboutContent = {
  title: "Built for Movement, Safe Arrival, and Temple-Town Shelter",
  subtitle: "About Aala Go",
  paragraphs: [
    "aalaGo is a temple-town hospitality brand that helps travellers find reliable stays near sacred destinations.",
    "Our wing mark represents movement and safe arrival, while the inner arch suggests shelter and temple-town relevance.",
  ],
  mission: "To make sacred travel easier by connecting pilgrims with trusted temple-town stays.",
  vision: "To become India's most trusted temple-town hospitality network.",
  stats: [
    { value: "500+", label: "Curated Properties" },
    { value: "50+", label: "Destinations" },
    { value: "10K+", label: "Happy Travelers" },
    { value: "100%", label: "Trusted Stays" },
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1609137144818-7fd85d3f3f3e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
  ],
};

export const fallbackBannerContent: BannerContent = {
  destinations: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
  properties: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  about: "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=1600&q=80",
  blog: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
  contact: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80",
  legal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
};
