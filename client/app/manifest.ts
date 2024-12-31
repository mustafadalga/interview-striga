import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Swap Tool",
        short_name: "Swap Tool",
        description: "A powerful currency swap tool for quick and reliable transactions.",
        icons: [
            {
                type: "image/png",
                sizes: "16x16",
                src: "/favicon-16x16.png"
            },
            {
                type: "image/png",
                sizes: "32x32",
                src: "/favicon-32x32.png"
            },
            {
                type: "image/png",
                sizes: "96x96",
                src: "/favicon-96x96.png"
            },
            {
                type: "image/png",
                sizes: "192x192",
                src: "/favicon-192x192.png"
            },
            {
                type: "image/png",
                sizes: "512x512",
                src: "/favicon-512x512.png"
            },
            {
                type: "image/png",
                sizes: "180x180",
                src: "/apple-touch-icon.png"
            }
        ],
        theme_color: "#038947",
        background_color: "#038947",
        display: "standalone",
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        categories: ['crypto', 'finance', 'tools'],
        lang: 'en'
    };
}