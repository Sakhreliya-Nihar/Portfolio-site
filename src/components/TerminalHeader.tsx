'use client';

import { useState } from 'react';
import { TerminalTyping } from '@/components/TerminalTyping';
import { CalendlyButton } from '@/components/CalendlyButton';

export function TerminalHeader() {
  const [phase, setPhase] = useState(0);
  // phase 0: typing command
  // phase 1: command done, show output
  // phase 2: output visible, show CTA

  return (
    <div className="mb-16">
      {/* Status bar - appears immediately with fade */}
      <div className="flex items-center gap-3 mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
        <span className="inline-flex items-center gap-2 text-sm text-terminal-green-dim">
          <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
          <span className="text-muted-foreground">status:</span>
          <span>available</span>
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground">pid: 1337</span>
      </div>

      {/* Typed command */}
      <div className="space-y-2 mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-terminal-green text-sm shrink-0">$</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            <TerminalTyping
              text="cat portfolio.md"
              speed={45}
              delay={600}
              onComplete={() => setPhase(1)}
            />
          </h1>
        </div>

        {/* Output appears after typing */}
        {phase >= 1 && (
          <p className="text-muted-foreground pl-6 terminal-line">
            &gt; Explore my projects, experience, and technical expertise
          </p>
        )}
      </div>

      {/* CTA appears after output */}
      {phase >= 1 && (
        <div className="terminal-line" style={{ animationDelay: '0.2s' }}>
          <CalendlyButton />
        </div>
      )}
    </div>
  );
}
