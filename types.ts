export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  logo?: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  link?: string;
  logo?: string;
}

export interface HallOfFame {
  id: string;
  company: string;
  logo: string;
  date: string;
}

export interface Tool {
  id: string;
  name: string;
  logo: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  email: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  location: string;
  availability: string;
  systemStatus: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  hallOfFame: HallOfFame[];
  hallOfFameStyle?: 'classic' | 'soft' | 'cyber';
  tools: Tool[];
  social: SocialLinks;
  profileImage: string;
}

export type SectionKey = keyof PortfolioData;