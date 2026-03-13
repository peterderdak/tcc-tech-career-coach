import { useState } from 'react';

interface PromptCardProps {
  title: string;
  description: string;
  text: string;
}

export function PromptCard({ title, description, text }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article className="panel prompt-card">
      <div className="prompt-card__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button
          type="button"
          className="button button--ghost"
          onClick={handleCopy}
          aria-label={`Copy ${title} prompt`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="prompt-card__body">{text}</pre>
    </article>
  );
}
