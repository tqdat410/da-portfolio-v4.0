/**
 * Portfolio Content - Centralized TypeScript content for single-language portfolio
 * Replaces next-intl i18n with direct typed content access
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NavigationContent {
  home: string;
  about: string;
  projects: string;
  contact: string;
  mainNavigation: string;
}

export interface HeroContent {
  greeting: string;
  name: string;
  role: string;
  description: string;
  cta: string;
  status: string;
  downloadCv: string;
  resumeUrl: string;
}

export interface BasicInfoContent {
  title: string;
  locationLabel: string;
  languagesLabel: string;
  statusLabel: string;
  location: string;
  email: string;
  languages: string;
  status: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
  gpa: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface SkillCategories {
  backend: SkillCategory;
  frontend: SkillCategory;
  database: SkillCategory;
  tools: SkillCategory;
  others: SkillCategory;
}


export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface CertificateItem {
  name: string;
  provider: string;
  url: string;
}

export interface CertificateGroup {
  name: string;
  issuer: string;
  count: number;
  items: CertificateItem[];
}

export interface AboutContent {
  title: string;
  name: string;
  description: string;
  dob: string;
  role: string;
  basicInfo: BasicInfoContent;
  education: {
    title: string;
    items: EducationItem[];
    certifications: { label: string }[];
  };
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  skills: {
    title: string;
    categories: SkillCategories;
  };
  certificates: {
    title: string;
    items: CertificateGroup[];
  };
}

// Generic link type for flexible use
export interface ProjectLink {
  label: string;
  url: string;
  icon?: "github" | "demo" | "docs" | "video" | "external";
}

export interface ProjectHistory {
  version: string;
  description: string;
  techStack: string[];
  links?: ProjectLink[];
  image?: string;
}

export type ProjectCategory = "SAP" | "Startup" | "University Course Projects" | "Personal / Creative Side Projects";

export interface ProjectItem {
  category: ProjectCategory;
  title: string;
  tagline: string;
  overview: string;
  image: string;
  listImage?: string;
  type: string;
  duration: string;
  teamSize: number;
  role: string;
  techStack: string[];
  fullTechStack: string[];
  keyFeatures: string[];
  responsibilities: string[];
  architecture?: string;
  results?: string[];
  learning: string;
  history?: ProjectHistory[];
  status: "Live" | "Active" | "Completed" | "In Progress" | "Archived" | "Stopped";
  links: ProjectLink[];
}

export interface ProjectsContent {
  title: string;
  viewProject: string;
  items: ProjectItem[];
}

// Showcase items for bento grid (separate from project items)
export interface ShowcaseItem {
  category: ProjectCategory;
  title: string;
  description: string;
  techStack: string[];
  mainImage: string;
  secondaryImage: string;
}

export interface ShowcaseContent {
  items: ShowcaseItem[];
}

export interface ContactContent {
  title: string;
  description: string;
  emailLabel: string;
  phoneLabel: string;
  cta: string;
  email: string;
  phone: string;
  linktree: string;
}

export interface SocialLinks {
  github: string;
  gmail: string;
  linkedin: string;
  facebook: string;
  x: string;
  youtube: string;
  instagram: string;
  zalo: string;
  telegram: string;
  upwork: string;
  reddit: string;
  discord: string;
}

export interface ProjectPopupLabels {
  overview: string;
  role: string;
  learning: string;
  technologies: string;
  type: string;
  status: string;
  duration: string;
  viewSource: string;
  close: string;
}

export interface CommonContent {
  loading: string;
}

export interface PortfolioContent {
  navigation: NavigationContent;
  common: CommonContent;
  hero: HeroContent;
  roles: string[];
  about: AboutContent;
  projects: ProjectsContent;
  showcase: ShowcaseContent;
  contact: ContactContent;
  social: SocialLinks;
  projectPopup: ProjectPopupLabels;
}

// ============================================================================
// CONTENT DATA
// ============================================================================

export const content: PortfolioContent = {
  navigation: {
    home: "Home",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    mainNavigation: "Main navigation",
  },

  common: {
    loading: "Loading Resources...",
  },

  hero: {
    greeting: "Welcome to my Portfolio",
    name: "Da'portfolio",
    role: "Feel free to explore and get to know me",
    description:
      "Experienced in building and deploying comprehensive Website and Mobile App systems. Additionally, I specialize in developing functionalities within SAP systems.",
    cta: "View My Work",
    status: "Open to work",
    downloadCv: "Download CV",
    resumeUrl:
      "https://drive.google.com/file/d/19g_ROfEvfbbbLKG_qSlf_eoAeB0Ofvx0/view?usp=sharing",
  },

  // Roles for horizontal scroll animation
  roles: [
    "Software Engineer",
    "SAP Technical Consultant",
    "Fullstack Developer",
    "Creative Developer",
  ],

  about: {
    title: "About Me",
    name: "Tran Quoc Dat",
    description:
      "I am a final year Software Engineering student with a passion for building scalable applications. My main focus is on SAP Technical Consulting, but I also love working with modern web technologies like Next.js and React.",
    dob: "DoB: 2004-10-04",
    role: "Software Engineer",
    basicInfo: {
      title: "Basic Info",
      locationLabel: "Location",
      languagesLabel: "Languages",
      statusLabel: "Status",
      location: "Ho Chi Minh City, Vietnam",
      email: "dat.tran@example.com",
      languages: "Vietnamese, English",
      status: "Final-Year Student",
    },
    education: {
      title: "Education",
      items: [
        {
          school: "FPT University",
          degree: "Software Engineering",
          year: "2022 - 2026",
          gpa: "GPA: 3.6/4.0",
        },
      ],
      certifications: [
        { label: "On-Job Training Certificate" },
        { label: "FSOFT Testing Certificate" },
        { label: "Academic Prep. English" },
        { label: "9+ Coursera Certificates" },
        { label: "9+ Other Certificates" },
      ],

    },
    experience: {
      title: "Experience",
      items: [
        {
          company: "FPT Software",
          role: "OJT Trainee",
          period: "Jan 2025 - Apr 2025",
          description: "Intensive training program focused on SAP ABAP programming and enterprise resource planning systems.",
        },
      ],
    },
    skills: {
      title: "Skills",
      categories: {
        backend: {
          title: "Backend",
          items: [
            "ABAP",
            "SAP RAP",
            "OData",
            "Java",
            "SpringBoot",
            "MVC",
            "Monolith",
            "Microservices",
          ],
        },
        frontend: {
          title: "Frontend",
          items: [
            "ReactJS",
            "NextJS",
            "TypeScript",
            "JavaScript",
            "Fiori",
            "UI5",
            "Three.js",
            "Android",
          ],
        },
        database: {
          title: "Database",
          items: ["PostgreSQL", "MySQL", "MSSQL", "HANA", "MongoDB", "Redis", "QDrant", "Supabase"],
        },
        tools: {
          title: "Tools & DevOps",
          items: ["Docker", "Kafka", "CI/CD", "Git", "GitHub", "Cloudflare"],
        },
        others: {
          title: "AI Tools",
          items: [
            "Claude Code",
            "GitHub Copilot",
            "Cursor",
            "Antigravity",
            "Google AI Studio",
            "n8n",
            "Openrouter",
          ],
        },
      },
    },
    certificates: {
      title: "Certificates",
      items: [
        {
          name: "Coursera",
          issuer: "Coursera",
          count: 9,
          items: [
            {
              name: "Project Management Principles and Practices",
              provider: "University of California, Irvine",
              url: "https://coursera.org/share/e2d023039eb45b4e9a50acf98f951b86",
            },
            {
              name: "User Experience Research and Design",
              provider: "University of Michigan",
              url: "https://coursera.org/share/6b2d9b9df878b385e7882feb8553aa16",
            },
            {
              name: "Software Development Lifecycle",
              provider: "University of Minnesota",
              url: "https://coursera.org/share/0c5ed0fcbc8853284dbcc5535b212887",
            },
            {
              name: "CertNexus Certified Ethical Emerging Technologist",
              provider: "CertNexus",
              url: "https://coursera.org/share/2b5e52f9bf6d0a85af54636bca0dfc86",
            },
            {
              name: "Object Oriented Programming in Java",
              provider: "Duke University, University of California San Diego",
              url: "https://coursera.org/share/20dbf0f78491c8554f59c823e7c786b5",
            },
            {
              name: "Web Design for Everybody: Basics of Web Development & Coding",
              provider: "University of Michigan",
              url: "https://coursera.org/share/670a0cf0ceb2f23d41bbb3bffc382820",
            },
            {
              name: "Java Database Connectivity",
              provider: "LearnQuest",
              url: "https://coursera.org/share/a63ee360e3dff0215d6eedfd5076f79b",
            },
            {
              name: "Computer Communications",
              provider: "University of Colorado System",
              url: "https://coursera.org/share/174d8e8c079ba69a64d80c92da7b246d",
            },
            {
              name: "Academic Skills for University Success",
              provider: "The University of Sydney",
              url: "https://coursera.org/share/6dd89064482d892dd5f55cdab5850aa4",
            },
          ],
        },
        {
          name: "Other Certificates",
          issuer: "Various",
          count: 9,
          items: [
            {
              name: "Certificate on the Job Training",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/temp/9eb13e44-ad3b-4a10-a11b-3fa14e6a4b6c.pdf",
            },
            {
              name: "FSOFT Short Course for Testing",
              provider: "FPTU & FSoft",
              url: "",
            },
            {
              name: "Academic Preparatory English TRS601 - English 6",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/temp/13980879-6ea8-49a2-bb0d-a90eb33a382f.pdf",
            },
            {
              name: "Excellent Student of Trimester Summer 2025",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/Report/Awa.aspx?id=Q0OR9ETnUQo%3d",
            },
            {
              name: "Honorable Student of Trimester Fall 2024",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/Report/Awa.aspx?id=SwFA1lQTVp4%3d",
            },
            {
              name: "Honorable Student of Trimester Summer 2024",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/Report/Awa.aspx?id=nXcVymoDAeM%3d",
            },
            {
              name: "Excellent Student of Trimester Spring 2024",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/Report/Awa.aspx?id=k2VuWB4xnDY%3d",
            },
            {
              name: "Honorable Student of Trimester Fall 2023",
              provider: "FPT University",
              url: "https://fap.fpt.edu.vn/temp/c740e67a-bce7-481d-9b2f-747f7284a7e5.pdf",
            },
            {
              name: "Excellent Student of Trimester Summer 2023",
              provider: "FPT University",
              url: "",
            },
          ],
        },
      ],
    },
  },

  projects: {
    title: "Projects",
    viewProject: "View Project",
    items: [
      // ── SAP ──────────────────────────────────────────────────────────
      {
        category: "SAP",
        title: "Custom Notification Center",
        tagline: "Capstone project: Custom Notification Center for SAP S/4HANA with Fiori UI.",
        overview:
          "Capstone graduation project developing a Custom Notification Center within SAP S/4HANA. The system provides centralized notification management including bell icon with badge display, dropdown notification list, mark read/unread, delete, archive actions, and subscription settings for user preferences and delivery channel configuration. Includes a backend API for creating notifications directly from ABAP programs.",
        keyFeatures: [
          "Bell icon with badge and dropdown notification list",
          "Mark read/unread, delete, and archive notifications",
          "Subscription settings with delivery channel configuration",
          "Backend RESTful API for notification creation from ABAP",
          "Real-time updates via AMC/APC channels",
        ],
        techStack: ["ABAP", "SAP RAP", "Fiori"],
        fullTechStack: ["ABAP", "SAP RAP", "OData", "Fiori", "UI5", "HANA", "RESTful API", "AMC/APC", "Background Job"],
        role: "Team Leader (4 members): Led requirement analysis, architecture design, task management, progress tracking, documentation, testing, and reporting. Collaborated under FPT Software's supervision and quality standards.",
        responsibilities: [
          "Requirement analysis and technical research",
          "System architecture design",
          "Team progress and task management",
          "Documentation, testing, and reporting",
        ],
        type: "Enterprise / SAP",
        duration: "Jan 2026 - Apr 2026",
        teamSize: 4,
        status: "In Progress",
        learning:
          "Gained deep expertise in modern SAP technologies including AMC/APC for real-time communication, Fiori/UI5 frontend development, RAP framework, and working within enterprise standards set by FPT Software.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770468642/s1_bg8zlu.png",
        links: [],
      },

      // ── Startup ──────────────────────────────────────────────────────
      {
        category: "Startup",
        title: "Hengout",
        tagline: "AI-powered location recommendation app for GenZ, from concept to App Store.",
        overview:
          "A startup product awarded a 50M VND scholarship at FPT University. Hengout is a location recommendation app tailored for GenZ, leveraging AI to curate, filter, and synthesize venue information. It offers personalized suggestions based on individual preferences and a unique group consensus feature that recommends destinations suitable for multiple users. Built from concept to App Store launch as a comprehensive iOS app with a web landing page.",
        keyFeatures: [
          "AI-powered venue curation and personalized recommendations",
          "Group consensus feature for multi-user destination matching",
          "Real-time activity feeds via Kafka event streaming",
          "Location-based caching with Redis for fast responses",
          "Apple In-App Purchase integration",
          "Monitoring with Grafana dashboards",
        ],
        techStack: ["React Native", "Spring Boot", "AI"],
        fullTechStack: [
          "React Native",
          "Next.js",
          "Spring Boot",
          "PostgreSQL",
          "MongoDB",
          "OpenRouter",
          "Kafka",
          "Redis",
          "VPS",
          "Docker",
          "Microservices",
          "Apple IAP",
          "Grafana",
        ],
        role: "Tech Lead (6 members — 3 tech, 3 marketing): Led system architecture design, backend development, web app, CI/CD pipelines, server deployment, monitoring, AI and payment integration, data crawling, testing, and App Store submission.",
        responsibilities: [
          "System architecture design and technical decisions",
          "Backend development with Spring Boot microservices",
          "CI/CD pipeline setup and VPS deployment",
          "AI integration for recommendation engine",
          "Payment integration and App Store submission",
          "Server monitoring with Grafana",
        ],
        type: "Startup",
        duration: "6 months",
        teamSize: 6,
        status: "Stopped",
        results: [
          "Awarded 50 million VND scholarship at FPT University",
          "Successfully launched on the App Store",
          "Built a complete microservices architecture from scratch",
        ],
        learning:
          "Comprehensive startup experience spanning business ideation, financial management, and marketing alongside deep technical growth in microservices architecture, real-time event streaming, AI integration, mobile app deployment, and end-to-end product delivery.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146665/ho_app_eu3hr6.png",
        links: [
          { label: "Landing Page", url: "https://hengout.app", icon: "external" },
          { label: "App Store", url: "https://apps.apple.com/us/app/hengout/id6754825310", icon: "external" },
        ],
      },

      // ── University Course Projects ───────────────────────────────────
      {
        category: "University Course Projects",
        title: "Koi Vet. Center",
        tagline: "Full-featured veterinary management system for Koi fish healthcare.",
        overview:
          "A comprehensive management system for a Koi veterinary center. Core features include service information browsing, appointment scheduling, payment processing, staff work schedule management, medical examination records and treatment history, and system monitoring with administrative tools.",
        keyFeatures: [
          "Service catalog and appointment scheduling",
          "Payment processing and billing",
          "Medical records and treatment history tracking",
          "Staff work schedule management",
          "System monitoring and admin dashboard",
        ],
        techStack: ["ReactJS", "Spring Boot", "MySQL"],
        fullTechStack: ["ReactJS", "Spring Boot", "MySQL", "Github Actions", "Cloudinary", "AWS"],
        role: "Team Leader & Backend Lead (5 members): Led system architecture design, task assignment, progress management, and backend API development.",
        responsibilities: [
          "System architecture design",
          "Task assignment and team coordination",
          "Backend API development",
          "Progress tracking and code review",
        ],
        type: "University",
        duration: "3 months",
        teamSize: 5,
        status: "Archived",
        learning:
          "Strengthened problem-solving, leadership, and teamwork skills. Practiced system design for monolith architecture, database management, RESTful API development, and collaborative Git/GitHub workflows.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146664/koi_qacrdx.png",
        links: [
          { label: "Backend", url: "https://github.com/dattqse180062/koi-veterinary-service-center-BE", icon: "github" },
          { label: "Frontend", url: "https://github.com/dattqse180062/koi-veterinary-service-center-FE", icon: "github" },
        ],
      },
      {
        category: "University Course Projects",
        title: "Uni. Event Manager",
        tagline: "University event management platform with QR check-in and survey tools.",
        overview:
          "An event management and registration platform for university communities. Enables creation and management of upcoming campus events, event browsing and registration for attendees, QR code-based check-in/checkout, post-event survey creation and distribution, and result export for analysis.",
        keyFeatures: [
          "Event creation, publishing, and management",
          "Student registration and attendance tracking",
          "QR code-based check-in/checkout",
          "Post-event survey builder with distribution",
          "Result export and analytics",
        ],
        techStack: ["Spring Boot", "Next.js", "PostgreSQL"],
        fullTechStack: [
          "Spring Boot",
          "Next.js",
          "PostgreSQL",
          "Cloudinary",
          "VPS",
          "Docker",
          "CI/CD",
        ],
        role: "Team Leader & Fullstack Developer (5 members): Led system design, task management, team coordination, backend development, CI/CD setup, and server deployment.",
        responsibilities: [
          "System design and architecture decisions",
          "Backend development with Spring Boot",
          "CI/CD pipeline and Docker deployment",
          "Team coordination and progress tracking",
        ],
        type: "University",
        duration: "3 months",
        teamSize: 5,
        status: "Archived",
        learning:
          "Mastered new technologies including PostgreSQL, Docker containerization, CI/CD pipelines, VPS deployment, and elevated system design capabilities alongside leadership and teamwork skills.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146663/event_pzqhw3.png",
        links: [
          { label: "Backend", url: "https://github.com/dattqse180062/EventManagement-BE", icon: "github" },
        ],
      },
      {
        category: "University Course Projects",
        title: "AI Quick Note",
        tagline: "AI-powered Android note-taking app with smart categorization and RAG retrieval.",
        overview:
          "An Android mobile application for quick note-taking with support for multiple input formats. Integrates AI for automatic note categorization and RAG (Retrieval-Augmented Generation) for rapid information retrieval from saved notes via an intelligent chatbot.",
        keyFeatures: [
          "Multi-format note input (text, voice, image)",
          "AI-powered automatic note categorization",
          "RAG-based information retrieval chatbot",
          "Semantic search across all notes",
          "Real-time sync via WebSocket",
        ],
        techStack: ["Android", "Spring Boot", "AI"],
        fullTechStack: [
          "Android",
          "Java",
          "Spring Boot",
          "PostgreSQL",
          "Redis",
          "OpenRouter",
          "VPS",
          "Docker",
          "CI/CD",
          "Semantic Search",
          "WebSocket",
        ],
        role: "Team Leader & Backend Developer (5 members): Led system architecture, task management, progress tracking, and backend development with AI integration.",
        responsibilities: [
          "System architecture design",
          "Backend development with Spring Boot",
          "AI and semantic search integration",
          "Team coordination and task management",
        ],
        type: "University",
        duration: "2 months",
        teamSize: 5,
        status: "Archived",
        learning:
          "First exposure to mobile app development. Gained hands-on experience integrating AI into a production product, implementing semantic search with vector databases, and deepening leadership and teamwork capabilities.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146664/android_jj7kcd.png",
        links: [
          { label: "Backend", url: "https://github.com/tqdat410/DaNoteskeeper", icon: "github" },
          { label: "Mobile", url: "https://github.com/tqdat410/DaNoteskeeperAndroid", icon: "github" },
        ],
      },

      // ── Personal / Creative Side Projects ────────────────────────────
      {
        category: "Personal / Creative Side Projects",
        title: "Da'Portfolio",
        tagline: "My personal digital garden and creative playground",
        overview: "My personal portfolio website serves not only to update information about myself, skills, and projects but also as a playground to experiment with new technologies, tools, and creativity. I wanted a space that truly represents my journey and technical capabilities, evolving alongside my skills. Traditional CVs are static and limited, so I needed a dynamic platform to showcase my work and demonstrate my coding abilities in real-time. The solution is a continuously evolving web application that integrates modern web technologies and 3D elements to create an engaging user experience.",
        keyFeatures: [
          "Interactive 3D Elements with Three.js",
          "Responsive and Accessible Design",
          "Dynamic Content Management",
          "Performance Optimized",
          "Clean & Modern UI/UX",
        ],
        responsibilities: [
          "Designed and developed the entire application from scratch",
          "Integrated 3D graphics and animations",
          "Optimized performance and SEO",
          "Managed deployment and CI/CD pipelines",
        ],
        architecture: "Built with Next.js for SSR/SSG, tailored with TailwindCSS for styling, and enhanced with Three.js (React Three Fiber) for 3D visuals.",
        results: [
          "Successfully deployed and maintained 4 major versions",
          "Learned and applied advanced frontend techniques including WebGL",
          "Created a central hub for all my professional links and projects",
        ],
        type: "Personal",
        duration: "1 Week",
        teamSize: 1,
        role: "Owner & Developer",
        techStack: ["Next.js", "React", "Three.js", "TailwindCSS", "TypeScript"],
        fullTechStack: ["Next.js", "React", "Three.js", "React Three Fiber", "TailwindCSS", "Framer Motion", "TypeScript"],
        learning: "Practicing the latest AI tools (Claude Code, Antigravity) and fostering creativity through design and implementation.",
        status: "Live",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770523200/screencapture-localhost-3000-2026-02-08-10_55_50_mfwvad.png",
        listImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770524787/logo_dqecsp.png",
        links: [
          { label: "Visit", url: "https://tranquocdat.com/", icon: "external" },
          { label: "Source Code", url: "https://github.com/tqdat410/da-portfolio-v4.0", icon: "github" },
        ],
        history: [
          {
            version: "v1",
            description: "The first personal website, focused on displaying basic information. Simple, clean interface, marking the first step into Frontend development.",
            techStack: ["ReactJS", "TailwindCSS", "Github Pages"],
            links: [
              { label: "Source Code", url: "https://github.com/tqdat410/portfolio-tranquocdat", icon: "github" },
              { label: "Visit", url: "https://tqdat410.github.io/portfolio-tranquocdat/", icon: "external" },
            ],
          },
          {
            version: "v2",
            description: "Upgraded version integrating Backend to manage dynamic content. Improved design with more vivid interactive effects. Mastered Spring Boot, RESTful API, Frontend-Backend connection, and deployment process with free services.",
            techStack: ["ReactJS", "Spring Boot", "MySQL", "Cloudinary", "Netlify", "Render", "UptimeRobot"],
            links: [
              { label: "Source Code BE", url: "https://github.com/tqdat410/dattq-be", icon: "github" },
              { label: "Source Code FE", url: "https://github.com/tqdat410/dattq-fe", icon: "github" },
            ],
          },
          {
            version: "v3",
            description: "Version with a modern interface, using Next.js and Three.js to create unique 3D experiences and powerful interactive effects. Enhanced UI/UX design thinking, WebGL/Three.js skills, 3D performance optimization, and applying AI to the coding process.",
            techStack: ["Next.js", "React", "Three Fiber", "TailwindCSS", "Framer Motion", "TypeScript", "Cloudinary", "Cloudflare"],
            links: [
              { label: "Source Code", url: "https://github.com/tqdat410/da-portfolio-v3", icon: "github" },
              { label: "Visit", url: "https://da-portfolio-v3.pages.dev/en", icon: "external" },
            ],
          },
        ],
      },
      {
        category: "Personal / Creative Side Projects",
        title: "Balance of Interest",
        tagline: "Interactive simulation exploring the concept of 'Interest' in society.",
        overview:
          "A creative product for a Development Philosophy course, simulating the balance of interests within society. Developed entirely solo and recognized by the lecturer for its quality, subsequently adopted as official course material. AI tools were integral throughout development — NotebookLM for research, GitHub Copilot for agentic coding assistance, and Gemini for image generation.",
        keyFeatures: [
          "Interactive simulation of societal interest dynamics",
          "AI-assisted research and development workflow",
          "Adopted as official university course material",
        ],
        techStack: ["Next.js", "Supabase"],
        fullTechStack: ["Next.js", "TypeScript", "Supabase", "TailwindCSS", "Cloudflare"],
        role: "Owner & Solo Developer: Conceptualized, designed, and built the entire project independently.",
        responsibilities: [
          "Full project conceptualization and design",
          "Frontend and backend development",
          "AI-assisted content research and creation",
        ],
        type: "Personal",
        duration: "3 days",
        teamSize: 1,
        status: "Live",
        results: [
          "Highly praised by lecturer for quality and creativity",
          "Adopted as official university course material",
        ],
        learning:
          "Game logic design thinking, creative content production, and applying economic concepts to interactive technology products.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770437300/screencapture-boi-hengout-app-2026-02-07-11_04_52_htuojh.png",
        links: [
          { label: "Visit", url: "https://boi.hengout.app/", icon: "external" },
          { label: "Source Code", url: "https://github.com/tqdat410/balance-of-interests", icon: "github" },
        ],
      },
      {
        category: "Personal / Creative Side Projects",
        title: "Social Revolution",
        tagline: "Interactive simulation of socio-economic formation processes.",
        overview:
          "A creative product for a Development Philosophy course, simulating the characteristics and formation process of socio-economic formations. Built solo and highly praised by the lecturer, later adopted as official course material. AI tools powered the entire workflow — NotebookLM for research, GitHub Copilot for coding, and Gemini for visuals.",
        keyFeatures: [
          "Simulation of socio-economic formation stages",
          "AI-driven research and development pipeline",
          "Adopted as official university course material",
        ],
        techStack: ["Next.js"],
        fullTechStack: ["Next.js", "TailwindCSS", "TypeScript", "Cloudflare", "Vibe Coding"],
        role: "Owner & Solo Developer: Designed game logic, wrote content scripts, and integrated AI tooling for the full development cycle.",
        responsibilities: [
          "Game logic design and content scripting",
          "Full-stack development",
          "AI tool integration for research and coding",
        ],
        type: "Personal",
        duration: "1 week",
        teamSize: 1,
        status: "Live",
        results: [
          "Highly praised by lecturer for quality and creativity",
          "Adopted as official university course material",
        ],
        learning:
          "Educational content creation, game logic programming, and leveraging AI coding tools to accelerate development velocity.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146662/game1_atnqip.png",
        links: [
          { label: "Visit", url: "https://sr.hengout.app/", icon: "external" },
          { label: "Source Code", url: "https://github.com/tqdat410/social-revolution", icon: "github" },
        ],
      },
      {
        category: "Personal / Creative Side Projects",
        title: "Debate 1911",
        tagline: "AI-powered debate game exploring Ho Chi Minh era historical perspectives.",
        overview:
          "A creative product for a Ho Chi Minh Ideology course. Built in just 2 days, this app uses AI to enable users to debate opposing viewpoints on a historical issue. The backend leverages n8n workflows and OpenRouter API for AI-driven argument generation. AI tools supported the entire process — NotebookLM for research, GitHub Copilot for coding, and Gemini for imagery.",
        keyFeatures: [
          "AI-powered debate with dynamic argument generation",
          "n8n + OpenRouter API backend integration",
          "Built in 2 days as a rapid prototype",
        ],
        techStack: ["Next.js", "AI"],
        fullTechStack: ["Next.js", "TypeScript", "TailwindCSS", "n8n", "OpenRouter API"],
        role: "Owner & Solo Developer: End-to-end development from concept to deployment.",
        responsibilities: [
          "Full project development in 2-day sprint",
          "AI backend integration with n8n and OpenRouter",
          "Historical content research and design",
        ],
        type: "Personal",
        duration: "2 days",
        teamSize: 1,
        status: "Archived",
        learning:
          "Rapid prototyping with AI integration, workflow automation with n8n, and historical narrative design for interactive applications.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770543499/screencapture-debate1911-hengout-app-2026-02-08-16_36_18_ftr1bw.png",
        links: [
          { label: "Source Code", url: "https://github.com/tqdat410/debate-1911", icon: "github" },
        ],
      },
      {
        category: "Personal / Creative Side Projects",
        title: "Industrial Revolution",
        tagline: "360-degree virtual museum showcasing industrial revolution eras.",
        overview:
          "A virtual 360-degree museum experience simulating different industrial revolution periods. This was the first project involving Three.js, creating an immersive learning environment. AI tools powered the development — NotebookLM for research, GitHub Copilot for coding, and Gemini for imagery.",
        keyFeatures: [
          "Immersive 360-degree virtual museum environment",
          "Three.js-powered 3D web experience",
          "First hands-on project with WebGL/Three.js",
        ],
        techStack: ["HTML", "Three.js"],
        fullTechStack: ["HTML", "Three.js", "Netlify"],
        role: "Creative Developer: Conceptualized the 3D museum space, designed the interactive interface, and developed the VR-like experience.",
        responsibilities: [
          "3D museum space conceptualization",
          "Three.js development and 360° experience",
          "Graphic resource optimization",
        ],
        type: "Personal",
        duration: "2 days",
        teamSize: 1,
        status: "Archived",
        learning:
          "First exposure to Three.js and 3D web development, VR/360 experience creation, and graphic resource optimization for the web.",
        image: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764168364/ar_v7tm8y.png",
        links: [
          { label: "Source Code", url: "https://github.com/tqdat410/360-revolution", icon: "github" },
        ],
      },
    ],
  },

  // Showcase items for bento grid display
  showcase: {
    items: [
      {
        category: "SAP",
        title: "Custom Notification Center Fiori Application",
        description: "Graduation Project building a Custom Notification Center within SAP S/4 HANA, featuring core notification management and RESTful APIs for seamless integration. Led the team as Project Leader.",
        techStack: ["ABAP", "SAP RAP", "Fiori", "UI5", "OData", "HANA", "RESTful API"],
        mainImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770468642/s1_bg8zlu.png",
        secondaryImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770468643/s2_yyuzda.png",
      },
      {
        category: "Startup",
        title: "Hengout - Location Recommendation App",
        description: "My first startup journey, awarded 50 million VND in scholarship funding. Built a full-stack location recommendation platform from concept to App Store launch. Served as Tech Lead.",
        techStack: ["React Native", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "Kafka", "Microservices", "Docker", "AI"],
        mainImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146665/ho_app_eu3hr6.png",
        secondaryImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764146664/ho_web_rm5o1v.png",
      },
      {
        category: "University Course Projects",
        title: "Educational Projects",
        description: "Creative software products designed for educational purposes. These projects received high praise from university lecturers and were adopted as official course materials for future students.",
        techStack: ["ReactJS", "Spring Boot", "Android", "PostgreSQL", "MySQL", "Docker", "CI/CD"],
        mainImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770437300/screencapture-boi-hengout-app-2026-02-07-11_04_52_htuojh.png",
        secondaryImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770437902/screencapture-sr-hengout-app-2026-02-07-11_06_30_vnskfb.png",
      },
      {
        category: "Personal / Creative Side Projects",
        title: "Creative Side Projects",
        description: "A collection of university coursework and personal side projects. Built with the goal of continuous learning and hands-on experimentation with emerging technologies.",
        techStack: ["Next.js", "Three.js", "TypeScript", "TailwindCSS", "Supabase", "Cloudflare"],
        mainImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770441735/2_apdcw7.png",
        secondaryImage: "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1770441735/2_apdcw7.png",
      },
    ],
  },

  contact: {
    title: "Get In Touch",
    description:
      "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. If you have any questions or just want to say hi, I'll try my best to get back to you!",
    emailLabel: "Email",
    phoneLabel: "Phone",
    cta: "Click on the floating keycaps to visit my profiles!",
    email: "tqdat410@gmail.com",
    phone: "+84 901600791",
    linktree: "https://linktr.ee/tqdat410",
  },

  social: {
    github: "https://github.com/tqdat410",
    gmail: "mailto:tqdat410@gmail.com",
    linkedin: "https://www.linkedin.com/in/tqdat410",
    facebook: "https://www.facebook.com/tqdat410",
    x: "https://x.com/trandat40",
    youtube: "https://www.youtube.com/@tqdat410",
    instagram: "https://www.instagram.com/datdatdat_410",
    zalo: "https://zaloapp.com/qr/p/15fb76khotw1z",
    telegram: "https://t.me/tqdat410",
    upwork: "https://www.upwork.com/freelancers/~0166de7b3633a9b092",
    reddit: "https://www.reddit.com/user/Fun_Pudding818",
    discord: "https://discordapp.com/users/395901398509682688",
  },

  projectPopup: {
    overview: "Overview",
    role: "My Role",
    learning: "Key Learnings",
    technologies: "Technologies",
    type: "Type",
    status: "Status",
    duration: "Duration/Date",
    viewSource: "View Source",
    close: "Close",
  },
};

// Default export for convenience
export default content;
