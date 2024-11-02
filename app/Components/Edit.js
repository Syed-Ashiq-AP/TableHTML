"use client";
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

const Edit = forwardRef(({classData},ref) => {
  const editor = useRef(null)

  useImperativeHandle(ref, () => ({
    editor: editor.current,
    setHTML: html => {
      editor.current.innerHTML = html
    },
  }))

  const style = ()=> {
    let style=''
    Object.keys(classData).forEach((key) => {
      let data = classData[key]
      style +=`
              .${key}{
              ${data[0] && `background-color: ${data[0]}!important;`}
              ${data[1] && `font-size: ${data[2]}!important;`}
              ${data[2] && `color: ${data[1]}!important;`}
              }
            `
    })
    return style
  }

  return (
    <div className='edit' ref={editor} suppressContentEditableWarning contentEditable >

      <style>{style()}</style>
      
  <table>
  <tbody>
    
  </tbody>
</table>
    </div>
  )
})

export default Edit