import { Briefcase, Cpu, Network, PackageCheck, type LucideIcon } from "lucide-react";
import tech from "@/assets/division-technology.jpg";
import biz from "@/assets/division-business.jpg";
import infra from "@/assets/division-infrastructure.jpg";
import proc from "@/assets/division-procurement.jpg";

export type Division = { id: string; no: string; title: string; summary: string; icon: LucideIcon; image: string; alt: string; services: string[] };

export const DIVISIONS: Division[] = [
  { id: "technology", no: "01", title: "Technology & Digital Solutions", icon: Cpu, image: tech,
    alt: "Software developers reviewing code and dashboards on large monitors",
    summary: "Software, systems and digital tools that help organisations work faster and see their operations clearly.",
    services: ["Software and business systems development", "IT infrastructure and networking", "Digital transformation", "Workflow automation", "IT asset and inventory management", "Systems integration", "Technology consultancy"] },
  { id: "business", no: "02", title: "Business & Enterprise Solutions", icon: Briefcase, image: biz,
    alt: "Consultants mapping a business workflow on a glass wall",
    summary: "Practical improvements to the processes, workflows and systems that keep an organisation running.",
    services: ["Business process improvement", "Operational efficiency solutions", "Enterprise systems", "Business workflow design", "Technical consultancy", "Organisational support solutions"] },
  { id: "infrastructure", no: "03", title: "Infrastructure & Technical Services", icon: Network, image: infra,
    alt: "Technician organising network cabling in a server rack",
    summary: "Planning, installing and maintaining the networks and equipment your teams rely on every day.",
    services: ["Network infrastructure", "ICT equipment installation and configuration", "Office technology infrastructure", "Systems maintenance", "Technical support", "Infrastructure assessment"] },
  { id: "procurement", no: "04", title: "Procurement & Commercial Supply", icon: PackageCheck, image: proc,
    alt: "Boxed ICT equipment neatly arranged on warehouse shelves",
    summary: "Reliable sourcing of ICT and institutional equipment, matched to your specifications and timelines.",
    services: ["ICT equipment and accessories", "Office and institutional equipment", "Strategic sourcing", "General commercial procurement", "Supply chain support"] },
];

export const INDUSTRIES = [
  { title: "Corporate organisations", text: "Systems, infrastructure and supply that support growing operations." },
  { title: "NGOs and development organisations", text: "Dependable technology and sourcing for programme delivery." },
  { title: "Government and public institutions", text: "Compliant, well-documented engagements for public bodies." },
  { title: "SMEs and growing businesses", text: "Right-sized solutions that scale as the business grows." },
  { title: "Educational institutions", text: "ICT environments and equipment for learning and administration." },
  { title: "Technology-driven enterprises", text: "Integration, automation and infrastructure partners." },
];

export const SERVICE_OPTIONS = [...DIVISIONS.map((d) => d.title), "NEXORA (product in development)", "Partnership or proposal", "Other"];
