import { Crepe } from '@milkdown/crepe'
import all from '@milkdown/crepe/theme/common/style.css?inline'
import localStyle from './style.css?inline'
import type { Extension } from '@codemirror/state'
import { injectMarkdown, wrapInShadow } from '../utils/shadow'

export interface Args {
  instance: Crepe
  readonly: boolean
  defaultValue: string
  enableCodemirror: boolean
  language: 'EN' | 'JA'
}

export interface setupConfig {
  args: Args
  style: string
  theme: Extension
}
import type {
  StreamParser} from '@codemirror/language';
import {
  LanguageDescription,
  LanguageSupport,
  StreamLanguage
} from '@codemirror/language'
import { basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

function legacy(parser: StreamParser<unknown>): LanguageSupport {
  return new LanguageSupport(StreamLanguage.define(parser))
}

const myLanguages = [
  LanguageDescription.of({
    name: 'Verilog',
    extensions: ['v'],
    load() {
      return import('@codemirror/legacy-modes/mode/verilog').then((m) =>
        legacy(m.verilog)
      )
    },
  }),
]

export function setup({ args, style, theme }: setupConfig) {
  const {
    wrapper: crepeRoot,
    root,
    shadow,
  } = wrapInShadow([all, style, localStyle])
  const { language } = args
  const markdownContainer = document.createElement('div')
  markdownContainer.classList.add('markdown-container')
  shadow.appendChild(markdownContainer)

  const crepe = new Crepe({
    root: crepeRoot,
    defaultValue: args.defaultValue,
    features: {
      [Crepe.Feature.CodeMirror]: args.enableCodemirror,
    },
    featureConfigs: {
      [Crepe.Feature.LinkTooltip]: {
        inputPlaceholder:
          language === 'JA' ? 'リンクを貼り付け...' : 'Paste link...',
      },
      [Crepe.Feature.ImageBlock]: {
        inlineUploadButton: () =>
          language === 'JA' ? 'アップロード' : 'Upload',
        inlineUploadPlaceholderText:
          language === 'JA' ? 'またはリンクを貼り付ける' : 'or paste link',
        inlineConfirmButton: () => (language === 'JA' ? '確認' : 'Confirm'),
        blockUploadButton: () =>
          language === 'JA' ? 'ファイルをアップロード' : 'Upload file',
        blockUploadPlaceholderText:
          language === 'JA' ? 'またはリンクを貼り付ける' : 'or paste link',
        blockCaptionPlaceholderText:
          language === 'JA' ? '画像の説明を書く...' : 'Write Image Caption',
        blockConfirmButton: () => (language === 'JA' ? '確認' : 'Confirm'),
      },
      [Crepe.Feature.BlockEdit]: {
        slashMenuTextGroupLabel: language === 'JA' ? 'テキスト' : 'Text',
        slashMenuTextLabel: language === 'JA' ? 'テキスト' : 'Text',
        slashMenuH1Label: language === 'JA' ? '見出し1' : 'Heading 1',
        slashMenuH2Label: language === 'JA' ? '見出し2' : 'Heading 2',
        slashMenuH3Label: language === 'JA' ? '見出し3' : 'Heading 3',
        slashMenuH4Label: language === 'JA' ? '見出し4' : 'Heading 4',
        slashMenuH5Label: language === 'JA' ? '見出し5' : 'Heading 5',
        slashMenuH6Label: language === 'JA' ? '見出し6' : 'Heading 6',
        slashMenuQuoteLabel: language === 'JA' ? '引用' : 'Quote',
        slashMenuDividerLabel: language === 'JA' ? '区切り線' : 'Divider',

        slashMenuListGroupLabel: language === 'JA' ? 'リスト' : 'List',
        slashMenuBulletListLabel:
          language === 'JA' ? '箇条書き' : 'Bullet List',
        slashMenuOrderedListLabel:
          language === 'JA' ? '番号付きリスト' : 'Ordered List',
        slashMenuTaskListLabel:
          language === 'JA' ? 'タスクリスト' : 'Task List',

        slashMenuAdvancedGroupLabel:
          language === 'JA' ? '高度な機能' : 'Advanced',
        slashMenuImageLabel: language === 'JA' ? '画像' : 'Image',
        slashMenuCodeBlockLabel: language === 'JA' ? 'コード' : 'Code',
        slashMenuTableLabel: language === 'JA' ? '表' : 'Table',
      },
      [Crepe.Feature.Placeholder]: {
        text:
          language === 'JA'
            ? 'スラッシュコマンドを使用するには/と入力します'
            : 'Type / to use slash command',
      },
      [Crepe.Feature.CodeMirror]: {
        theme,
        searchPlaceholder: language === 'JA' ? '言語を検索' : 'Search language',
        noResultText: language === 'JA' ? '見つかりません' : 'No result',
        previewLabel: () => (language === 'JA' ? 'プレビュー' : 'Preview'),
        previewToggleText: (previewOnlyMode) =>
          language === 'JA'
            ? previewOnlyMode
              ? '編集'
              : '非表示'
            : previewOnlyMode
              ? 'Edit'
              : 'Hide',
        languages: myLanguages,
        extensions: [basicSetup, oneDark, keymap.of(defaultKeymap)],
      },
    },
  })

  if (args.defaultValue) {
    injectMarkdown(args.defaultValue, markdownContainer)
  }

  crepe
    .on((listener) => {
      listener.markdownUpdated((_, markdown) => {
        injectMarkdown(markdown, markdownContainer)
      })
    })
    .setReadonly(args.readonly)
    .create()
    .then(() => {
      args.instance = crepe
    })

  return root
}
