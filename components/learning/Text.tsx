'use client';

import ReactMarkdown from 'react-markdown';

interface TextProps {
  content: string;
}

export function Text({ content }: TextProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
} 