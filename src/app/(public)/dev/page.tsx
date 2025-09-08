import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About the Developer",
    description: "Meet the developer behind Savoury - learn about the passion and technology that drives our recipe sharing platform.",
};

export default function Dev() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-lighter to-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <Image 
                        src="/mimic4.jpg"
                        alt="Developer Avatar"
                        width={220}
                        height={220}
                        priority
                        className="mx-auto mb-6 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        About the Developer
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Meet the passionate developer behind Savoury and learn about the journey of creating 
                        this modern recipe sharing platform.
                    </p>
                </div>
            </section>

            {/* Developer Introduction */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6 text-foreground">
                                    Hello, I'm the Creator of <span className="text-primary">Savoury</span>
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Welcome to Savoury! I'm a passionate full-stack developer with a love for both 
                                    technology and culinary arts. The idea for Savoury came from my own experience 
                                    of trying to organize and share family recipes with friends and loved ones.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    I literally don&apos;t have an ability to cook such as my mom did, but I do have a passion for creating
                                    intuitive and user-friendly web applications. Savoury is my way of combining these two passions and love
                                    for food, so that others can easily share their favorite recipes and discover new ones.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Savoury is built with modern web technologies and a focus on user experience, 
                                    making it easy for anyone to share their culinary creativity with the world.
                                </p>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Thank you for visiting Savoury. I hope you find it as enjoyable to use as I found it to create!
                                </p>
                            </div>
                            <div className="bg-muted rounded-xl p-8">
                                <h3 className="text-xl font-semibold mb-6 text-foreground">Quick Facts</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary">🎓</span>
                                        <span className="text-muted-foreground">Information Technology Student</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary">🚀</span>
                                        <span className="text-muted-foreground">Web Developer</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary">🌍</span>
                                        <span className="text-muted-foreground">Food Addict, but can't cook lols</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary">☕</span>
                                        <span className="text-muted-foreground">Coffee Addict</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary">📚</span>
                                        <span className="text-muted-foreground">Lifelong Learner</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}