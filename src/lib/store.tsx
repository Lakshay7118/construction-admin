"use client";

/**
 * Mock data store for the admin panel.
 *
 * This is a frontend-only stand-in for a real backend/API. Everything lives in
 * React state, seeded once from `site-data.ts` and mirrored into localStorage
 * so edits survive a page refresh during review. Swap `persist()`/the initial
 * load for real API calls when the backend is ready — the shape of
 * `AdminDataContextValue` is written to map cleanly onto REST/GraphQL calls
 * (list/create/update/remove per resource).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cities as seedCities,
  projects as seedProjects,
  services as seedServices,
  blogs as seedBlogs,
  careers as seedCareers,
  testimonials as seedTestimonials,
  awards as seedAwards,
  type City,
  type Project,
  type Service,
  type Blog,
  type CareerPost,
  type Testimonial,
  type Award,
} from "./site-data";

export type {
  City,
  Project,
  Service,
  Blog,
  CareerPost,
  Testimonial,
  Award,
  ProjectType,
  ProjectStatus,
  TimelineEntry,
} from "./site-data";

export type InquiryStatus = "new" | "in-progress" | "closed";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  city: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  source: "Quote Form" | "Contact Form";
}

export interface JobApplication {
  id: string;
  careerSlug: string;
  roleTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeFileName: string;
  coverNote: string;
  status: "new" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Viewer";
  lastActive: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  maintenanceMode: boolean;
}

const STORAGE_KEY = "kc-admin-store-v1";

const seedInquiries: Inquiry[] = [
  {
    id: "inq-1001",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98200 11234",
    projectType: "Residential",
    city: "Mumbai",
    budget: "₹2Cr - ₹5Cr",
    message: "Looking for a turnkey quote on a 3BHK redevelopment near Bandra.",
    status: "new",
    createdAt: "2026-07-04T09:12:00+05:30",
    source: "Quote Form",
  },
  {
    id: "inq-1002",
    name: "Karan Bhatt",
    email: "karan.bhatt@builtline.co",
    phone: "+91 90210 44521",
    projectType: "Commercial",
    city: "Delhi NCR",
    budget: "₹10Cr+",
    message: "Representing a REIT looking for design-build partners for a Grade-A office park.",
    status: "in-progress",
    createdAt: "2026-07-02T15:40:00+05:30",
    source: "Quote Form",
  },
  {
    id: "inq-1003",
    name: "Priya Menon",
    email: "priya.menon@example.com",
    phone: "+91 88888 22110",
    projectType: "General enquiry",
    city: "Pune",
    budget: "—",
    message: "Wanted to know if you take up society redevelopment projects under 50 units.",
    status: "closed",
    createdAt: "2026-06-27T11:05:00+05:30",
    source: "Contact Form",
  },
  {
    id: "inq-1004",
    name: "Devendra Joshi",
    email: "d.joshi@ahmgroup.in",
    phone: "+91 99900 12233",
    projectType: "Industrial",
    city: "Ahmedabad",
    budget: "₹5Cr - ₹10Cr",
    message: "Need a quote for a second phase warehousing block adjacent to our existing logistics park.",
    status: "new",
    createdAt: "2026-07-05T18:22:00+05:30",
    source: "Quote Form",
  },
];

const seedApplications: JobApplication[] = [
  {
    id: "app-501",
    careerSlug: "senior-site-engineer-mumbai",
    roleTitle: "Senior Site Engineer",
    name: "Aditya Kulkarni",
    email: "aditya.k@example.com",
    phone: "+91 99887 65321",
    resumeFileName: "aditya_kulkarni_resume.pdf",
    coverNote: "8 years on high-rise residential sites, currently at a Mumbai-based contractor.",
    status: "shortlisted",
    createdAt: "2026-07-01T10:00:00+05:30",
  },
  {
    id: "app-502",
    careerSlug: "project-manager-delhi",
    roleTitle: "Project Manager",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    phone: "+91 97710 55214",
    resumeFileName: "simran_kaur_cv.pdf",
    coverNote: "PMP certified, managed a 4-tower commercial delivery end to end.",
    status: "new",
    createdAt: "2026-07-03T13:30:00+05:30",
  },
  {
    id: "app-503",
    careerSlug: "quantity-surveyor-pune",
    roleTitle: "Quantity Surveyor",
    name: "Rahul Deshpande",
    email: "rahul.d@example.com",
    phone: "+91 90960 11122",
    resumeFileName: "rahul_deshpande_resume.pdf",
    coverNote: "5 years BOQ and vendor billing experience across industrial sites.",
    status: "new",
    createdAt: "2026-07-05T09:45:00+05:30",
  },
];

const seedUsers: AdminUser[] = [
  { id: "usr-1", name: "Meera Iyer", email: "meera.iyer@kalpataru.co.in", role: "Super Admin", lastActive: "2026-07-06T08:15:00+05:30" },
  { id: "usr-2", name: "Arjun Nair", email: "arjun.nair@kalpataru.co.in", role: "Editor", lastActive: "2026-07-05T17:50:00+05:30" },
  { id: "usr-3", name: "Fatima Sheikh", email: "fatima.sheikh@kalpataru.co.in", role: "Viewer", lastActive: "2026-07-04T12:05:00+05:30" },
];

const seedSettings: SiteSettings = {
  companyName: "Kalpataru Constructions",
  tagline: "Building What Lasts",
  supportEmail: "hello@kalpataruconstructions.in",
  supportPhone: "+91 22 4021 5566",
  address: "12th Floor, Blueprint House, Bandra Kurla Complex, Mumbai 400051",
  instagram: "https://instagram.com/kalpataruconstructions",
  linkedin: "https://linkedin.com/company/kalpataruconstructions",
  facebook: "https://facebook.com/kalpataruconstructions",
  maintenanceMode: false,
};

interface StoreShape {
  cities: City[];
  projects: Project[];
  services: Service[];
  blogs: Blog[];
  careers: CareerPost[];
  testimonials: Testimonial[];
  awards: Award[];
  inquiries: Inquiry[];
  applications: JobApplication[];
  users: AdminUser[];
  settings: SiteSettings;
}

function seedStore(): StoreShape {
  return {
    cities: seedCities,
    projects: seedProjects,
    services: seedServices,
    blogs: seedBlogs,
    careers: seedCareers,
    testimonials: seedTestimonials,
    awards: seedAwards,
    inquiries: seedInquiries,
    applications: seedApplications,
    users: seedUsers,
    settings: seedSettings,
  };
}

function loadStore(): StoreShape {
  if (typeof window === "undefined") return seedStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedStore();
    const parsed = JSON.parse(raw);
    return { ...seedStore(), ...parsed };
  } catch {
    return seedStore();
  }
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface AdminDataContextValue extends StoreShape {
  ready: boolean;
  resetToSeed: () => void;
  upsertCity: (city: City, originalSlug?: string) => void;
  removeCity: (slug: string) => void;
  upsertProject: (project: Project, originalSlug?: string) => void;
  removeProject: (slug: string) => void;
  upsertService: (service: Service, originalSlug?: string) => void;
  removeService: (slug: string) => void;
  upsertBlog: (blog: Blog, originalSlug?: string) => void;
  removeBlog: (slug: string) => void;
  upsertCareer: (career: CareerPost, originalSlug?: string) => void;
  removeCareer: (slug: string) => void;
  upsertTestimonial: (testimonial: Testimonial, index?: number) => void;
  removeTestimonial: (index: number) => void;
  upsertAward: (award: Award, index?: number) => void;
  removeAward: (index: number) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  removeInquiry: (id: string) => void;
  updateApplicationStatus: (id: string, status: JobApplication["status"]) => void;
  updateSettings: (settings: SiteSettings) => void;
  makeSlug: (value: string) => string;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreShape>(seedStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  const persist = useCallback((next: StoreShape) => {
    setStore(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const resetToSeed = useCallback(() => {
    persist(seedStore());
  }, [persist]);

  const upsertCity = useCallback(
    (city: City, originalSlug?: string) => {
      persist({
        ...store,
        cities: originalSlug
          ? store.cities.map((c) => (c.slug === originalSlug ? city : c))
          : [city, ...store.cities],
      });
    },
    [store, persist]
  );

  const removeCity = useCallback(
    (slug: string) => persist({ ...store, cities: store.cities.filter((c) => c.slug !== slug) }),
    [store, persist]
  );

  const upsertProject = useCallback(
    (project: Project, originalSlug?: string) => {
      persist({
        ...store,
        projects: originalSlug
          ? store.projects.map((p) => (p.slug === originalSlug ? project : p))
          : [project, ...store.projects],
      });
    },
    [store, persist]
  );

  const removeProject = useCallback(
    (slug: string) => persist({ ...store, projects: store.projects.filter((p) => p.slug !== slug) }),
    [store, persist]
  );

  const upsertService = useCallback(
    (service: Service, originalSlug?: string) => {
      persist({
        ...store,
        services: originalSlug
          ? store.services.map((s) => (s.slug === originalSlug ? service : s))
          : [service, ...store.services],
      });
    },
    [store, persist]
  );

  const removeService = useCallback(
    (slug: string) => persist({ ...store, services: store.services.filter((s) => s.slug !== slug) }),
    [store, persist]
  );

  const upsertBlog = useCallback(
    (blog: Blog, originalSlug?: string) => {
      persist({
        ...store,
        blogs: originalSlug ? store.blogs.map((b) => (b.slug === originalSlug ? blog : b)) : [blog, ...store.blogs],
      });
    },
    [store, persist]
  );

  const removeBlog = useCallback(
    (slug: string) => persist({ ...store, blogs: store.blogs.filter((b) => b.slug !== slug) }),
    [store, persist]
  );

  const upsertCareer = useCallback(
    (career: CareerPost, originalSlug?: string) => {
      persist({
        ...store,
        careers: originalSlug
          ? store.careers.map((c) => (c.slug === originalSlug ? career : c))
          : [career, ...store.careers],
      });
    },
    [store, persist]
  );

  const removeCareer = useCallback(
    (slug: string) => persist({ ...store, careers: store.careers.filter((c) => c.slug !== slug) }),
    [store, persist]
  );

  const upsertTestimonial = useCallback(
    (testimonial: Testimonial, index?: number) => {
      const next = [...store.testimonials];
      if (index !== undefined) next[index] = testimonial;
      else next.unshift(testimonial);
      persist({ ...store, testimonials: next });
    },
    [store, persist]
  );

  const removeTestimonial = useCallback(
    (index: number) => persist({ ...store, testimonials: store.testimonials.filter((_, i) => i !== index) }),
    [store, persist]
  );

  const upsertAward = useCallback(
    (award: Award, index?: number) => {
      const next = [...store.awards];
      if (index !== undefined) next[index] = award;
      else next.unshift(award);
      persist({ ...store, awards: next });
    },
    [store, persist]
  );

  const removeAward = useCallback(
    (index: number) => persist({ ...store, awards: store.awards.filter((_, i) => i !== index) }),
    [store, persist]
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: InquiryStatus) =>
      persist({ ...store, inquiries: store.inquiries.map((i) => (i.id === id ? { ...i, status } : i)) }),
    [store, persist]
  );

  const removeInquiry = useCallback(
    (id: string) => persist({ ...store, inquiries: store.inquiries.filter((i) => i.id !== id) }),
    [store, persist]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: JobApplication["status"]) =>
      persist({ ...store, applications: store.applications.map((a) => (a.id === id ? { ...a, status } : a)) }),
    [store, persist]
  );

  const updateSettings = useCallback(
    (settings: SiteSettings) => persist({ ...store, settings }),
    [store, persist]
  );

  const value = useMemo<AdminDataContextValue>(
    () => ({
      ...store,
      ready,
      resetToSeed,
      upsertCity,
      removeCity,
      upsertProject,
      removeProject,
      upsertService,
      removeService,
      upsertBlog,
      removeBlog,
      upsertCareer,
      removeCareer,
      upsertTestimonial,
      removeTestimonial,
      upsertAward,
      removeAward,
      updateInquiryStatus,
      removeInquiry,
      updateApplicationStatus,
      updateSettings,
      makeSlug: slugify,
    }),
    [
      store,
      ready,
      resetToSeed,
      upsertCity,
      removeCity,
      upsertProject,
      removeProject,
      upsertService,
      removeService,
      upsertBlog,
      removeBlog,
      upsertCareer,
      removeCareer,
      upsertTestimonial,
      removeTestimonial,
      upsertAward,
      removeAward,
      updateInquiryStatus,
      removeInquiry,
      updateApplicationStatus,
      updateSettings,
    ]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}

export { makeId, slugify };
