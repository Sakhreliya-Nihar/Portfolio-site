'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllData } from '@/types';
import { ProjectSection } from './sections/project-section';
import { ExperienceSection } from './sections/experience-section';
import { TechStackSection } from './sections/tech-stack-section';
import { EducationSection } from './sections/education-section';
import { CurrentWorkSection } from './sections/current-work-section';
import { LearningSection } from './sections/learning-section';
import { FunFactsSection } from './sections/fun-facts-section';
import { JourneySection } from './sections/journey-section';

interface PortfolioTabsProps {
  data: AllData;
}

export function PortfolioTabs({ data }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState('projects');
  // Counter to force re-mount on tab switch, re-triggering stagger animations
  const [switchCount, setSwitchCount] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSwitchCount(c => c + 1);
  };

  const tabs = [
    { id: 'projects', label: 'projects', component: <ProjectSection data={data.projects} /> },
    { id: 'experience', label: 'experience', component: <ExperienceSection data={data.experience} /> },
    { id: 'tech-stack', label: 'stack', component: <TechStackSection data={data.techStack} /> },
    { id: 'current-work', label: 'current', component: <CurrentWorkSection data={data.currentWork} /> },
    { id: 'learning', label: 'learning', component: <LearningSection data={data.learning} /> },
    { id: 'education', label: 'edu', component: <EducationSection data={data.education} /> },
    { id: 'journey', label: 'journey', component: <JourneySection data={data.journey} /> },
    { id: 'fun-facts', label: 'facts', component: <FunFactsSection data={data.funFacts} /> },
  ];

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* Tab bar styled as terminal command options */}
      <div className="w-full mb-8">
        <div className="border border-terminal-border bg-[#090b09]">
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-terminal-border text-xs text-muted-foreground">
            <span className="text-terminal-green">$</span>
            <span>nihar</span>
            <span className="text-terminal-amber">--section</span>
            <span className="text-terminal-green">{activeTab}</span>
          </div>
          <TabsList className="flex w-full flex-wrap bg-transparent p-1 gap-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs px-3 py-1.5 text-muted-foreground data-[state=active]:text-terminal-green data-[state=active]:bg-terminal-surface data-[state=active]:border-terminal-border data-[state=active]:border data-[state=inactive]:border-transparent border hover:text-terminal-green-dim transition-colors rounded-none"
              >
                ./{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={`${tab.id}-${switchCount}`} value={tab.id} className="mt-0">
          <div className="border border-terminal-border bg-[#0a0d0a] p-6 sm:p-8 fade-up">
            {tab.component}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
