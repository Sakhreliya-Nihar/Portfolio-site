import { IntroData } from '@/types';
import { Mail, Linkedin, Globe, MapPin } from 'lucide-react';
import { LocationTracker } from '@/components/LocationTracker';

interface SidebarProps {
  data: IntroData;
}

export function Sidebar({ data }: SidebarProps) {
  return (
    <div className="h-full bg-[#090b09] border-r border-terminal-border text-foreground p-6 lg:p-8 flex flex-col relative scanlines">
      <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10 sidebar-stagger">
        {/* System Info Header */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <span className="text-terminal-green">~/about</span>
        </div>

        {/* Identity */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-terminal-green-bright tracking-tight">
            {data.title}
          </h1>
          <p className="text-sm text-terminal-green-dim">
            {data.subtitle}
          </p>
          {data.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-terminal-green transition-colors"
            >
              <MapPin className="h-3 w-3" />
              {data.address}
            </a>
          )}
        </div>

        {/* Quote */}
        <div className="border-l-2 border-terminal-border pl-4 py-1">
          <p className="text-xs text-muted-foreground italic">
            # &ldquo;{data.quote}&rdquo;
          </p>
        </div>

        {/* Location Tracker */}
        <LocationTracker />

        {/* Contact - Key-Value Style */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-3">
            <span className="text-terminal-amber">const</span> contact <span className="text-muted-foreground">=</span> {'{'}
          </div>

          <a
            href={`mailto:${data.contact.email}`}
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-terminal-green hover:bg-terminal-surface border border-transparent hover:border-terminal-border transition-all group"
          >
            <Mail className="h-3.5 w-3.5 text-terminal-green-dim group-hover:text-terminal-green" />
            <span className="truncate text-xs">{data.contact.email}</span>
          </a>

          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-terminal-green hover:bg-terminal-surface border border-transparent hover:border-terminal-border transition-all group"
          >
            <Linkedin className="h-3.5 w-3.5 text-terminal-green-dim group-hover:text-terminal-green" />
            <span className="text-xs">linkedin</span>
          </a>

          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-terminal-green hover:bg-terminal-surface border border-transparent hover:border-terminal-border transition-all group"
          >
            <Globe className="h-3.5 w-3.5 text-terminal-green-dim group-hover:text-terminal-green" />
            <span className="text-xs">website</span>
          </a>

          <div className="text-xs text-muted-foreground">{'}'}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-terminal-border relative z-10">
        <p className="text-xs text-muted-foreground">
          <span className="text-terminal-green-dim">&copy;</span> {new Date().getFullYear()} {data.title}
        </p>
      </div>
    </div>
  );
}
