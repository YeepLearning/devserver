'use client';

import { useState, useEffect } from 'react';

interface ProgressBarProps {
    progress: number;  // 0 to 100
    stars: number;
    message?: string;
}

export function ProgressBar({ progress, stars, message }: ProgressBarProps) {
    const [showMessage, setShowMessage] = useState(!!message);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 shadow-md">
            <div className="max-w-2xl mx-auto px-4 py-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <div className="text-yellow-500">
                            {[...Array(stars)].map((_, i) => (
                                <span key={i}>⭐</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-zinc-500">
                        {Math.round(progress)}%
                    </div>
                </div>

                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {showMessage && message && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm animate-fade-in-down">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
} 