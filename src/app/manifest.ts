import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tran Quoc Dat - Portfolio",
    short_name: "TQD Portfolio",
    description: "Software Engineer & SAP Technical Consultant",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#2c7a7b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
