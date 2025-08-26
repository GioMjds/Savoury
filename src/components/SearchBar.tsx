'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
}

const SearchBar = ({ 
    className = "", 
    onSearch 
}: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() && onSearch) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <motion.form
            onSubmit={handleSearch}
            className={`relative w-full mx-auto ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search for recipes, ingredients, or Savoury users..."
                    className={`
                        w-full px-4 py-2 pl-10 pr-4
                        bg-white border border-border rounded-lg
                        text-foreground placeholder-gray-500
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-all duration-200
                        ${isFocused ? 'shadow-md' : 'shadow-sm'}
                    `}
                />
                
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                        className={`w-4 h-4 transition-colors duration-200 ${
                            isFocused ? 'text-primary' : 'text-gray-400'
                        }`}
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
                </div>

                {/* Clear button */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                    </button>
                )}
            </div>
        </motion.form>
    );
};

export default SearchBar;
