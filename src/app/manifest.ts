import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
        name: "Savoury",
        description: "",
        start_url: "/",
        display: "standalone",
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon'
            }
        ]
	};
}