'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { feed } from '@/services/Feed';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    placeholder?: string;
}

const SearchBar = ({
    placeholder
}: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const router = useRouter();
    const queryClient = useQueryClient();

    const searchMutation = useMutation({
        mutationFn: (query: string) => feed.searchRecipePost(query),
        onSuccess: () => {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            queryClient.invalidateQueries({
                queryKey: ['search', searchQuery]
            });
        },
        onError: (error) => {
            console.error(`Search error: ${error}`);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchMutation.mutate(searchQuery.trim());
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative">
                <motion.div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                    animate={{ scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg
                        className={`w-4 h-4 transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </motion.div>
                
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-2.5 pl-10 pr-10
                        bg-white border border-border rounded-xl
                        text-foreground placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                        transition-all duration-200
                        ${isFocused ? 'shadow-md' : 'shadow-sm'}
                    `}
                />
                
                {/* Clear button */}
                {searchQuery && (
                    <motion.button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </motion.button>
                )}
            </div>
        </motion.form>
    );
};

export default SearchBar;