import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about Savoury - your modern food recipe sharing platform that connects food enthusiasts worldwide."
}

export default function About() {
    return (
        <div className="min-h-screen pt-16 bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-lighter to-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        About Savoury
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Your modern food recipe sharing platform that brings together food enthusiasts, 
                        home cooks, and culinary experts from around the world.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                            Our Mission
                        </h2>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4 text-primary">
                                    Connecting Food Lovers
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    At Savoury, we believe that food brings people together. Our platform is designed 
                                    to create a vibrant community where culinary enthusiasts can share their favorite 
                                    recipes, discover new flavors, and connect with like-minded food lovers.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Whether you're a seasoned chef or just starting your cooking journey, Savoury 
                                    provides the tools and community support you need to explore, create, and share 
                                    amazing culinary experiences.
                                </p>
                            </div>
                            <div className="bg-muted rounded-xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">🍳</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Share Recipes</h4>
                                            <p className="text-sm text-muted-foreground">Upload and share your favorite recipes with the community</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">👥</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Build Community</h4>
                                            <p className="text-sm text-muted-foreground">Connect with fellow food enthusiasts and learn from each other</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">🌟</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Discover & Inspire</h4>
                                            <p className="text-sm text-muted-foreground">Find inspiration from diverse cuisines and cooking styles</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-8 bg-muted">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">Community First</h3>
                            <p className="text-muted-foreground">
                                We prioritize building a supportive and inclusive community where everyone feels welcome to share and learn.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">✨</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">Quality Content</h3>
                            <p className="text-muted-foreground">
                                We encourage high-quality recipes and content that inspire and help others create amazing dishes.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl">🌍</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">Global Diversity</h3>
                            <p className="text-muted-foreground">
                                We celebrate culinary diversity and promote recipes from all cultures and backgrounds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-light text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Join Our Community?
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Start sharing your recipes and discover amazing dishes from around the world.
                    </p>
                    <Link 
                        href="/register" 
                        className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Get Started Today
                    </Link>
                </div>
            </section>
        </div>
    );
}