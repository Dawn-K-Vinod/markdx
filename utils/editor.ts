import { ChangeEvent, KeyboardEvent } from "react"
import { marked } from "marked"

import { UploadResponse, monacoInstance } from "types"
import { env } from "@/env.mjs"
import { editorConfig, shortcuts } from "@/config/editor"
import { cloudinaryUpload } from "@/lib/apiClient"

export const markdownto = {
  html: (markdown: string) => marked.parse(markdown),
  lexer: (markdown: string) => marked.lexer(markdown),
}

export async function uploadFile(
  event: ChangeEvent<HTMLInputElement>
): Promise<UploadResponse> {
  return new Promise<UploadResponse>((resolve, reject) => {
    if (
      !env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ) {
      reject({ message: "Invalid Cloudinary ENV Variables" })
    }

    const selectedFile = event.target.files?.[0]
    const fileName = selectedFile?.name.split(".")[0] || ""
    const isImage = selectedFile?.type.includes("image")
    const fileSizeInMB = selectedFile?.size! / (1024 * 1024) // Convert bytes to MB
    const maxSizeInMB = editorConfig.uploadMaxVideoSize

    if (!isImage && fileSizeInMB > maxSizeInMB) {
      reject({ message: `Video size should be less than ${maxSizeInMB}mb` })
      return
    }

    if (!selectedFile) {
      reject({ message: "No file selected" })
      return
    }

    cloudinaryUpload(selectedFile)
      .then((url) => {
        if (url) {
          let markdown
          if (isImage) {
            markdown = `![${fileName}](${url})`
          } else {
            markdown = `<video controls ><source src="${url}" type="video/mp4"></video>`
          }

          resolve({
            markdown: markdown || "",
            fileName,
            message: isImage
              ? "Images copied to clipboard"
              : "Video copied to clipboard",
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const editorAction = {
  insertText: (text: string, monacoInstance: monacoInstance) => {
    if (monacoInstance) {
      const selection = monacoInstance.getSelection()
      const id = { major: 1, minor: 1 }
      const op = {
        identifier: id,
        range: selection!,
        text,
        forceMoveMarkers: true,
      }
      monacoInstance.executeEdits("", [op])
    }
  },
  setText: (text: string, monacoInstance: monacoInstance) => {
    monacoInstance.setValue(text)
  },
}
export const handleShortCut = (
  event: KeyboardEvent<HTMLDivElement>,
  monacoInstance: monacoInstance
) => {
  if (event.metaKey && event.ctrlKey) {
    event.preventDefault()
    switch (event.key) {
      case "c":
        editorAction.insertText(shortcuts.codeBlock.output, monacoInstance)
        break
      case "t":
        editorAction.insertText(shortcuts.table.output, monacoInstance)
        break
      case "i":
        editorAction.insertText(shortcuts.image.output, monacoInstance)
        break
      case "l":
        editorAction.insertText(shortcuts.link.output, monacoInstance)
        break
      case "n":
        editorAction.insertText(shortcuts.linkWithImage.output, monacoInstance)
        break
      case "v":
        editorAction.insertText(shortcuts.video.output, monacoInstance)
        break
      case "p":
        editorAction.insertText(shortcuts.alignCenter.output, monacoInstance)
        break
    }
  }
}

export const getMarkdownTitle = (markdown: string = "") => {
  const regex = /^(#{1,6}) (.+)/m // Matches lines starting with 1 to 6 hashes followed by a space across multiple lines

  const match = markdown.match(regex)
  const heading = match ? match[2] : null // Extract the captured heading text

  return heading
}
