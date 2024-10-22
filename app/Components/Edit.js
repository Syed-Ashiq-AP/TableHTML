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
      
  <table style={{width:"1170px"}}>
  <tbody>
    <tr>
      <td id='t1'>
        At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.

      </td>
    </tr>
    <tr>
      
    <td id='t2'>
        At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.

      </td>
    </tr>
  </tbody>
</table>
    </div>
  )
})

export default Edit