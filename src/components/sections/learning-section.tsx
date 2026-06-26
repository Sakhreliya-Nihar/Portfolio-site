import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { LearningData } from '@/types';

interface LearningSectionProps {
  data: LearningData;
}

export function LearningSection({ data }: LearningSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">apt list --upgradable</p>
      </div>

      <div className="max-w-3xl space-y-2">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 px-4 py-3 border border-terminal-border hover:border-terminal-amber-dim transition-colors terminal-line"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-terminal-amber text-xs shrink-0 pt-0.5">~&gt;</span>
            <MarkdownRenderer content={item} inline className="text-sm text-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
