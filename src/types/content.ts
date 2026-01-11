export interface EducationItem {
  school: string;
  degree: string;
  year: string;
  gpa: string;
  description?: string;
}

export interface CertificateItem {
  name: string;
  provider: string;
  date?: string;
  link?: string;
}

export interface CertificateGroup {
  name: string;
  count: number;
  items: CertificateItem[];
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  link?: string;
  github?: string;
}
