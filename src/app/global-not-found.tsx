import './globals.css';
import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';

const kumbhSans = Kumbh_Sans({
	variable: '--font-kumbh-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'The requested page could not be found',
};

export default function GlobalNotFound() {
    return (
        <html lang='en'>
            <body className={`${kumbhSans.variable} ${kumbhSans.style} antialiased`}>
                <h1>Page Not Found</h1>
            </body>
        </html>
    )
}
