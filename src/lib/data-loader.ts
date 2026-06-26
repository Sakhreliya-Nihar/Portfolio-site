import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { 
  AllData, 
  IntroData, 
  ProjectData, 
  ExperienceData, 
  TechStackData, 
  EducationData, 
  CurrentWorkData, 
  LearningData, 
  FunFactsData, 
  JourneyData 
} from '@/types';

export async function loadAllData(): Promise<AllData> {
  const configDir = path.join(process.cwd(), 'config');
  
  const loadYaml = (filename: string): unknown => {
    const filePath = path.join(configDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  };

  return {
    intro: loadYaml('intro.yaml') as IntroData,
    projects: loadYaml('project.yaml') as ProjectData,
    experience: loadYaml('experience.yaml') as ExperienceData,
    techStack: loadYaml('tech_stack.yaml') as TechStackData,
    education: loadYaml('education.yaml') as EducationData,
    currentWork: loadYaml('current_work.yaml') as CurrentWorkData,
    learning: loadYaml('learning.yaml') as LearningData,
    funFacts: loadYaml('fun_facts.yaml') as FunFactsData,
    journey: loadYaml('journey.yaml') as JourneyData,
  };
}