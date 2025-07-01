// import type { StorybookConfig } from '@storybook/nextjs';
// import path from 'path';

// const config: StorybookConfig = {
//   stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
//   addons: [
//     '@storybook/addon-links',
//     '@storybook/addon-essentials',
//     '@storybook/addon-interactions',
//   ],
//   framework: {
//     name: '@storybook/nextjs',
//     options: {
//       builder: {
//         useSWC: true,
//       }
//     },
//   },
//   docs: {
//     autodocs: 'tag',
//   },
//     webpackFinal: async (config) => {
//     if (!config.resolve) config.resolve = { alias: {} };
//     config.resolve.alias = {
//       ...(config.resolve.alias || {}),
//       'next/navigation': path.resolve(__dirname, 'NextNavigationMock.ts'),
//     };
//     return config;
//   },
//   // Support React 19
//   features: {
//     experimentalRSC: true
//   }

  
// };

// // .storybook/main.js
// module.exports = {
//   // ... your existing config
//   webpackFinal: async (config) => {
//     config.resolve.alias = {
//       ...(config.resolve.alias || {}),
//       'next/navigation': require('path').resolve(__dirname, 'NextNavigationMock.ts'),
//     };
//     return config;
//   },
// };


// export default config;


import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'next/navigation': path.resolve(__dirname, './NextNavigationMock.ts'),
      };
    }
    return config;
  },

  docs: {
    autodocs: true
  }
};
module.exports = {
  // other config...
  staticDirs: ['public'],
};

export default config;
