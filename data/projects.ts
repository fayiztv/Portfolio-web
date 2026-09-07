export interface Project {
  id: string;
  number: string;
  name: string;
  shortDescription: string;
  role: string;
  technologies: string[];
  context: string;
  whatIBuilt: string;
  notableFeatures: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  slug: string;
}

export const projects: Project[] = [
  {
    id: "proj-marsell-erp",
    number: "01",
    name: "Marsell ERP",
    shortDescription: "A production enterprise ERP system for managing employees, departments, clients, and support tickets.",
    role: "Full Stack Software Engineer",
    technologies: [
      "React",
      "TypeScript",
      "Firebase",
      "Firestore",
      "Cloud Functions",
      "Tailwind CSS",
      "TanStack Query",
      "Zustand",
      "Zod",
    ],
    context: "Internal enterprise product requiring strict access controls and scalable data management.",
    whatIBuilt:
      "Designed and implemented a secure three-role access control system (Admin, Manager, Employee) using Firebase Authentication, Custom Claims, Firestore Security Rules, and department-based permissions. Built scalable modules for employee management, departments, clients, ticket lifecycle, approval workflows, dashboards, and application settings using reusable architecture patterns. Built backend Cloud Functions for user provisioning, department access management, deletion approval workflows, and Firestore data sync with denormalized document structures.",
    notableFeatures: [
      "Cursor-based pagination for performance",
      "Centralized state management with Zustand",
      "Schema validation with Zod",
      "RBAC down to department level",
    ],
    images: [""],
    githubUrl: "https://github.com/fayiztv/marsell-erp",
    liveUrl: "https://marsell-qa.vercel.app/",
    slug: "marsell-erp",
  },
  {
    id: "proj-your-store",
    number: "02",
    name: "Your Store SaaS",
    shortDescription: "A configurable, white-label e-commerce SaaS platform enabling independent branded storefront deployments.",
    role: "Founder & Full Stack Developer",
    technologies: ["React", "Firebase", "Cloudinary"],
    context: "SaaS platform designed for rapid client onboarding from a single reusable codebase.",
    whatIBuilt:
      "Full admin dashboard for managing products, categories, variants, inventory, banners, branding, and SEO configuration. Flexible product variant management, Cloudinary media storage, WhatsApp-first ordering workflows, and configurable customer order forms. Secure Firebase Authentication with password reset and email verification. Modular architecture using reusable components and custom hooks for rapid client onboarding.",
    notableFeatures: [
      "White-label storefront deployment capability",
      "WhatsApp-first ordering workflow",
      "Dynamic branding configuration",
    ],
    images: [""],
    githubUrl: "https://github.com/fayiztv/your-store",
    liveUrl: "https://demo-store-in.vercel.app/",
    slug: "your-store-saas",
  },
  {
    id: "proj-onmyway",
    number: "03",
    name: "OnmyWay",
    shortDescription: "A full-stack MERN travel booking platform for browsing, booking, and managing travel packages.",
    role: "Full Stack Developer (personal project)",
    technologies: [
      "MongoDB",
      "Express.js",
      "React",
      "Node.js",
      "Socket.IO",
      "Cloudinary",
      "Nodemailer",
      "JWT",
      "AWS EC2",
      "Nginx",
      "PM2",
    ],
    context: "Travel package booking platform bridging travelers and local guides with real-time communication.",
    whatIBuilt:
      "Secure JWT-based auth with role-based access for users, guides, and administrators. Real-time messaging between travelers and guides via Socket.IO. Cloudinary media uploads, Nodemailer email notifications. Deployed on AWS EC2 with Nginx, PM2, and Route53 in a production deployment pipeline.",
    notableFeatures: [
      "Role-based access (Users, Guides, Admins)",
      "Real-time WebSocket messaging",
      "Production deployment pipeline on AWS EC2",
    ],
    images: ["/placeholder-onmyway-1.jpg", "/placeholder-onmyway-2.jpg"],
    githubUrl: "https://github.com/fayiztv/om-way",
    liveUrl: "https://omway.netlify.app/",
    slug: "onmyway",
  },
];
