import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Turbopack config
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  // Enable React strict mode
  reactStrictMode: true,
  // Transpile packages
  transpilePackages: ['@captify-io/base', '@captify-io/workspace', '@captify-io/ontology', '@captify-io/flow', '@captify-io/fabric'],
  // Set workspace root to silence warning
  outputFileTracingRoot: '/opt/captify-apps/captify',
  // Skip type checking during build (handled separately via tsc)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure webpack to use source files instead of dist bundles for local packages
  webpack: (config, { isServer }) => {
    // Alias local packages to their source files
    config.resolve.alias = {
      ...config.resolve.alias,
      '@captify-io/base/ui': '/opt/captify-apps/base/src/components/ui',
      '@captify-io/base/layout': '/opt/captify-apps/base/src/components/layout',
      '@captify-io/base/components/layout/captify-provider': '/opt/captify-apps/base/src/components/layout/captify-provider.tsx',
      '@captify-io/base/components/layout/captify-layout': '/opt/captify-apps/base/src/components/layout/captify-layout.tsx',
      '@captify-io/base/lib/api': '/opt/captify-apps/base/src/lib/api.ts',
      '@captify-io/base/lib/utils': '/opt/captify-apps/base/src/lib/utils.ts',
      '@captify-io/base/lib/auth-store': '/opt/captify-apps/base/src/lib/auth-store.ts',
      '@captify-io/base/hooks': '/opt/captify-apps/base/src/hooks',
      '@captify-io/base/types': '/opt/captify-apps/base/src/types',
      '@captify-io/base/services': '/opt/captify-apps/base/src/services',
      '@captify-io/workspace/client': '/opt/captify-apps/workspace/src/client',
      '@captify-io/workspace/server': '/opt/captify-apps/workspace/src/server',
      '@captify-io/workspace/types': '/opt/captify-apps/workspace/src/types',
      '@captify-io/fabric/client': '/opt/captify-apps/fabric/src/client',
      '@captify-io/ontology': '/opt/captify-apps/ontology/src',
      '@captify-io/flow': '/opt/captify-apps/flow/src',
    };

    // Add captify's node_modules to module resolution paths
    // This allows source files from base/workspace to resolve their peer dependencies
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      '/opt/captify-apps/captify/node_modules',
    ];

    return config;
  },
};

export default nextConfig;
