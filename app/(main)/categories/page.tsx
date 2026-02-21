'use client';

import { CATEGORIES } from '@/lib/constants/categories';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedCategoryIcon from '@/components/AnimatedCategoryIcon';

const CategoriesPage = () => {
    return (
        <div className="pt-24 pb-32 min-h-screen bg-white mandala-pattern">
            {/* Header */}
            <div className="bhutan-container mb-12 animate-slide-in-up text-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon/5 border border-maroon/10 text-maroon text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Discovery Center
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-maroon via-saffron to-gold bg-clip-text text-transparent">
                    Shop by Category
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4">
                    Explore our curated collection of tech and lifestyle products designed for modern Bhutan.
                </p>
            </div>

            {/* Categories Modern Grid */}
            <div className="bhutan-container px-4">
                <div className="grid grid-cols-1 gap-6">
                    {CATEGORIES.map((category, index) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative h-64 md:h-80 overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Animated Background Icon Layer */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity duration-700">
                                <AnimatedCategoryIcon categoryName={category.name} />
                            </div>

                            {/* Content Layer */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/20 to-transparent">
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 group-hover:text-maroon transition-colors duration-500">
                                        {category.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-xs group-hover:text-saffron transition-colors duration-500">
                                        Exploration
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Modern Glass Number Badge */}
                            <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl glass flex items-center justify-center font-display font-black text-maroon border border-white/40 shadow-xl">
                                0{index + 1}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="fixed top-1/4 -left-12 w-64 h-64 bg-saffron/5 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 -right-12 w-80 h-80 bg-maroon/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </div>
    );
};

export default CategoriesPage;
