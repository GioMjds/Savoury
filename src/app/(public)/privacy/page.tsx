import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn about how Savoury collects, uses, and protects your personal information and data privacy."
}

export default function Privacy() {
    return (
        <div className="min-h-screen pt-12 bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-lighter to-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Your privacy is important to us. This policy explains how we collect, 
                        use, and protect your information when you use Savoury.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        Last updated: September 8, 2025
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <div className="bg-info-light border-l-4 border-info p-6 rounded-r-lg mb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-2 mt-0">
                                Quick Summary
                            </h3>
                            <p className="text-muted-foreground mb-0">
                                We respect your privacy and are committed to protecting your personal data. 
                                We only collect information necessary to provide our services, never sell your data, 
                                and give you control over your information.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Information We Collect */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    1. Information We Collect
                                </h2>
                                
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    Information You Provide
                                </h3>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                                    <li><strong>Account Information:</strong> Name, email address, username, and password when you create an account</li>
                                    <li><strong>Profile Information:</strong> Bio, profile picture, cooking preferences, and social media links</li>
                                    <li><strong>Recipe Content:</strong> Recipes, photos, comments, reviews, and other content you share</li>
                                    <li><strong>Communication:</strong> Messages sent through our contact forms or support channels</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    Information Automatically Collected
                                </h3>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
                                    <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
                                    <li><strong>Cookies:</strong> Small files stored on your device to enhance user experience and remember preferences</li>
                                </ul>
                            </section>

                            {/* How We Use Your Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    2. How We Use Your Information
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    We use the information we collect to provide, maintain, and improve our services:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Create and manage your account</li>
                                    <li>Enable you to share and discover recipes</li>
                                    <li>Facilitate social interactions within the community</li>
                                    <li>Send important notifications about your account and platform updates</li>
                                    <li>Provide customer support and respond to your inquiries</li>
                                    <li>Improve our platform based on usage patterns and feedback</li>
                                    <li>Ensure platform security and prevent abuse</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </section>

                            {/* Information Sharing */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    3. Information Sharing and Disclosure
                                </h2>
                                
                                <div className="bg-success-light border-l-4 border-success p-4 rounded-r-lg mb-4">
                                    <p className="text-foreground font-semibold mb-0">
                                        We do not sell, rent, or trade your personal information to third parties.
                                    </p>
                                </div>

                                <p className="text-muted-foreground mb-4">
                                    We may share your information in the following limited circumstances:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Public Content:</strong> Recipes, comments, and profile information you choose to make public</li>
                                    <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our platform (hosting, email, analytics)</li>
                                    <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                                    <li><strong>With Your Consent:</strong> Any other sharing with your explicit permission</li>
                                </ul>
                            </section>

                            {/* Data Security */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    4. Data Security
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    We implement industry-standard security measures to protect your information:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Secure authentication and password hashing</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Limited access to personal data on a need-to-know basis</li>
                                    <li>Monitoring for unauthorized access and suspicious activity</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    While we strive to protect your information, no method of transmission over the internet 
                                    is 100% secure. We cannot guarantee absolute security.
                                </p>
                            </section>

                            {/* Your Rights and Choices */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    5. Your Rights and Choices
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    You have several rights regarding your personal information:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                                    <li><strong>Update:</strong> Correct or update your account information at any time</li>
                                    <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                                    <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                    <li><strong>Privacy Settings:</strong> Control who can see your recipes and profile information</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    To exercise these rights, please contact us at privacy@savoury.com or through your account settings.
                                </p>
                            </section>

                            {/* Cookies and Tracking */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    6. Cookies and Tracking Technologies
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    We use cookies and similar technologies to enhance your experience:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Essential Cookies:</strong> Required for basic functionality and security</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                                    <li><strong>Functional Cookies:</strong> Enable enhanced features and personalization</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    You can manage cookie preferences through your browser settings, though this may affect some functionality.
                                </p>
                            </section>

                            {/* Children's Privacy */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    7. Children's Privacy
                                </h2>
                                <p className="text-muted-foreground">
                                    Savoury is not intended for children under 13. We do not knowingly collect personal 
                                    information from children under 13. If we become aware that we have collected personal 
                                    information from a child under 13, we will take steps to delete such information promptly.
                                </p>
                            </section>

                            {/* International Users */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    8. International Data Transfers
                                </h2>
                                <p className="text-muted-foreground">
                                    Savoury is operated from the United States. If you are accessing our services from outside 
                                    the US, please be aware that your information may be transferred to, stored, and processed 
                                    in the United States where our servers are located and our central database is operated.
                                </p>
                            </section>

                            {/* Changes to Privacy Policy */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    9. Changes to This Privacy Policy
                                </h2>
                                <p className="text-muted-foreground">
                                    We may update this Privacy Policy from time to time. We will notify you of any material 
                                    changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                                    We encourage you to review this Privacy Policy periodically.
                                </p>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    10. Contact Us
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                                </p>
                                <div className="bg-muted p-6 rounded-lg">
                                    <ul className="text-muted-foreground space-y-2">
                                        <li><strong>Email:</strong> savoury@gmail.com</li>
                                        <li><strong>Contact Form:</strong> <Link href="/contact" className="text-primary hover:underline">Visit our contact page</Link></li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Your Trust Matters
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We're committed to earning and maintaining your trust through transparent privacy practices 
                            and responsible data handling. Your privacy is not just a policy to us—it's a fundamental value.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/contact" 
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                            >
                                Have Questions?
                            </a>
                            <a 
                                href="/register" 
                                className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                            >
                                Join Savoury
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}