export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  description: string;
  properties?: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  destinationId: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  popular: boolean;
  amenities: string[];
  image: string;
  images: string[];
  description: string;
  highlights: string[];
  bookingUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  date: string;
  image?: string;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface FeatureItem {
  title: string;
  copy: string;
}

export interface HomeContent {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string[];
  aboutImage: string;
  newsletterTitle: string;
  newsletterText: string;
  whyChooseUs: FeatureItem[];
  testimonials: Testimonial[];
}

export interface AboutContent {
  title: string;
  subtitle: string;
  paragraphs: string[];
  mission: string;
  vision: string;
  stats: { value: string; label: string }[];
  galleryImages: string[];
}

export interface BannerContent {
  destinations: string;
  properties: string;
  about: string;
  blog: string;
  contact: string;
  legal: string;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface AdminUser {
  email: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

export interface PartnerEnquiryPayload {
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  hotelName: string;
  locationWithinCity?: string;
  locationPinCode: string;
  propertyAge: string;
  numberOfRooms: string;
  crmPayload?: Record<string, string>;
}

export interface PartnerEnquiry extends PartnerEnquiryPayload {
  id: number;
  createdAt: string;
}

export interface SubscriberPayload {
  email: string;
  source?: string;
}

export interface Subscriber extends SubscriberPayload {
  id: number;
  source: string;
  createdAt: string;
}

export interface MembershipPackage {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  sortOrder: number;
}
