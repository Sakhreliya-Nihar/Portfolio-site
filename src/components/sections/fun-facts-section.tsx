import { FunFactsData } from '@/types';

interface FunFactsSectionProps {
  data: FunFactsData;
}

export function FunFactsSection({ data }: FunFactsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">cat ~/fun_facts.txt</p>
      </div>

      <div className="max-w-3xl space-y-2">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 px-4 py-3 border border-terminal-border hover:border-terminal-cyan transition-colors terminal-line"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-terminal-cyan text-xs shrink-0 pt-0.5">#</span>
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
