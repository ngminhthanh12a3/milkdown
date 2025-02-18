import type { Meta, StoryObj } from '@storybook/html'
import { basicLight } from '@uiw/codemirror-theme-basic'

import crepe from '@milkdown/crepe/theme/crepe.css?inline'
import type { Args } from './setup'
import { setup } from './deslapp-setup'

const meta: Meta = {
  title: 'Crepe/DESLAPP Crepe',
  argTypes: {
    language: {
      options: ['EN'],
      control: { type: 'radio' },
    },
  },
}

export default meta

type Story = StoryObj<Args>

const defaultArgs: Omit<Args, 'instance'> = {
  readonly: false,
  defaultValue: '',
  enableCodemirror: true,
  language: 'EN',
}

export const Empty: Story = {
  render: (args) => {
    return setup({
      args,
      style: crepe,
      theme: basicLight,
    })
  },
  args: {
    ...defaultArgs,
  },
}

// export const WithDefaultValue: Story = {
//   ...Empty,
//   args: {
//     ...defaultArgs,
//     defaultValue: longContent,
//   },
// }

// export const WikiValue: Story = {
//   ...Empty,
//   args: {
//     ...defaultArgs,
//     defaultValue: wikiContent,
//   },
// }
