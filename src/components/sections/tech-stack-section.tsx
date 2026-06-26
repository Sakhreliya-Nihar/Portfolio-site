import { TechStackData } from '@/types';

interface TechStackSectionProps {
  data: TechStackData;
}

export function TechStackSection({ data }: TechStackSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">ls -la ./skills/</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.categories).map(([category, technologies], catIndex) => (
          <div key={category} className="border border-terminal-border p-5 terminal-line" style={{ animationDelay: `${catIndex * 100}ms` }}>
            <h3 className="text-sm font-bold text-terminal-amber mb-4">{category}/</h3>
            <div className="flex flex-wrap gap-1.5">
              {technologies.split(', ').map((tech, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-terminal-surface border border-terminal-border text-terminal-green-dim hover:text-terminal-green hover:border-terminal-green-dim transition-colors"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
