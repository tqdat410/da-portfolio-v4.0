# Phase 1: Content Enrichment

## Priority: High
## Status: Pending

## Overview
Rewrite all project descriptions, overviews, key features, roles, responsibilities, and learning sections with proper English content based on user-provided briefs. Replace all `<placeholder>` values.

## Files to Modify
- `src/content/portfolio.ts` — project items content

## Content Updates (Per Project)

### 1. Custom Notification Center (SAP Category)
- **description**: "Capstone project: Custom Notification Center for SAP S/4HANA with Fiori UI."
- **longDescription**: Same as overview
- **overview**: "Capstone graduation project developing a Custom Notification Center within SAP S/4HANA. The system provides centralized notification management including bell icon with badge display, dropdown notification list, mark read/unread, delete, archive actions, and subscription settings for user preferences and delivery channel configuration. Includes a backend API for creating notifications directly from ABAP programs."
- **keyFeatures**: ["Bell icon with badge and dropdown notification list", "Mark read/unread, delete, and archive notifications", "Subscription settings with delivery channel configuration", "Backend RESTful API for notification creation from ABAP", "Real-time updates via AMC/APC channels"]
- **role**: "Team Leader (4 members): Led requirement analysis, architecture design, task management, progress tracking, documentation, testing, and reporting. Collaborated under FPT Software's supervision and quality standards."
- **responsibilities**: ["Requirement analysis and technical research", "System architecture design", "Team progress and task management", "Documentation, testing, and reporting"]
- **duration**: "Jan 2026 - Apr 2026"
- **teamSize**: 4
- **learning**: "Gained deep expertise in modern SAP technologies including AMC/APC for real-time communication, Fiori/UI5 frontend development, RAP framework, and working within enterprise standards set by FPT Software."
- **fullTechStack**: ["ABAP", "SAP RAP", "OData", "Fiori", "UI5", "HANA", "RESTful API", "AMC/APC", "Background Job"]
- Remove `problem`, `solution` placeholders

### 2. Hengout (Startup Category)
- **description**: "AI-powered location recommendation app for GenZ, from concept to App Store."
- **overview**: "A startup product awarded a 50M VND scholarship at FPT University. Hengout is a location recommendation app tailored for GenZ, leveraging AI to curate, filter, and synthesize venue information. It offers personalized suggestions based on individual preferences and a unique group consensus feature that recommends destinations suitable for multiple users. Built from concept to App Store launch as a comprehensive iOS app with a web landing page."
- **keyFeatures**: ["AI-powered venue curation and personalized recommendations", "Group consensus feature for multi-user destination matching", "Real-time activity feeds via Kafka event streaming", "Location-based caching with Redis for fast responses", "Apple In-App Purchase integration", "Monitoring with Grafana dashboards"]
- **role**: "Tech Lead (6 members — 3 tech, 3 marketing): Led system architecture design, backend development, web app, CI/CD pipelines, server deployment, monitoring, AI and payment integration, data crawling, testing, and App Store submission."
- **responsibilities**: ["System architecture design and technical decisions", "Backend development with Spring Boot microservices", "CI/CD pipeline setup and VPS deployment", "AI integration for recommendation engine", "Payment integration and App Store submission", "Server monitoring with Grafana"]
- **teamSize**: 6
- **learning**: "Comprehensive startup experience spanning business ideation, financial management, and marketing alongside deep technical growth in microservices architecture, real-time event streaming, AI integration, mobile app deployment, and end-to-end product delivery."
- Remove `problem`, `solution` placeholders
- Migrate legacy `github`, `demoUrl` → `links[]`

### 3. Koi Vet. Center (University Category)
- **description**: "Full-featured veterinary management system for Koi fish healthcare."
- **overview**: "A comprehensive management system for a Koi veterinary center. Core features include service information browsing, appointment scheduling, payment processing, staff work schedule management, medical examination records and treatment history, and system monitoring with administrative tools."
- **keyFeatures**: ["Service catalog and appointment scheduling", "Payment processing and billing", "Medical records and treatment history tracking", "Staff work schedule management", "System monitoring and admin dashboard"]
- **role**: "Team Leader & Backend Lead (5 members): Led system architecture design, task assignment, progress management, and backend API development."
- **responsibilities**: ["System architecture design", "Task assignment and team coordination", "Backend API development", "Progress tracking and code review"]
- **teamSize**: 5
- **learning**: "Strengthened problem-solving, leadership, and teamwork skills. Practiced system design for monolith architecture, database management, RESTful API development, and collaborative Git/GitHub workflows."
- Remove `problem`, `solution` placeholders
- Migrate legacy `github` array → `links[]`

### 4. Uni. Event Manager (University Category)
- **description**: "University event management platform with QR check-in and survey tools."
- **overview**: "An event management and registration platform for university communities. Enables creation and management of upcoming campus events, event browsing and registration for attendees, QR code-based check-in/checkout, post-event survey creation and distribution, and result export for analysis."
- **keyFeatures**: ["Event creation, publishing, and management", "Student registration and attendance tracking", "QR code-based check-in/checkout", "Post-event survey builder with distribution", "Result export and analytics"]
- **role**: "Team Leader & Fullstack Developer (5 members): Led system design, task management, team coordination, backend development, CI/CD setup, and server deployment."
- **responsibilities**: ["System design and architecture decisions", "Backend development with Spring Boot", "CI/CD pipeline and Docker deployment", "Team coordination and progress tracking"]
- **teamSize**: 5
- **learning**: "Mastered new technologies including PostgreSQL, Docker containerization, CI/CD pipelines, VPS deployment, and elevated system design capabilities alongside leadership and teamwork skills."
- Remove `problem`, `solution` placeholders
- Migrate legacy `github` array → `links[]`

### 5. AI Quick Note (University Category)
- **description**: "AI-powered Android note-taking app with smart categorization and RAG retrieval."
- **overview**: "An Android mobile application for quick note-taking with support for multiple input formats. Integrates AI for automatic note categorization and RAG (Retrieval-Augmented Generation) for rapid information retrieval from saved notes via an intelligent chatbot."
- **keyFeatures**: ["Multi-format note input (text, voice, image)", "AI-powered automatic note categorization", "RAG-based information retrieval chatbot", "Semantic search across all notes", "Real-time sync via WebSocket"]
- **role**: "Team Leader & Backend Developer (5 members): Led system architecture, task management, progress tracking, and backend development with AI integration."
- **responsibilities**: ["System architecture design", "Backend development with Spring Boot", "AI and semantic search integration", "Team coordination and task management"]
- **teamSize**: 5
- **learning**: "First exposure to mobile app development. Gained hands-on experience integrating AI into a production product, implementing semantic search with vector databases, and deepening leadership and teamwork capabilities."
- Remove `problem`, `solution` placeholders
- Migrate legacy `github` array → `links[]`

### 6. Balance of Interest (Personal/Creative Category)
- **description**: "Interactive simulation exploring the concept of 'Interest' in society."
- **overview**: "A creative product for a Development Philosophy course, simulating the balance of interests within society. Developed entirely solo and recognized by the lecturer for its quality, subsequently adopted as official course material. AI tools were integral throughout development — NotebookLM for research, GitHub Copilot for agentic coding assistance, and Gemini for image generation."
- **keyFeatures**: ["Interactive simulation of societal interest dynamics", "AI-assisted research and development workflow", "Adopted as official university course material"]
- **role**: "Owner & Solo Developer: Conceptualized, designed, and built the entire project independently."
- **teamSize**: 1
- **learning**: "Game logic design thinking, creative content production, and applying economic concepts to interactive technology products."
- Remove `problem`, `solution` placeholders
- Migrate legacy `github` → `links[]` (already done)

### 7. Social Revolution (Personal/Creative Category)
- **description**: "Interactive simulation of socio-economic formation processes."
- **overview**: "A creative product for a Development Philosophy course, simulating the characteristics and formation process of socio-economic formations. Built solo and highly praised by the lecturer, later adopted as official course material. AI tools powered the entire workflow — NotebookLM for research, GitHub Copilot for coding, and Gemini for visuals."
- **keyFeatures**: ["Simulation of socio-economic formation stages", "AI-driven research and development pipeline", "Adopted as official university course material"]
- **role**: "Owner & Solo Developer: Designed game logic, wrote content scripts, and integrated AI tooling for the full development cycle."
- **teamSize**: 1
- **learning**: "Educational content creation, game logic programming, and leveraging AI coding tools to accelerate development velocity."
- Remove `problem`, `solution` placeholders

### 8. Debate 1911 (Personal/Creative Category)
- **description**: "AI-powered debate game exploring Ho Chi Minh era historical perspectives."
- **overview**: "A creative product for a Ho Chi Minh Ideology course. Built in just 2 days, this app uses AI to enable users to debate opposing viewpoints on a historical issue. The backend leverages n8n workflows and OpenRouter API for AI-driven argument generation. AI tools supported the entire process — NotebookLM for research, GitHub Copilot for coding, and Gemini for imagery."
- **keyFeatures**: ["AI-powered debate with dynamic argument generation", "n8n + OpenRouter API backend integration", "Built in 2 days as a rapid prototype"]
- **role**: "Owner & Solo Developer: End-to-end development from concept to deployment."
- **fullTechStack**: ["Next.js", "TypeScript", "TailwindCSS", "n8n", "OpenRouter API"]
- **teamSize**: 1
- **duration**: "2 days"
- **learning**: "Rapid prototyping with AI integration, workflow automation with n8n, and historical narrative design for interactive applications."
- Remove `problem`, `solution` placeholders

### 9. Industrial Revolution (Personal/Creative Category)
- **description**: "360-degree virtual museum showcasing industrial revolution eras."
- **overview**: "A virtual 360-degree museum experience simulating different industrial revolution periods. This was the first project involving Three.js, creating an immersive learning environment. AI tools powered the development — NotebookLM for research, GitHub Copilot for coding, and Gemini for imagery."
- **keyFeatures**: ["Immersive 360-degree virtual museum environment", "Three.js-powered 3D web experience", "First hands-on project with WebGL/Three.js"]
- **role**: "Creative Developer: Conceptualized the 3D museum space, designed the interactive interface, and developed the VR-like experience."
- **teamSize**: 1
- **learning**: "First exposure to Three.js and 3D web development, VR/360 experience creation, and graphic resource optimization for the web."
- Remove `problem`, `solution` placeholders

## Success Criteria
- [ ] All `<placeholder>` values removed
- [ ] Every project has meaningful overview, keyFeatures, role, learning
- [ ] Content is concise, professional English
- [ ] Da'Portfolio content unchanged
