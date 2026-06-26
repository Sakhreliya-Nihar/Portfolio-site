import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { JourneyData } from '@/types';

interface JourneySectionProps {
  data: JourneyData;
}

export function JourneySection({ data }: JourneySectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-terminal-green mb-1">{data.title}</h2>
        <p className="text-xs text-muted-foreground">git log --oneline</p>
      </div>

      <div className="max-w-4xl">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-terminal-border" />

          <div className="space-y-6">
            {data.timeline.map((event, index) => (
              <div key={index} className="relative flex items-start gap-4 terminal-line" style={{ animationDelay: `${index * 120}ms` }}>
                {/* Timeline dot */}
                <div className="relative z-10 w-[15px] shrink-0 flex justify-center pt-1">
                  <div className="w-2.5 h-2.5 border border-terminal-green bg-terminal-surface" />
                </div>

                <div className="flex-1 min-w-0 border border-terminal-border p-4 hover:border-terminal-green-dim transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-terminal-amber font-bold">{event.year}</span>
                    <h3 className="text-sm font-bold text-foreground">
                      <MarkdownRenderer content={event.event} inline />
                    </h3>
                  </div>
                  {event.details && (
                    <ul className="space-y-1">
                      {event.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-xs">
                          <span className="text-terminal-green mr-2 shrink-0">&gt;</span>
                          <span className="text-muted-foreground">
                            <MarkdownRenderer
                              content={typeof detail === 'string' ? detail : JSON.stringify(detail)}
                              inline
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pl-8 text-sm text-terminal-green-dim">
          <MarkdownRenderer content={data.footer} inline />
        </div>
      </div>
    </div>
  );
}
