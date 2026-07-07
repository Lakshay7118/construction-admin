"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch, getToken } from "./api";
import {
  type Award,
  type Blog,
  type CareerPost,
  type City,
  type Project,
  type ProjectStatus,
  type ProjectType,
  type Service,
  type Testimonial,
  type TimelineEntry,
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

type WithId<T> = T & { _id?: string; id?: string };

export type InquiryStatus = "new" | "in-progress" | "closed";

export interface Inquiry {
  _id?: string;
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
  _id?: string;
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
  _id?: string;
  id?: string;
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

interface StoreShape {
  cities: WithId<City>[];
  projects: WithId<Project>[];
  services: WithId<Service>[];
  blogs: WithId<Blog>[];
  careers: WithId<CareerPost>[];
  testimonials: WithId<Testimonial>[];
  awards: WithId<Award>[];
  inquiries: Inquiry[];
  applications: JobApplication[];
  users: AdminUser[];
  settings: SiteSettings;
}

const emptySettings: SiteSettings = {
  companyName: "Kalpataru Constructions",
  tagline: "Building What Lasts",
  supportEmail: "",
  supportPhone: "",
  address: "",
  instagram: "",
  linkedin: "",
  facebook: "",
  maintenanceMode: false,
};

const emptyStore: StoreShape = {
  cities: [],
  projects: [],
  services: [],
  blogs: [],
  careers: [],
  testimonials: [],
  awards: [],
  inquiries: [],
  applications: [],
  users: [],
  settings: emptySettings,
};

function idOf(item: { _id?: string; id?: string }) {
  return item._id ?? item.id ?? "";
}

function withClientId<T extends { _id?: string; id?: string }>(items: T[]) {
  return items.map((item) => ({ ...item, id: item.id ?? item._id ?? "" }));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface AdminDataContextValue extends StoreShape {
  ready: boolean;
  resetToSeed: () => void;
  refresh: () => Promise<void>;
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
  const [store, setStore] = useState<StoreShape>(emptyStore);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const hasToken = Boolean(getToken());
    const [
      citiesData,
      projectsData,
      servicesData,
      blogsData,
      careersData,
      testimonialsData,
      awardsData,
      inquiriesData,
      applicationsData,
      settingsData,
      usersData,
    ] = await Promise.all([
      apiFetch<{ cities: WithId<City>[] }>("/cities", { auth: false }),
      apiFetch<{ projects: WithId<Project>[] }>("/projects", { auth: false }),
      apiFetch<{ services: WithId<Service>[] }>("/services", { auth: false }),
      apiFetch<{ blogs: WithId<Blog>[] }>("/blogs", { auth: false }),
      apiFetch<{ careers: WithId<CareerPost>[] }>("/careers", { auth: false }),
      apiFetch<{ testimonials: WithId<Testimonial>[] }>("/testimonials", { auth: false }),
      apiFetch<{ awards: WithId<Award>[] }>("/awards", { auth: false }),
      hasToken ? apiFetch<{ inquiries: Inquiry[] }>("/inquiries").catch(() => ({ inquiries: [] })) : Promise.resolve({ inquiries: [] }),
      hasToken ? apiFetch<{ applications: JobApplication[] }>("/careers/applications/all").catch(() => ({ applications: [] })) : Promise.resolve({ applications: [] }),
      apiFetch<{ settings: SiteSettings }>("/settings", { auth: false }).catch(() => ({ settings: emptySettings })),
      hasToken ? apiFetch<{ users: AdminUser[] }>("/auth/users").catch(() => ({ users: [] })) : Promise.resolve({ users: [] }),
    ]);

    setStore({
      cities: withClientId(citiesData.cities),
      projects: withClientId(projectsData.projects),
      services: withClientId(servicesData.services),
      blogs: withClientId(blogsData.blogs),
      careers: withClientId(careersData.careers),
      testimonials: withClientId(testimonialsData.testimonials),
      awards: withClientId(awardsData.awards),
      inquiries: withClientId(inquiriesData.inquiries),
      applications: withClientId(applicationsData.applications),
      settings: { ...emptySettings, ...settingsData.settings },
      users: withClientId(usersData.users),
    });
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const runAndRefresh = useCallback(
    async (task: () => Promise<unknown>) => {
      await task();
      await refresh();
    },
    [refresh]
  );

  const upsertCity = useCallback((city: City, originalSlug?: string) => {
    void runAndRefresh(() =>
      originalSlug
        ? apiFetch(`/cities/${originalSlug}`, { method: "PUT", body: JSON.stringify(city) })
        : apiFetch("/cities", { method: "POST", body: JSON.stringify(city) })
    );
  }, [runAndRefresh]);

  const removeCity = useCallback((slug: string) => {
    void runAndRefresh(() => apiFetch(`/cities/${slug}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const upsertProject = useCallback((project: Project, originalSlug?: string) => {
    void runAndRefresh(() =>
      originalSlug
        ? apiFetch(`/projects/${originalSlug}`, { method: "PUT", body: JSON.stringify(project) })
        : apiFetch("/projects", { method: "POST", body: JSON.stringify(project) })
    );
  }, [runAndRefresh]);

  const removeProject = useCallback((slug: string) => {
    void runAndRefresh(() => apiFetch(`/projects/${slug}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const upsertService = useCallback((service: Service, originalSlug?: string) => {
    void runAndRefresh(() =>
      originalSlug
        ? apiFetch(`/services/${originalSlug}`, { method: "PUT", body: JSON.stringify(service) })
        : apiFetch("/services", { method: "POST", body: JSON.stringify(service) })
    );
  }, [runAndRefresh]);

  const removeService = useCallback((slug: string) => {
    void runAndRefresh(() => apiFetch(`/services/${slug}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const upsertBlog = useCallback((blog: Blog, originalSlug?: string) => {
    void runAndRefresh(() =>
      originalSlug
        ? apiFetch(`/blogs/${originalSlug}`, { method: "PUT", body: JSON.stringify(blog) })
        : apiFetch("/blogs", { method: "POST", body: JSON.stringify(blog) })
    );
  }, [runAndRefresh]);

  const removeBlog = useCallback((slug: string) => {
    void runAndRefresh(() => apiFetch(`/blogs/${slug}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const upsertCareer = useCallback((career: CareerPost, originalSlug?: string) => {
    void runAndRefresh(() =>
      originalSlug
        ? apiFetch(`/careers/${originalSlug}`, { method: "PUT", body: JSON.stringify(career) })
        : apiFetch("/careers", { method: "POST", body: JSON.stringify(career) })
    );
  }, [runAndRefresh]);

  const removeCareer = useCallback((slug: string) => {
    void runAndRefresh(() => apiFetch(`/careers/${slug}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const upsertTestimonial = useCallback((testimonial: Testimonial, index?: number) => {
    const existing = index === undefined ? undefined : store.testimonials[index];
    const existingId = existing ? idOf(existing) : "";
    void runAndRefresh(() =>
      existingId
        ? apiFetch(`/testimonials/${existingId}`, { method: "PUT", body: JSON.stringify(testimonial) })
        : apiFetch("/testimonials", { method: "POST", body: JSON.stringify(testimonial) })
    );
  }, [runAndRefresh, store.testimonials]);

  const removeTestimonial = useCallback((index: number) => {
    const existingId = idOf(store.testimonials[index] ?? {});
    if (!existingId) return;
    void runAndRefresh(() => apiFetch(`/testimonials/${existingId}`, { method: "DELETE" }));
  }, [runAndRefresh, store.testimonials]);

  const upsertAward = useCallback((award: Award, index?: number) => {
    const existing = index === undefined ? undefined : store.awards[index];
    const existingId = existing ? idOf(existing) : "";
    void runAndRefresh(() =>
      existingId
        ? apiFetch(`/awards/${existingId}`, { method: "PUT", body: JSON.stringify(award) })
        : apiFetch("/awards", { method: "POST", body: JSON.stringify(award) })
    );
  }, [runAndRefresh, store.awards]);

  const removeAward = useCallback((index: number) => {
    const existingId = idOf(store.awards[index] ?? {});
    if (!existingId) return;
    void runAndRefresh(() => apiFetch(`/awards/${existingId}`, { method: "DELETE" }));
  }, [runAndRefresh, store.awards]);

  const updateInquiryStatus = useCallback((id: string, status: InquiryStatus) => {
    void runAndRefresh(() => apiFetch(`/inquiries/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }));
  }, [runAndRefresh]);

  const removeInquiry = useCallback((id: string) => {
    void runAndRefresh(() => apiFetch(`/inquiries/${id}`, { method: "DELETE" }));
  }, [runAndRefresh]);

  const updateApplicationStatus = useCallback((id: string, status: JobApplication["status"]) => {
    void runAndRefresh(() => apiFetch(`/careers/applications/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }));
  }, [runAndRefresh]);

  const updateSettings = useCallback((settings: SiteSettings) => {
    void runAndRefresh(() => apiFetch("/settings", { method: "PUT", body: JSON.stringify(settings) }));
  }, [runAndRefresh]);

  const value = useMemo<AdminDataContextValue>(() => ({
    ...store,
    ready,
    resetToSeed: refresh,
    refresh,
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
  }), [
    store,
    ready,
    refresh,
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
  ]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}

export { makeId, slugify };
