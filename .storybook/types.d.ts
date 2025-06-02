import type { Meta as ReactMeta, StoryObj as ReactStoryObj } from '@storybook/react';

// Re-export the types to make them available when importing from '@storybook/nextjs'
declare module '@storybook/nextjs' {
  export type Meta<T> = ReactMeta<T>;
  export type StoryObj<T> = ReactStoryObj<T>;
}
