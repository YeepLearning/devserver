'use client';

interface Choice {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQuestionProps {
    choices: Choice[];
    onSelect: (choice: Choice) => void;
    selectedId?: string;
    showCorrect?: boolean;
}

export function MultipleChoiceQuestion({
    choices,
    onSelect,
    selectedId,
    showCorrect
}: MultipleChoiceQuestionProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-3">
            {choices.map((choice) => {
                const isSelected = choice.id === selectedId;
                let buttonClass = 'w-full p-4 text-left rounded-lg border transition-all duration-200 ';

                if (showCorrect && choice.isCorrect) {
                    buttonClass += 'bg-green-100 dark:bg-green-900 border-green-500';
                } else if (showCorrect && isSelected && !choice.isCorrect) {
                    buttonClass += 'bg-red-100 dark:bg-red-900 border-red-500';
                } else if (isSelected) {
                    buttonClass += 'bg-blue-100 dark:bg-blue-900 border-blue-500';
                } else {
                    buttonClass += 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500';
                }

                return (
                    <button
                        key={choice.id}
                        className={buttonClass}
                        onClick={() => onSelect(choice)}
                        disabled={showCorrect}
                    >
                        {choice.text}
                    </button>
                );
            })}
        </div>
    );
} 