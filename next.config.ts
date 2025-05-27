import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables all ESLint checks during build (use cautiously)
    // Or, to disable specific rules:
    // rules: {
    //   '@typescript-eslint/no-explicit-any': 'off',
    //   '@typescript-eslint/no-unused-vars': 'off',
    // },
  },
};

export default nextConfig;
