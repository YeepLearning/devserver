'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface ImageWithTextProps {
    image: string;
    text: string;
    alt?: string;
}

export function ImageWithText({ image, text, alt }: ImageWithTextProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                    src={image}
                    alt={alt || 'Learning content'}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </div>
    );
} 