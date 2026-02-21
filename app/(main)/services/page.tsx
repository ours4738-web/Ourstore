'use client';

import { Sparkles, Shield, Truck, Headphones, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ResumeBuilderBanner from '@/components/ResumeBuilderBanner';

const ServicesPage = () => {
    const services = [
        {
            icon: Sparkles,
            title: 'Custom Products',
            description: 'Personalize your tech gear and photo products with our high-quality printing services. From T-shirts to photo frames, we make it unique.',
            grad: 'from-[#FF00FB] to-[#4200FF]',
            id: 1
        },
        {
            icon: Shield,
            title: 'Quality Guaranteed',
            description: 'Every product and service at our store undergoes rigorous quality checks to ensure you receive only the best Bhutan has to offer.',
            grad: 'from-[#00F0FF] to-[#0047FF]',
            id: 2
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'We understand the urgency. That is why we provide swift and secure delivery across all 20 dzongkhags of Bhutan.',
            grad: 'from-[#FF005C] to-[#FFBD00]',
            id: 3
        },
        {
            icon: Headphones,
            title: '24/7 Premium Support',
            description: 'Technical issues do not follow a schedule. Our expert support team is available around the clock to assist you with any queries.',
            grad: 'from-[#61FF00] to-[#00FFF0]',
            id: 4
        },
    ];

    return (
        <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-white to-bhutan-cream/20">
            {/* Header */}
            <div className="bhutan-container mb-12 animate-slide-in-up text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon/5 border border-maroon/10 text-maroon text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Our Services
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-gray-900 mb-6 leading-tight">
                    Premium Solutions <br />
                    <span className="bg-gradient-to-r from-maroon via-saffron to-gold bg-clip-text text-transparent">
                        For Your Tech Life
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4">
                    Beyond selling products, we provide high-end services tailored to your digital and creative needs.
                </p>
            </div>

            {/* Resume Builder Section - Primary Highlight */}
            <div className="mb-20">
                <ResumeBuilderBanner />
            </div>

            {/* Core Services Grid */}
            <div className="bhutan-container px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group relative p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 hover:border-white/50 transition-all duration-700 shadow-xl hover:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.12)] transform hover:-translate-y-3 overflow-hidden"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Animated Background Orb */}
                            <div className={cn(
                                "absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-all duration-1000 bg-gradient-to-br",
                                service.grad
                            )} />

                            <div className="relative z-10">
                                <div className={cn(
                                    "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-lg",
                                    "bg-white border border-gray-50"
                                )}>
                                    <service.icon className="w-8 h-8 text-maroon" />
                                </div>

                                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    {service.description}
                                </p>

                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-maroon font-black uppercase tracking-tighter hover:no-underline group/btn"
                                    asChild
                                >
                                    <Link href="/contact">
                                        Inquire Now
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Decorative Corner */}
                            <div className={cn(
                                "absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 translate-x-12 translate-y-12 rounded-full",
                                service.grad
                            )} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bhutanese Hospitality Badge */}
            <div className="mt-24 bhutan-container text-center">
                <div className="max-w-md mx-auto p-8 rounded-[2rem] glass-dark text-white space-y-4 shadow-2xl animate-pulse-slow">
                    <p className="text-sm font-bhutan opacity-80 italic">
                        "Authentic Service, Bhutanese Values"
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-saffron">
                        Trust • Quality • Innovation
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
