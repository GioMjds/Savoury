import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Savoury team for support, feedback, or partnership opportunities."
}

export default function Contact() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-lighter to-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Contact Us
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div>
                                <h2 className="text-3xl font-bold mb-8 text-foreground">
                                    Get in Touch
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Whether you have questions about our platform, need technical support, 
                                    or want to explore partnership opportunities, we're here to help.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-lg">📧</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                                            <p className="text-muted-foreground">support@savoury.com</p>
                                            <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-lg">💼</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Business Inquiries</h3>
                                            <p className="text-muted-foreground">business@savoury.com</p>
                                            <p className="text-sm text-muted-foreground">For partnerships and collaborations</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-lg">🐛</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Bug Reports</h3>
                                            <p className="text-muted-foreground">bugs@savoury.com</p>
                                            <p className="text-sm text-muted-foreground">Help us improve by reporting issues</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-lg">💡</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">Feature Requests</h3>
                                            <p className="text-muted-foreground">features@savoury.com</p>
                                            <p className="text-sm text-muted-foreground">Share your ideas with us</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-12">
                                    <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                                    <div className="flex space-x-4">
                                        <a 
                                            href="#" 
                                            className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                            aria-label="Twitter"
                                        >
                                            <span>🐦</span>
                                        </a>
                                        <a 
                                            href="#" 
                                            className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                            aria-label="Instagram"
                                        >
                                            <span>📷</span>
                                        </a>
                                        <a 
                                            href="#" 
                                            className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                            aria-label="Facebook"
                                        >
                                            <span>📘</span>
                                        </a>
                                        <a 
                                            href="#" 
                                            className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                            aria-label="LinkedIn"
                                        >
                                            <span>💼</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold mb-6 text-foreground">
                                    Send us a Message
                                </h2>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            Subject
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                                            required
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="business">Business Partnership</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="feature">Feature Request</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-vertical"
                                            placeholder="Tell us how we can help you..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-hover transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-semibold text-foreground mb-2">How do I create an account?</h3>
                                <p className="text-muted-foreground">
                                    Simply click on the "Sign Up" button in the top navigation and fill out the registration form. 
                                    You'll receive a confirmation email to activate your account.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-semibold text-foreground mb-2">Can I share my recipes for free?</h3>
                                <p className="text-muted-foreground">
                                    Yes! Savoury is completely free to use. You can share unlimited recipes and interact with 
                                    the community at no cost.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-semibold text-foreground mb-2">How do I report inappropriate content?</h3>
                                <p className="text-muted-foreground">
                                    Each recipe and comment has a report button. You can also email us directly at 
                                    support@savoury.com with details about the content.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="font-semibold text-foreground mb-2">Do you have a mobile app?</h3>
                                <p className="text-muted-foreground">
                                    Currently, Savoury is available as a responsive web application. We're working on 
                                    native mobile apps which will be available soon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}