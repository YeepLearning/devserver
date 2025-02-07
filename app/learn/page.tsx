'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
        image: '/puppy.png',
        text: '# Welcome to Language Models\n\nLet\'s learn about the technology behind AI!',
    },
    {
        id: '2',
        type: 'text',
        content: 'First, let\'s test your knowledge about language models. What kind of data was used to train the T&C model?',
    },
    {
        id: '3',
        type: 'multiple_choice',
        choices: [
            { id: 'a', text: 'Terms and conditions agreements', isCorrect: true },
            { id: 'b', text: 'Travel and culture books', isCorrect: false },
            { id: 'c', text: 'Town and Country magazines', isCorrect: false },
        ],
    }
];

export default function LearnPage() {
    const [content, setContent] = useState<ContentBlock[]>(initialContent);
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [message, setMessage] = useState<string>();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showingCorrect, setShowingCorrect] = useState<Record<string, boolean>>({});
    const [showPreviousBlocks, setShowPreviousBlocks] = useState(true);
    const [isScrollingToNew, setIsScrollingToNew] = useState(false);
    const lastManualScrollPosition = useRef(0);

    const lastBlockRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
        offset: ["start end", "end end"]
    });

    // Create opacity transform outside the render function
    const fadeOutOpacity = useTransform(
        scrollYProgress,
        [0.7, 1],  // Adjust these values to control when the fade starts
        [1, 0]
    );

    // Track scroll position
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (isScrollingToNew) return; // Don't check during auto-scroll

            const { scrollTop } = container;
            const hasScrolledUp = scrollTop < lastManualScrollPosition.current - 40;

            if (hasScrolledUp) {
                setShowPreviousBlocks(true);
            }

            lastManualScrollPosition.current = scrollTop;
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isScrollingToNew]);

    const handleAnswer = (blockId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [blockId]: answer }));
    };

    const handleContinue = () => {
        // Cycle through different types of blocks
        const blockTypes = ['text', 'multiple_choice', 'image_with_text'];
        const currentLength = content.length;
        const nextType = blockTypes[currentLength % blockTypes.length];

        let newBlock: ContentBlock;

        switch (nextType) {
            case 'multiple_choice':
                newBlock = {
                    id: String(currentLength + 1),
                    type: 'multiple_choice',
                    choices: [
                        { id: 'a', text: 'This is the correct answer', isCorrect: true },
                        { id: 'b', text: 'This is incorrect', isCorrect: false },
                        { id: 'c', text: 'This is also incorrect', isCorrect: false },
                    ],
                };
                break;
            case 'image_with_text':
                newBlock = {
                    id: String(currentLength + 1),
                    type: 'image_with_text',
                    image: '/puppy.png',
                    text: '## New Concept\n\nHere\'s an illustration of how this works.',
                };
                break;
            default:
                newBlock = {
                    id: String(currentLength + 1),
                    type: 'text',
                    content: 'Let\'s explore this concept further...',
                };
        }

        setContent(prev => [...prev, newBlock]);
        setProgress(prev => Math.min(100, prev + 10));
        setShowPreviousBlocks(false);
        setIsScrollingToNew(true);

        if (progress === 30 || progress === 60 || progress === 90) {
            setStars(prev => prev + 1);
            setMessage('You earned a star! 🌟');
        }

        // Start scroll animation
        setTimeout(() => {
            lastBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Reset scrolling state after animation
        setTimeout(() => {
            setIsScrollingToNew(false);
            const container = containerRef.current;
            if (container) {
                lastManualScrollPosition.current = container.scrollTop;
            }
        }, 1000); // Adjust based on your scroll animation duration
    };

    const renderBlock = (block: ContentBlock, index: number) => {
        const blockContent = (() => {
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

        const isLastBlock = index === content.length - 1;

        return (
            <motion.div
                key={block.id}
                ref={isLastBlock ? lastBlockRef : undefined}
                animate={{
                    opacity: isLastBlock || (!isScrollingToNew && showPreviousBlocks) ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                {blockContent}
            </motion.div>
        );
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-900">
            <ProgressBar
                progress={progress}
                stars={stars}
                message={message}
            />

            <div
                ref={containerRef}
                className="min-h-screen max-w-2xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]"
            >
                <div className="space-y-8">
                    {content.map((block, index) => renderBlock(block, index))}
                </div>

                {/* Continue button - fixed on mobile, inline on desktop */}
                <div className="fixed md:static bottom-0 left-0 right-0 bg-white md:bg-transparent dark:bg-zinc-900 md:dark:bg-transparent border-t md:border-t-0 border-zinc-200 dark:border-zinc-800 z-50">
                    <div className="max-w-2xl mx-auto p-4">
                        <button
                            onClick={handleContinue}
                            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* Bottom spacer */}
                <div className="h-[40vh]" />
            </div>
        </div>
    );
} 