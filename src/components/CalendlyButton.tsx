'use client';

import { Calendar } from 'lucide-react';

export function CalendlyButton() {
  return (
    <a
      href="https://calendly.com/niharsakhreliya4/30min"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 text-xs border border-terminal-green text-terminal-green hover:bg-terminal-surface transition-colors"
    >
      <Calendar className="h-3.5 w-3.5" />
      <span>./schedule-coffee-chat.sh</span>
    </a>
  );
}
