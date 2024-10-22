"use client";
import { Button, ColorPicker, Input } from 'antd';
import React, { forwardRef, useEffect, useState } from 'react'


const ToolBar = ({tools,state})=> {
  
    return (
        <div className='tool-bar'>
            {
                tools.map(tool => {
                    if (tool.type === "input") {
                        return (
                            <Input key={tool.key} style={{width:"80px"}} placeholder={tool.label} type="text" value={state[tool.key]} onInput={tool.action}/>
                        )
                    } else if (tool.type === "button") {
                        return (
                            <Button key={tool.key} onClick={tool.action} type="text" variant={tool.toggle&&state[tool.key]&&"solid"} color='default' icon={tool.icon} />
                        )
                    } else if (tool.type === "color"){
                        return (
                            <ColorPicker  key={tool.key} defaultValue={tool.value} onChange={tool.action} allowClear disabledAlpha>
                                <Button key={"trigger-color-"+tool.key} type="text" style={{fontSize:"18px"}} icon={tool.icon} />
                            </ColorPicker>
                        )
                    }
                })
            }
        </div>
    )
}

export default ToolBar