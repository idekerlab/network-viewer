import React, { useState } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'

const DescriptionEditor = (props) => {
  const { description } = props
  let html = '<p>Hey this <strong>editor</strong> rocks 😀</p>'
  if (description !== null && description !== undefined) {
    html = description
  }
  const contentBlock = htmlToDraft(html)
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState))

  const onEditorStateChange: Function = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div>
      <Editor
        toolbarHidden
        editorStyle={{background: '#EEEEEE', padding: '0.5em'}}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  )
}

export default DescriptionEditor
