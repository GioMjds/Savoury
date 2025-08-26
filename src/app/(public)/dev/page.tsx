import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About the Developer",
    description: "About the Developer",
};

export default function Dev() {
    return (
        <div>
            <h1>About the Developer</h1>
            <p>This page provides information about the developer of the Savoury application.</p>
        </div>
    );
}