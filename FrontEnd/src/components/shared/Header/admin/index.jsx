import React from 'react';
import { useTheme } from '../../../../hooks/useTheme';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    return (
        <header className="sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="text-2xl font-heading font-black text-brand-primary uppercase tracking-tighter">
                    Dev<span>UI</span>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-4 font-medium">
                        <a href="#" className="hover:text-brand-primary">Dự án</a>
                        <a href="#" className="hover:text-brand-primary">Tài liệu</a>
                    </nav>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:ring-2 ring-brand-primary transition-all"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/30">
                        Bắt đầu
                    </button>
                </div>
            </div>
        </header>
    );
};