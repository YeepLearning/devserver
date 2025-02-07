'use client';

import { useState, useRef, useEffect } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { ImageWithText } from '@/components/learning/ImageWithText';
import { Text } from '@/components/learning/Text';
import { MultipleChoiceQuestion } from '@/components/learning/MultipleChoiceQuestion';
import { Textbox } from '@/components/learning/Textbox';

// Types for our content blocks
interface BaseBlock {
    id: string;
    type: string;
}

interface ImageWithTextBlock extends BaseBlock {
    type: 'image_with_text';
    image: string;
    text: string;
    alt?: string;
}

interface TextBlock extends BaseBlock {
    type: 'text';
    content: string;
}

interface MultipleChoiceBlock extends BaseBlock {
    type: 'multiple_choice';
    choices: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

interface TextboxBlock extends BaseBlock {
    type: 'textbox';
    answer: string;
}

type ContentBlock = ImageWithTextBlock | TextBlock | MultipleChoiceBlock | TextboxBlock;

// Example content (you would typically load this from an API)
const initialContent: ContentBlock[] = [
    {
        id: '1',
        type: 'image_with_text',
        image: '/example-image.jpg',
        text: '# Welcome to Language Models\n\nLet\'s learn about the technology behind AI!',
    },
    {
        id: '2',
        type: 'text',
        content: 'First, let\'s test your knowledge about language models.',
    },
    {
        id: '3',
        type: 'multiple_choice',
        choices: [
            { id: 'a', text: 'Terms and conditions agreements', isCorrect: true },
            { id: 'b', text: 'Travel and culture books', isCorrect: false },
            { id: 'c', text: 'Town and Country magazines', isCorrect: false },
        ],
    },
];

export default function LearnPage() {
    const [content, setContent] = useState<ContentBlock[]>(initialContent);
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [message, setMessage] = useState<string>();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showingCorrect, setShowingCorrect] = useState<Record<string, boolean>>({});

    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAnswer = (blockId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [blockId]: answer }));
    };

    const handleContinue = () => {
        // Add new content block (in a real app, this would be more sophisticated)
        const newBlock: ContentBlock = {
            id: String(content.length + 1),
            type: 'text',
            content: 'Here\'s another piece of content!',
        };

        setContent(prev => [...prev, newBlock]);
        setProgress(prev => Math.min(100, prev + 10));

        // If progress hits certain milestones, award stars
        if (progress === 30 || progress === 60 || progress === 90) {
            setStars(prev => prev + 1);
            setMessage('You earned a star! 🌟');
        }

        // Scroll to the new content after it's added
        setTimeout(scrollToBottom, 100);
    };

    const renderBlock = (block: ContentBlock) => {
        const content = (() => {
            switch (block.type) {
                case 'image_with_text':
                    return (
                        <ImageWithText
                            key={block.id}
                            image={block.image}
                            text={block.text}
                            alt={block.alt}
                        />
                    );
                case 'text':
                    return (
                        <Text
                            key={block.id}
                            content={block.content}
                        />
                    );
                case 'multiple_choice':
                    return (
                        <MultipleChoiceQuestion
                            key={block.id}
                            choices={block.choices}
                            onSelect={(choice) => handleAnswer(block.id, choice.id)}
                            selectedId={answers[block.id]}
                            showCorrect={showingCorrect[block.id]}
                        />
                    );
                case 'textbox':
                    return (
                        <Textbox
                            key={block.id}
                            value={answers[block.id] || ''}
                            onChange={(value) => handleAnswer(block.id, value)}
                            disabled={showingCorrect[block.id]}
                            isCorrect={showingCorrect[block.id]}
                        />
                    );
                default:
                    return null;
            }
        })();

        return (
            <div key={block.id} className="min-h-[100vh] flex items-center justify-center py-20">
                <div className="w-full">
                    {content}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <ProgressBar
                progress={progress}
                stars={stars}
                message={message}
            />

            <div className="max-w-2xl mx-auto">
                {content.map(block => renderBlock(block))}

                <div className="p-4 flex justify-center">
                    <button
                        onClick={handleContinue}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue
                    </button>
                </div>

                <div ref={bottomRef} />
            </div>
        </div>
    );
} 