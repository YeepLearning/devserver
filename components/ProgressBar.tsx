'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProgressBarProps {
    progress: number;  // 0 to 100
    stars: number;
    message?: string;
    onClose?: () => void;
}

export function ProgressBar({ progress, stars, message, onClose }: ProgressBarProps) {
    const [showMessage, setShowMessage] = useState(!!message);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="fixed top-0 left-0 right-4 z-50 bg-zinc-900 text-white">
            <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={onClose}
                        className="hover:opacity-70 transition-opacity"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-1 text-lg">
                        <div className="text-yellow-500 text-xl">
                            {[...Array(stars)].map((_, i) => (
                                <span key={i}>⭐</span>
                            ))}
                        </div>
                        <span className="ml-2 text-zinc-400">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
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