"use client";
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

const Edit = forwardRef(({},ref) => {
  const editor = useRef(null)

  useImperativeHandle(ref, () => ({
    editor: editor.current,
    setHTML: html => {
      editor.current.innerHTML = html
    },
  }))
  return (
    <div className='edit' ref={editor} contentEditable >
      
  <table>
  <tbody>
    
  </tbody>
</table>
    </div>
  )
})

export default Edit