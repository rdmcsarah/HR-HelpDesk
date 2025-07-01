// import type { Preview } from '@storybook/react';
// import '../src/app/globals.css';


// import * as nextNavigationMock from './NextNavigationMock';
// declare const jest: any;

// jest.mock('next/navigation', () => nextNavigationMock);

// export const parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: {
//     matchers: { color: /(background|color)$/i, date: /Date$/ },
//   },
// };


// const preview: Preview = {
//   parameters: {
//     actions: { argTypesRegex: '^on[A-Z].*' },
//     controls: {
//       matchers: {
//         color: /(background|color)$/i,
//         date: /Date$/i,
//       },
//     },
//   },
//   tags: ['autodocs'],
// };

// export default preview;


import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
// In your .storybook/preview.js or directly in your story file
import { jest, expect } from '@storybook/jest';

// window.jest = jest;
// If you want to export parameters separately, use the correct object syntax:
export const parameters = {
  // actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
