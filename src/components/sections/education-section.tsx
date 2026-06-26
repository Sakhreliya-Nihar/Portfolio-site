import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { EducationData, EducationItem } from '@/types';

interface EducationSectionProps {
  data: EducationData;
}

export function EducationSection({ data }: EducationSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">{data.items.length} entries</p>
      </div>

      <div className="space-y-4">
        {data.items.map((item: EducationItem, index: number) => (
          <div
            key={index}
            className="border border-terminal-border p-5 hover:border-terminal-green-dim transition-colors terminal-line hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  <MarkdownRenderer content={`${item.degree}, **${item.school}**`} inline />
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <MarkdownRenderer content={item.description} inline />
                </p>
              </div>
              <span className="text-xs text-terminal-amber shrink-0">{item.duration}</span>
            </div>

            {item.bullet_points && item.bullet_points.length > 0 && (
              <ul className="space-y-1.5 mb-4">
                {item.bullet_points.map((point, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <span className="text-terminal-green mr-2 shrink-0">&gt;</span>
                    <MarkdownRenderer content={point} inline className="text-muted-foreground" />
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5">
              {item.skills.split(',').map((skill, i) => (
                <span
                  key={i}
                  className="text-[10px] px-1.5 py-0.5 border border-terminal-border text-terminal-green-dim"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
