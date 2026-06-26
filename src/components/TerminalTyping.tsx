'use client';

import { useState, useEffect } from 'react';

interface TerminalTypingProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TerminalTyping({
  text,
  speed = 50,
  delay = 300,
  onComplete,
  className = '',
}: TerminalTypingProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(text);
      setStarted(true);
      setDone(true);
      onComplete?.();
      return;
    }

    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay, text, onComplete]);

  useEffect(() => {
    if (!started || done) return;

    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
      onComplete?.();
    }
  }, [started, displayed, text, speed, done, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {started && !done && (
        <span className="text-terminal-green cursor-blink">_</span>
      )}
    </span>
  );
}
