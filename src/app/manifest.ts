import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
        name: "Savoury",
        description: "Unlock your Flavor",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#55ad9b",
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64 32x32 24x24 16x16',
                type: 'image/x-icon'
            }
        ],
	};
}