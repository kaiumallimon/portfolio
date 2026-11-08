import mongoose, { Schema, Document, Model } from "mongoose";

// 1. User Model (for Passport.js Auth)
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Kaium Al Limon" },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

// 2. Project Model
export interface IProject extends Document {
  title: string;
  name?: string;
  slug: string;
  summary: string;
  short_details?: string;
  description?: string;
  coverImage?: string;
  tags: string[];
  technologies?: string[];
  demoUrl?: string;
  live_url?: string;
  githubUrl?: string;
  github_url?: string;
  stars?: number;
  forks?: number;
  featured: boolean;
  order: number;
  client?: "web" | "mobile" | string;
  category: "Full-Stack" | "Mobile" | "Tools" | "Open Source" | "Web";
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true },
    short_details: { type: String },
    description: { type: String },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    demoUrl: { type: String },
    live_url: { type: String },
    githubUrl: { type: String },
    github_url: { type: String },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    client: { type: String },
    category: { type: String, default: "Web" },
  },
  { timestamps: true }
);

// 3. Experience Model
export interface IExperience extends Document {
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  period: string;
  description: string;
  highlights: string[];
  current: boolean;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    companyUrl: { type: String },
    location: { type: String },
    period: { type: String, required: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 4. Skill Model
export interface ISkill extends Document {
  name: string;
  category: "Languages" | "Frontend" | "Backend" | "DevOps & Cloud" | "Mobile";
  level?: string;
  featured: boolean;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 5. Site Settings Model
export interface ISiteSettings extends Document {
  name: string;
  title: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  availableForHire: boolean;
  statusText: string;
  githubUrl: string;
  githubUsername?: string;
  linkedinUrl: string;
  twitterUrl?: string;
  facebookUrl?: string;
  resumeUrl?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    name: { type: String, default: "Kaium Al Limon" },
    title: { type: String, default: "Full-Stack & Design Engineer" },
    headline: { type: String, default: "Building high-precision web, mobile & distributed systems." },
    bio: { type: String, default: "Computer Science student at UIU. Passionate about software craftsmanship, minimal design, and scalable architecture." },
    email: { type: String, default: "kaiumallimon@gmail.com" },
    location: { type: String, default: "Dhaka, Bangladesh" },
    timezone: { type: String, default: "Asia/Dhaka" },
    availableForHire: { type: Boolean, default: true },
    statusText: { type: String, default: "Available for engineering roles" },
    githubUrl: { type: String, default: "https://github.com/kaiumallimon" },
    linkedinUrl: { type: String, default: "https://linkedin.com/in/kaiumallimon" },
    twitterUrl: { type: String, default: "https://x.com/kaiumallimon" },
    resumeUrl: { type: String, default: "/resume.pdf" },
  },
  { timestamps: true }
);

// 6. Message Model
export interface IMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export const Experience: Model<IExperience> = mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
export const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
export const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
