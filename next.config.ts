import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/Yashveer-Singh-Resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="Yashveer-Singh-Resume.pdf"',
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
