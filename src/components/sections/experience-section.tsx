import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { ExperienceData } from '@/types';

interface ExperienceSectionProps {
  data: ExperienceData;
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">{data.items.length} positions</p>
      </div>

      <div className="space-y-4">
        {data.items.map((experience, index) => (
          <div
            key={index}
            className="border border-terminal-border p-5 hover:border-terminal-green-dim transition-colors terminal-line hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  <MarkdownRenderer content={experience.company} inline />
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{experience.description}</p>
              </div>
              <span className="text-xs text-terminal-amber shrink-0">{experience.duration}</span>
            </div>

            {experience.bullet_points && (
              <ul className="space-y-1.5 mb-4">
                {experience.bullet_points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start text-xs">
                    <span className="text-terminal-green mr-2 shrink-0">&gt;</span>
                    <MarkdownRenderer content={point} inline className="text-muted-foreground" />
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5">
              {experience.tag.split(', ').map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-[10px] px-1.5 py-0.5 border border-terminal-border text-terminal-green-dim"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
