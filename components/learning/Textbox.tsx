'use client';

interface TextboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isCorrect?: boolean;
}

export function Textbox({
    value,
    onChange,
    placeholder = 'Type your answer...',
    disabled,
    isCorrect
}: TextboxProps) {
    let borderClass = 'border-zinc-200 dark:border-zinc-700';
    if (isCorrect === true) {
        borderClass = 'border-green-500';
    } else if (isCorrect === false) {
        borderClass = 'border-red-500';
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full p-4 rounded-lg border ${borderClass} bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            />
        </div>
    );
} 