export interface IntroData {
  title: string;
  subtitle: string;
  website: string;
  address?: string;
  contact: {
    email: string;
    linkedin: string;
  };
  quote: string;
  quote_author: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  bullet_points: string[];
  link: string;
  deployment: string;
  tag: string;
}

export interface ProjectData {
  title: string;
  items: ProjectItem[];
}

export interface ExperienceItem {
  company: string;
  description: string;
  bullet_points?: string[];
  tag: string;
  duration: string;
}

export interface ExperienceData {
  title: string;
  items: ExperienceItem[];
}

export interface TechStackData {
  title: string;
  categories: {
    [key: string]: string;
  };
}

export interface EducationItem {
  degree: string;
  school: string;
  duration: string;
  description: string;
  bullet_points: string[];
  skills: string;
}

export interface EducationData {
  title: string;
  items: EducationItem[];
}

export interface CurrentWorkData {
  title: string;
  items: string[];
}

export interface LearningData {
  title: string;
  items: string[];
}

export interface FunFactsData {
  title: string;
  items: string[];
}

export interface TimelineEvent {
  year: string;
  event: string;
  details?: (string | { [key: string]: string[] })[];
  subdetails?: string[];
}

export interface JourneyData {
  title: string;
  timeline: TimelineEvent[];
  footer: string;
}

export interface AllData {
  intro: IntroData;
  projects: ProjectData;
  experience: ExperienceData;
  techStack: TechStackData;
  education: EducationData;
  currentWork: CurrentWorkData;
  learning: LearningData;
  funFacts: FunFactsData;
  journey: JourneyData;
}