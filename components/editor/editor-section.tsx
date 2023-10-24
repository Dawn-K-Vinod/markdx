"use client"

import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"

import "@/styles/editor.css"
import { editorSelectedContentAtom, monacoInstanceState } from "@/atoms/editor"
import { monacoInstance } from "@/types"
import { useAtom } from "jotai"

function EditorSection({
  markdown,
  onCodeChange,
  loading,
}: {
  markdown: string
  onCodeChange: (value: string) => void
  loading: boolean
}) {
  const { resolvedTheme } = useTheme()
  const [, setMonacoInstance] = useAtom(monacoInstanceState)

  const [, setEditorSelectedContent] = useAtom(editorSelectedContentAtom)

  const editorMount: OnMount = (editorL: monacoInstance) => {
    setMonacoInstance(editorL)
    // Set the selected text in the editor
    editorL.onDidChangeCursorSelection((e) => {
      const selectedText = editorL.getModel()?.getValueInRange(e.selection)
      setEditorSelectedContent(selectedText || "")
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    onCodeChange(value || "")
  }

  return (
    <div className="relative flex h-[50%] w-full flex-1 flex-col items-center lg:h-full lg:w-[46%]">
      <Editor
        language="markdown"
        value={markdown}
        onMount={editorMount}
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
        onChange={handleEditorChange}
        loading="Loading..."
        options={{
          minimap: {
            enabled: false,
          },
          wordWrap: "on",
          wrappingIndent: "indent",
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          lineNumbers: "off",
          overviewRulerLanes: 0,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          glyphMargin: false,
          folding: false,
          renderLineHighlight: "none",
          fontSize: 14,
          readOnly: loading,
          padding: {
            top: 48,
            bottom: 650,
          },
          cursorBlinking: "smooth",
          dragAndDrop: true,
        }}
        className="px-14"
      />
    </div>
  )
}

export default EditorSection
