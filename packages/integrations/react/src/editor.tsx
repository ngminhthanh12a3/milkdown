import type { Editor } from '@milkdown/kit/core'
import type { FC, HTMLAttributes, ReactNode } from 'react'
import React, { useMemo, useRef, useState } from 'react'

import type { EditorInfoCtx, GetEditor } from './types'
import { editorInfoContext, useGetEditor } from './use-get-editor'

export const Milkdown = (props?: HTMLAttributes<HTMLDivElement>) => {
  const domRef = useGetEditor()

  return <div data-milkdown-root ref={domRef} {...(props || {})} />
}

export const MilkdownProvider = ({ children }: { children: ReactNode }) => {
  const dom = useRef<HTMLDivElement | undefined>(undefined)
  const [editorFactory, setEditorFactory] = useState<GetEditor | undefined>(
    undefined
  )
  const editor = useRef<Editor | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const editorInfoCtx = useMemo<EditorInfoCtx>(
    () => ({
      loading,
      dom,
      editor,
      setLoading,
      editorFactory,
      setEditorFactory,
    }),
    [loading, editorFactory]
  )

  return (
    <editorInfoContext.Provider value={editorInfoCtx}>
      {children}
    </editorInfoContext.Provider>
  )
}
