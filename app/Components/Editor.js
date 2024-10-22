"use client";
import React, { useEffect, useRef, useState } from 'react'
import MenuBar from './MenuBar'
import ToolBar from './ToolBar'
import { ColorPicker, Divider, Flex, Input, Menu, Modal, Space, Switch } from 'antd'
import Edit from './Edit'
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaLink, FaParagraph, FaRedo, FaUnderline, FaUndo } from "react-icons/fa";
import { BiFontColor, BiHighlight } from "react-icons/bi";
import { TbCell, TbClearFormatting, TbColumns, TbH1, TbH2, TbH3, TbH4, TbTable, TbTextCaption } from "react-icons/tb";
import { RiListUnordered, RiListOrdered } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';

function Editor() {

  const updateTools = (elem) => {
    if (elem) {
      let alignment = elem.style.textAlign;
      let isAlignLeft = alignment === "left",
        isAlignCenter = alignment === "center",
        isAlignRight = alignment === "right",
        isAlignJustify = alignment === "justify"
      let td = elem
      if (elem.tagName !== "TD") {
        td = elem.closest('td')
      }
      setDefaultCellData(
        {
          width: td.style.width,
          padding: td.style.padding,
          borderWidth: td.style.borderWidth,
          borderColor: td.style.borderColor,
          backgroundColor: td.style.backgroundColor,
          cellSpan: td.colSpan
        }
      )

      if (["TD", "SPAN"].includes(elem.tagName)) {
        let isBold = elem.style.fontWeight === "bold",
          isItalic = elem.style.fontStyle === "italic",
          isUnderline = elem.style.textDecoration === "underline"
        setBtnState(
          {
            ...btnstate,
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            "font-size": elem.style.fontSize,
            "align-left": isAlignLeft,
            "align-center": isAlignCenter,
            "align-right": isAlignRight,
            "align-justify": isAlignJustify,
          })

      } else {
        let tags = []
        let parent = elem
        while (parent) {
          if (!["TD", "SPAN"].includes(parent.tagName)) {
            tags.push(parent.tagName)
            parent = parent.parentElement
          }
          else {
            parent = null
          }
        }
        setBtnState(
          {
            ...btnstate,
            bold: tags.includes("B"),
            italic: tags.includes("I"),
            underline: tags.includes("U"),
            "font-size": elem.style.fontSize,
            "align-left": isAlignLeft,
            "align-center": isAlignCenter,
            "align-right": isAlignRight,
            "align-justify": isAlignJustify,
          })
      }
    }
  }

  const [btnstate, setBtnState] = useState({})

  const [activeElement, setActiveElement] = useState("")

  const [tools, setTools] = useState(
    [
      {
        type: "input",
        key: "font-size",
        label: "Font Size",
        action: (e) => {
          setBtnState({ ...btnstate, "font-size": e.target.value })
          setActiveElement(id => {
            let elem = document.getElementById(id)
            if (elem) {
              elem.style.fontSize = e.target.value
            }
            return id
          })
        }
      },
      {
        type: "button",
        key: "undo",
        label: "",
        icon: (<FaUndo />),
        value: false,
        action: () => { undo() }
      },
      {
        type: "button",
        key: "redo",
        label: "",
        icon: (<FaRedo />),
        value: false,
        action: () => { redo() }
      },
      {
        type: "button",
        toggle: true,
        key: "bold",
        label: "",
        icon: (<FaBold />),
        action: (e) => { execCommand(e, "bold") }
      },
      {
        type: "button",
        toggle: true,
        key: "italic",
        label: "",
        icon: (<FaItalic />),
        action: (e) => { execCommand(e, "italic") }
      },
      {
        type: "button",
        toggle: true,
        key: "underline",
        label: "",
        icon: (<FaUnderline />),
        action: (e) => { execCommand(e, "underline") }
      },
      {
        type: "button",
        toggle: true,
        key: "align-left",
        label: "",
        icon: (<FaAlignLeft />),
        action: (e) => { setAlign(e, "left") }
      },
      {
        type: "button",
        toggle: true,
        key: "align-center",
        label: "",
        icon: (<FaAlignCenter />),
        action: (e) => { setAlign(e, "center") }
      },
      {
        type: "button",
        toggle: true,
        key: "align-right",
        label: "",
        icon: (<FaAlignRight />),
        action: (e) => { setAlign(e, "right") }
      },
      {
        type: "button",
        toggle: true,
        key: "align-justify",
        label: "",
        icon: (<FaAlignJustify />),
        action: (e) => { setAlign(e, "justify") }
      },
      {
        type: "color",
        key: "font-color",
        icon: (<BiFontColor />),
        value: "",
        action: (e, c) => {

          const sel = window.getSelection();
          if (sel.toString().length > 0) {
            const range = sel.getRangeAt(0);
            const newNode = document.createElement('span');
            if (sel.anchorNode.parentElement.tagName === "SPAN") {
              sel.anchorNode.parentElement.style.color = c
              return
            }
            newNode.style.color = c;
            range.surroundContents(newNode);
          } else {
            setActiveElement(id => {
              let elem = document.getElementById(id)
              if (elem) {
                elem.style.color = c
              }
              return id
            })
          }
        }
      },
      {
        type: "color",
        key: "highlight-color",
        icon: (<BiHighlight />),
        value: "",
        action: (e, c) => {

          const sel = window.getSelection();
          if (sel.toString().length > 0) {
            const range = sel.getRangeAt(0);
            const newNode = document.createElement('span');
            if (sel.anchorNode.parentElement.tagName === "SPAN") {
              sel.anchorNode.parentElement.style.backgroundColor = c
              return
            }
            newNode.style.backgroundColor = c;
            range.surroundContents(newNode);
          } else {
            setActiveElement(id => {
              let elem = document.getElementById(id)
              if (elem) {
                elem.style.backgroundColor = c
              }
              return id
            })
          }

        }
      },
      {
        type: "button",
        key: "clear-format",
        label: "",
        icon: (<TbClearFormatting fontSize={"18px"} />),
        value: "",
        action: () => {
          setActiveElement(id => {
            let elem = document.getElementById(id)
            if (elem) {
              elem.removeAttribute("style")
              elem.innerHTML = elem.innerText
            }
            updateTools(elem)
            return id;
          })
        }
      },
      {
        type: "button",
        key: "add-link",
        label: "",
        toggle: true,
        icon: (<FaLink />),
        action: () => {
          document.execCommand('createLink', false, "#")
        }
      },
      {
        type: "button",
        key: "add-ul",
        label: "",
        toggle: true,
        icon: (<RiListOrdered fontSize={"18px"} />),
        action: () => {
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const newElement = document.createElement('ul');
            const listItem = document.createElement('li');
            listItem.textContent = 'New List Item';
            newElement.appendChild(listItem);
            range.deleteContents();
            range.insertNode(newElement);
          }

        }
      },
      {
        type: "button",
        key: "add-ol",
        label: "",
        toggle: true,
        icon: (<RiListUnordered fontSize={"18px"} />),
        action: () => {
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const newElement = document.createElement('ol');
            const listItem = document.createElement('li');
            listItem.textContent = 'New List Item';
            newElement.appendChild(listItem);
            range.deleteContents();
            range.insertNode(newElement);
          }
        }
      }

    ])

  const maxCols = () => {
    let max = 0
    document.querySelectorAll('tr').forEach(row => {
      max = Math.max(max, row.children.length)
    })
    return max
  }

  const getRow = () => {
    let row = document.createElement('tr')
    for (let i = 0; i < maxCols(); i++) {
      let cell = document.createElement('td')
      cell.id = uuidv4()
      row.appendChild(cell)
    }
    return row
  }

  const getCol = () => {
    let col = document.createElement('td')
    col.id = uuidv4()
    return col
  }

  const [RowCopy, setRowCopy] = useState(null)

  const [ColCopy, setColCopy] = useState(null)

  const format = (tag) => {

    setActiveElement(id => {
      let elem = document.getElementById(id)
      if (elem) {
        if (elem.children[0]) {
          if (["H1", "H2", "H3", "H4", "P"].includes(elem.children[0].tagName)) {
            elem.children[0].outerHTML = `<${tag}>${elem.children[0].innerHTML}</${tag}>`
            return id
          }
        }
        let newElem = document.createElement(tag)
        newElem.innerHTML = elem.innerHTML
        elem.innerHTML = newElem.outerHTML
      }
      return id
    })

  }

  const menu = {
    Cell: [

      {
        key: "merge-cells",
        label: "Merge",
        onClick: () => { MergeCol() }
      },
      {
        key: "split-cells",
        label: "Split",
        onClick: () => { SplitCol() }
      }
    ],
    Row: [
      {
        key: "insert-row-above",
        label: "Insert Above",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            let row = elem.closest('tr')
            let newRow = getRow()
            row.parentNode.insertBefore(newRow, row)
          }

        },
      },
      {
        key: "insert-row-below",
        label: "Insert Below",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            let row = elem.closest('tr')
            let newRow = getRow()
            row.parentNode.insertBefore(newRow, row.nextElementSibling)
          }

        },
      },
      {
        key: "delete-row",
        label: "Delete",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            let row = elem.closest('tr')
            row.remove()
          }

        }
      },
      {
        key: "cut-row",
        label: "Cut",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            setRowCopy(elem.closest('tr').cloneNode(true))
            elem.closest('tr').remove()
          }

        }

      },
      {
        key: "copy-row",
        label: "Copy",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            setRowCopy(elem.closest('tr').cloneNode(true))
          }

        }
      },
      {
        key: "paste-row-above",
        label: "Paste Above",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem && RowCopy) {
            elem.closest('tr').parentNode.insertBefore(RowCopy, elem.closest('tr'))
          }

        }
      },
      {
        key: "paste-row-below",
        label: "Paste Below",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem && RowCopy) {
            elem.closest('tr').parentNode.insertBefore(RowCopy, elem.closest('tr').nextElementSibling)
          }

        }
      },
    ],
    Column: [
      {
        key: "insert-column-left",
        label: "Insert Left",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            let col = getCol()
            elem.parentElement.insertBefore(col, elem)
          }

        }

      },
      {
        key: "insert-column-right",
        label: "Insert Right",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            let col = getCol()
            if (elem.nextElementSibling) {
              elem.parentElement.insertBefore(col, elem.nextElementSibling)
            } else {
              elem.parentElement.appendChild(col)
            }
          }

        }
      },
      {
        key: "delete-column",
        label: "Delete",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            elem.remove()
          }

        }
      },
      {
        key: "cut-column",
        label: "Cut",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            setColCopy(elem.cloneNode(true))
            elem.remove()
          }

        }
      },
      {
        key: "copy-column",
        label: "Copy",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem) {
            setColCopy(elem.cloneNode(true))
          }
        }
      },
      {
        key: "paste-column-left",
        label: "Paste Left",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem && ColCopy) {
            elem.parentElement.insertBefore(ColCopy, elem)
          }

        }
      },
      {
        key: "paste-column-right",
        label: "Paste Right",
        onClick: () => {
          let elem = document.getElementById(activeElement)
          if (elem && ColCopy) {
            if (elem.nextElementSibling) {
              elem.parentElement.insertBefore(ColCopy, elem.nextElementSibling)
            } else {
              elem.parentElement.appendChild(ColCopy)
            }
          }

        }

      }
    ],
    Insert: [
      {
        label: (<Flex gap={4} align='center'><TbTextCaption /><p>Text</p></Flex>),
        key: "Text",
        onClick: () => {
          setActiveElement(id => {
            let elem = document.getElementById(id)
            if (elem) {
              if (elem.children[0]) {
                elem.innerHTML = elem.children[0].innerHTML
              }
            }
            return id
          })
        }
      },
      {
        label: (<Flex gap={4} align='center'><FaParagraph /><p>Paragraph</p></Flex>),
        key: "paragraph",
        onClick: () => {
          format('p')
        }
      },
      {
        label: (<Flex gap={4} align='center'><TbH1 /><p>Heading 1</p></Flex>),
        key: "heading1",
        onClick: () => {
          format('h1')
        }
      },
      {
        label: (<Flex gap={4} align='center'><TbH2 /><p>Heading 2</p></Flex>),
        key: "heading2",
        onClick: () => {
          format('h2')
        }
      },
      {
        label: (<Flex gap={4} align='center'><TbH3 /><p>Heading 3</p></Flex>),
        key: "heading3",
        onClick: () => {
          format('h3')
        }
      },
      {
        label: (<Flex gap={4} align='center'><TbH4 /><p>Heading 4</p></Flex>),
        key: "heading4",
        onClick: () => {
          format('h4')
        }
      },
    ]
  };
  const menuBtns = [
    {
      key: "property",
      label: "Property",
      onClick: () => { setIsPropertyOpened(true) }
    },
    {
      key: "new",
      label: "New",
      onClick: () => { setIsNewTableOpened(true) }
    },
    {
      key: "load",
      label: "Load",
      onClick: () => { loadTableFile() }
    },
    {
      key: "save",
      label: "Save",
      onClick: () => { saveFile() }
    },
    {
      key: "copy",
      label: "Copy",
      onClick: () => { copyHTML() }
    }
  ]

  const editor = useRef(null)

  const cmds = { "bold": "B", "italic": "I", "underline": "U", "font-size": "" }

  const execCommand = (e, cmd) => {
    e.preventDefault();
    let sel = window.getSelection()
    if (sel.toString().length > 0) {
      document.execCommand(cmd, false, null)
    } else {
      let parent = sel.anchorNode.parentElement
      if (["TD", "SPAN"].includes(parent.tagName)) {
        if (cmd === "bold") {
          parent.style.fontWeight = parent.style.fontWeight === "bold" ? "normal" : "bold"
        } else if (cmd === "italic") {
          parent.style.fontStyle = parent.style.fontStyle === "italic" ? "normal" : "italic"
        } else if (cmd === "underline") {
          parent.style.textDecoration = parent.style.textDecoration === "underline" ? "none" : "underline"
        }

      } else {
        if (cmds[cmd] == parent.tagName) {
          parent.outerHTML = parent.innerHTML
        } else {
          let newElem = document.createElement(cmds[cmd])
          newElem.innerHTML = parent.outerHTML
          parent.outerHTML = newElem.outerHTML
        }

      }
      updateTools(parent)
    }
  }

  const setAlign = (e, align) => {

    setActiveElement(id => {
      let parent = document.getElementById(id)
      if (parent)
        parent.style.textAlign = align
      return id
    })
  }


  const [Link, setLink] = useState()

  const isEffect = useRef(false)

  useEffect(() => {
    if (isEffect.current === false) {
      setHistory([editor.current?.editor.innerHTML]);
      editor.current?.editor.addEventListener('click', (e) => {
        if (e.ctrlKey || e.MetaKey) {
          setSelectedCells(prevState => {
            let cells = [...prevState]
            let elem = e.target.id, target = e.target
            if (e.target.tagName !== "TD") {
              elem = e.target.closest('td').id
              target = e.target.closest('td')
            }
            if (elem) {
              if (cells.includes(elem)) {
                target.classList.remove('selected')
                cells = cells.filter(cell => cell !== elem)
              } else {
                target.classList.add('selected')
                cells.push(elem)
              }
            }
            return cells
          })
          return
        } else {
          setSelectedCells(prevState => {
            let cells = [...prevState]
            cells.forEach(cell => {
              let elem = document.getElementById(cell)
              if (elem) {
                elem.classList.remove('selected')
              }
            })
            return []
          })
        }
        let elem = e.target
        if (elem.tagName === "A") {
          setLink(elem)
          setIsOpened(true)
          setLinkTxt(elem.innerText)
          setLinkUrl(elem.href)
          return
        } else {
          setLink(null)
        }
        if (!["TD", "SPAN", "B", "U", "I"].includes(elem.tagName)) {
          elem = elem.closest('td')
        }
        if (elem) {
          updateTools(elem)
          setActiveElement(elem.id)
        }
      }, [])
      const callback = (mutationsList, observer) => {
        if (mutationsList[0].type !== 'childList') {
          handleContentChange(editor.current?.editor.innerHTML)

        }
      }

      const observer = new MutationObserver(callback);

      const config = { attributes: true, childList: true, subtree: true };

      if (editor.current?.editor) {
        observer.observe(editor.current.editor, config);
      }

      document.addEventListener('DOMContentLoaded', (event) => {
        const table = document.querySelector('table[contenteditable="true"]');

        table.addEventListener('keydown', (e) => {
          const isTdOrTr = ["TR", "TD", "P", "H1", "H2", "H3", "H4"].contains(e.target.tagName);
          const isBackspaceOrDelete = e.key === 'Backspace' || e.key === 'Delete';

          if (isTdOrTr && isBackspaceOrDelete) {
            e.preventDefault();
          }
        });
      });

      return () => { isEffect.current = true;  };

    };
  }, [])

  const maxColsSpan = () => {
    let max = 0
    document.querySelectorAll('tr').forEach(row => {
      let colSpan = 0
      Array.from(row.children).forEach(cell => {
        if (cell.colSpan > 1) {
          colSpan += cell.colSpan
        } else {
          colSpan += 1
        }
      })
      max = Math.max(max, colSpan)
    })
    return max
  }

  const SplitCol = () => {
    let Col = document.getElementById(activeElement)
    const totalCols = maxColsSpan()
    if (!Col) return;

    const newCell = document.createElement('td');
    newCell.id = uuidv4()

    Col.parentNode.insertBefore(newCell, Col.nextSibling);
    if (Col.colSpan > 1 && Col.colSpan % 2 === 0) {
      Col.colSpan = Col.colSpan / 2
      newCell.colSpan = Col.colSpan / 2
    } else if (Col.colSpan > 1 && Col.colSpan % 2 !== 0) {
      Col.colSpan = Math.floor(Col.colSpan / 2)
      newCell.colSpan = Math.ceil(Col.colSpan / 2)
    }


    if (maxColsSpan() > totalCols) {
      let samp = Col
      let prow = Col.closest('tr')
      let sampx = samp.getBoundingClientRect().left + samp.width / 2

      let rows = Array.from(document.querySelectorAll("table")[0].querySelectorAll('tr'))
      rows.forEach((row) => {
        if (row === prow) return
        let cells = Array.from(row.children)
        let rcspan = 0
        cells.forEach((cell) => {
          rcspan += cell.colSpan
        })
        if (rcspan < maxColsSpan()) {
          let cellAtY = null
          let diff = maxColsSpan() - rcspan
          let hasBelow = false
          cells.forEach((cell) => {
            let x = cell.getBoundingClientRect().left + cell.width / 2
            if (sampx === x && !hasBelow) {
              cellAtY = cell
              hasBelow = true
            }
          })
          if (!hasBelow) {
            cellAtY = cells[cells.length - 1]
          }
          cellAtY.colSpan += diff
        }
      })
    }


  };


  const MergeCol = () => {
    let sel = selectedCells
    if (sel.length === 0) return
    let isInRow = true
    let cr = document.getElementById(sel[0]).closest('tr');
    sel.forEach((cell) => {
      let nr = document.getElementById(cell).parentElement
      if (nr !== cr) {
        isInRow = false
      }
    })
    if (isInRow) {
      let celltr = {}
      let trs = Array.from(document.getElementById(sel[0]).closest('tr').children)
      sel.forEach((cell) => {
        celltr[trs.indexOf(cell)] = cell
      })
      let topind = Object.keys(celltr)[0];
      for (let i = 0; i < Object.keys(celltr).length; i++) {
        if (topind > Object.keys(celltr)[i]) {
          topind = Object.keys(celltr)[i]
        }
      }

      let colSpan = 0;
      sel.forEach((cell) => {
        colSpan += document.getElementById(cell).colSpan
      })
      document.getElementById(sel[0]).colSpan = colSpan;
      for (let i = 1; i < sel.length; i++) {
        try {
          document.getElementById(sel[0]).children[0].innerHTML += document.getElementById(sel[i]).children[0].innerHTML
        } catch (e) {
          document.getElementById(sel[0]).innerHTML += document.getElementById(sel[i]).innerHTML

        }
        document.getElementById(sel[i]).remove()

      }
      document.getElementById(sel[0]).classList.remove('selected')

      setSelectedCells([]);

    } else {
      let isinCenter = true
      let coords = []
      let samp = document.getElementById(selectedCells[0])
      let sampx = samp.getBoundingClientRect().left + samp.width / 2
      coords.push(Math.floor(sampx))
      let comSpan = document.getElementById(selectedCells[0]).colSpan;
      selectedCells.forEach((cell) => {
        if (document.getElementById(cell).colSpan !== comSpan) {
          isinCenter = false
        }
        let x = document.getElementById(cell).getBoundingClientRect().left + document.getElementById(cell).width / 2
        x = Math.floor(x)
        if (!coords.includes(x)) {
          isinCenter = false
        }

      })

      const parentRows = selectedCells.map(cell => document.getElementById(cell).closest('tr'));
      const sortedParentRows = parentRows.sort((a, b) => {

        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

      for (let i = 0; i < sortedParentRows.length - 1; i++) {
        if (sortedParentRows[i].nextElementSibling !== sortedParentRows[i + 1]) {
          isinCenter = false;
        }
      }
      if (isinCenter) {
        let celltr = {}
        let trs = Array.from(document.querySelectorAll('table')[0].querySelectorAll('tr'))

        selectedCells.forEach((cell) => {
          celltr[trs.indexOf(document.getElementById(cell).closest('tr'))] = document.getElementById(cell)
        })
        let topind = Object.keys(celltr)[0];
        for (let i = 0; i < Object.keys(celltr).length; i++) {
          if (topind > Object.keys(celltr)[i]) {
            topind = Object.keys(celltr)[i]
          }
        }
        let rowSpan = 0;
        for (let i = 0; i < selectedCells.length; i++) {
          rowSpan += document.getElementById(selectedCells[i]).rowSpan
          if (document.getElementById(selectedCells[i]) !== celltr[topind]) {
            try {
              celltr[topind].children[0].innerHTML += document.getElementById(selectedCells[i]).children[0].innerHTML
            } catch (e) {
              celltr[topind].innerHTML += document.getElementById(selectedCells[i]).innerHTML

            }
            document.getElementById(selectedCells[i]).remove()
          }
        }
        celltr[topind].rowSpan = rowSpan

      }
    }

  }

  const [isOpened, setIsOpened] = useState(false)

  const onOk = () => {
    if (Link) {
      Link.innerText = linktxt
      Link.href = linkurl
    }
    setIsOpened(false)
  }

  const [linktxt, setLinkTxt] = useState('')
  const [linkurl, setLinkUrl] = useState('')

  const items = [
    {
      label: "Table",
      key: "table",
      icon: <TbTable />,
    },
    {
      label: "Cell",
      key: "cell",
      icon: <TbCell />
    },
    {
      label: "Row",
      key: "row",
      icon: <TbColumns />
    }
  ]

  const [currentProperty, setCurrentProperty] = useState("cell")

  const [isTableDefault, setIsTableDefault] = useState(true)
  const [isCellDefault, setIsCellDefault] = useState(true)
  const [isRowDefault, setIsRowDefault] = useState(true)

  const ConstDefaultTableData = {
    width: "100%",
    padding: "5px",
    borderWidth: "1px",
    borderColor: "#000000",
    backgroundColor: "#ffffff"
  }

  const [defaultTableData, setDefaultTableData] = useState(
    {
      width: "1170px",
      padding: "5px",
      borderWidth: "1px",
      borderColor: "#000000",
      backgroundColor: "#ffffff"
    })
  const [defaultCellData, setDefaultCellData] = useState(
    {
      width: "",
      padding: "5px",
      borderWidth: "1px",
      borderColor: "#000000",
      backgroundColor: "#ffffff",
      colSpan: 1
    })

  const [defaultRowData, setDefaultRowData] = useState(
    {
      height: "",
      rowSpan: 1
    })

  const [isPropertyOpened, setIsPropertyOpened] = useState(false)

  const onPropertyOk = () => {
    currentProperty === "table" && (
      document.querySelectorAll('table')[0].style = `width:${defaultTableData.width};padding:${defaultTableData.padding};border-width:${defaultTableData.borderWidth};border-color:${defaultTableData.borderColor};background-color:${defaultTableData.backgroundColor}`
    )
    currentProperty === "cell" && (
      setActiveElement(id => {
        let elem = document.getElementById(id)
        if (elem) {
          elem.style = `width:${defaultCellData.width};padding:${defaultCellData.padding};border-width:${defaultCellData.borderWidth};border-color:${defaultCellData.borderColor};background-color:${defaultCellData.backgroundColor};`
          elem.setAttribute('colspan', defaultCellData.colSpan)
        }
        return id
      })
    )
    currentProperty === "row" && (
      setActiveElement(id => {
        let td = document.getElementById(id)
        let elem = td.closest('tr')
        if (elem) {
          elem.style = `height:${defaultRowData.height};`
          td.setAttribute('rowspan', defaultRowData.rowSpan)
        }
        return id
      })
    )
    setIsPropertyOpened(false)
  }

  const [isNewTableOpened, setIsNewTableOpened] = useState(false)

  const [newTableData, setNewTableData] = useState({ rows: 1, cols: 1 })

  const onNewTableOk = () => {
    let table = document.createElement('table')
    for (let i = 0; i < newTableData.rows; i++) {
      let row = getRow()
      for (let j = 0; j < newTableData.cols; j++) {
        let cell = getCol()
        row.appendChild(cell)
      }
      table.appendChild(row)
    }
    table.style = `width:${defaultTableData.width};`
    document.getElementsByClassName("edit")[0].innerHTML = table.outerHTML
    setIsNewTableOpened(false)
  }

  const loadTableFile = () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.html'
    input.click()
    input.addEventListener('change', (e) => {
      let reader = new FileReader()
      reader.onload = (e) => {
        document.querySelectorAll("table")[0].outerHTML = e.target.result
        let tds = document.querySelectorAll('td')
        tds.forEach(td => {
          td.id = uuidv4()
        })
      }
      reader.readAsText(e.target.files[0])
    })
  }

  const saveFile = () => {
    let table = document.querySelectorAll("table")[0]
    let a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([table.outerHTML], { type: 'text/html' }))
    a.download = 'table.html'
    a.click()
  }

  const copyHTML = () => {
    let table = document.querySelectorAll("table")[0]
    if (navigator.clipboard) {
      navigator.clipboard.writeText(table.outerHTML)
      window.alert('Table copied to clipboard');
    }
    else {
      let input = document.createElement('input')
      input.value = table.outerHTML
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  }


  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUndo, setIsUndo] = useState(false);


  const [selectedCells, setSelectedCells] = useState([]);



  const handleContentChange = (newContent) => {
    setHistory(pervState => {
      let updatedHistory = pervState;

      if (isUndo) {
        updatedHistory = pervState.slice(0, currentIndex + 1);
        setIsUndo(false);
      }
      updatedHistory.push(newContent);
      setCurrentIndex(updatedHistory.length - 1);
      console.log(updatedHistory.length)
      return updatedHistory
    });
  };

  const undo = () => {
    setCurrentIndex(pervState => {
      setHistory(prevHistory => {
        if (pervState > 1) {
          pervState = pervState - 1;
          editor.current?.setHTML(prevHistory[pervState - 1]);
        }
        return prevHistory
      })
      return pervState
    })
  };

  const redo = () => {
    console.log("reo")
    setCurrentIndex(prevState => {
      setHistory(prevHistory => {
        if (prevState < prevHistory.length - 1) {
          prevState += 1;
          editor.current?.setHTML(prevHistory[prevState + 1]);
        }
        return prevHistory
      })
      return prevState
    })
  };



  return (
    <div className='editor-box'>
      <MenuBar menu={menu} menuBtns={menuBtns} />
      <ToolBar state={btnstate} tools={tools} />
      <Divider style={{ margin: "5px", minWidth: "99%", width: "99%", borderColor: "#d0d0d0" }} />
      <Edit ref={editor} />
      <Modal open={isOpened} onOk={onOk} onCancel={() => { setIsOpened(false) }} onClose={() => { setIsOpened(false) }}>
        <h1>Link</h1>
        <label>Text</label>
        <Input value={linktxt} onInput={(e) => { setLinkTxt(e.target.value) }} placeholder="Text" />
        <label>URL</label>
        <Input value={linkurl} onInput={(e) => { setLinkUrl(e.target.value) }} placeholder="URL" />
      </Modal>
      <Modal width={600} open={isPropertyOpened} onOk={onPropertyOk} onCancel={() => { setIsPropertyOpened(false) }} onClose={() => { setIsPropertyOpened(false) }}>
        <h1>Property</h1>
        <Flex vertical={false}>
          <Menu
            style={{
              minWidth: 150,
              width: 150,
              display: "block"
            }}
            mode="inline"
            onClick={(e) => { setCurrentProperty(e.key) }}
            selectedKeys={[currentProperty]}
            items={items} />
          {currentProperty === "table" &&
            <>
              <Flex vertical gap={5} style={{ margin: 10 }}>
                <Flex vertical={false} gap={5} style={{ margin: 10, alignItems: "center", height: "min-content" }}>
                  <Switch checked={isTableDefault} onChange={(v) => { v && setDefaultTableData(ConstDefaultTableData); setIsTableDefault(v) }} size='small' />
                  <p>Default</p>

                </Flex>
                <Flex vertical gap={5} style={{ alignItems: "start" }}>

                  <label>Width</label>
                  <Input onInput={(e) => {
                    setDefaultTableData({ ...defaultTableData, width: e.target.value })
                  }} value={defaultTableData.width} disabled={isTableDefault} placeholder="Width" />
                  <label>Cell Padding</label>
                  <Input onInput={(e) => {
                    setDefaultTableData({ ...defaultTableData, padding: e.target.value })
                  }} value={defaultTableData.padding} disabled={isTableDefault} placeholder="Padding" />
                  <label>Border Width</label>
                  <Input onInput={(e) => {
                    setDefaultTableData({ ...defaultTableData, borderWidth: e.target.value })
                  }} value={defaultTableData.borderWidth} disabled={isTableDefault} placeholder="Width" />
                  <label>Border Color</label>
                  <ColorPicker onChange={(e, c) => {
                    setDefaultTableData({ ...defaultTableData, borderColor: c })
                  }} value={defaultTableData.borderColor} disabled={isTableDefault} />
                  <label>Background Color</label>
                  <ColorPicker onChange={(e, c) => {
                    setDefaultTableData({ ...defaultTableData, backgroundColor: c })
                  }} value={defaultTableData.backgroundColor} disabled={isTableDefault} />
                </Flex>
              </Flex>
            </>
          }
          {currentProperty === "cell" &&
            <>
              <Flex vertical gap={5} style={{ margin: 10 }}>
                <Flex vertical={false} gap={5} style={{ margin: 10, alignItems: "center", height: "min-content" }}>
                  <Switch checked={isCellDefault} onChange={(v) => {
                    v && (
                      setActiveElement(id => {
                        let elem = document.getElementById(id)
                        if (elem) {
                          elem.style.width = ""
                          elem.style.padding = ""
                          elem.style.borderWidth = ""
                          elem.style.borderColor = ""
                          elem.style.backgroundColor = ""
                          elem.colSpan = 1
                          setDefaultCellData({ width: "", padding: "5px", borderWidth: "1px", borderColor: "#000000", backgroundColor: "#ffffff", cellSpan: 1 })
                        }
                        return id
                      })
                    ); setIsCellDefault(v)
                  }} size='small' />
                  <p>Default</p>

                </Flex>
                <Flex vertical gap={5} style={{ alignItems: "start" }}>

                  <label>Width</label>
                  <Input onInput={(e) => {
                    setDefaultCellData({ ...defaultCellData, width: e.target.value })
                  }} value={defaultCellData.width} disabled={isCellDefault} placeholder="Width" />
                  <label>Cell Padding</label>
                  <Input onInput={(e) => {
                    setDefaultCellData({ ...defaultCellData, padding: e.target.value })
                  }} value={defaultCellData.padding} disabled={isCellDefault} placeholder="Padding" />
                  <label>Border Width</label>
                  <Input onInput={(e) => {
                    setDefaultCellData({ ...defaultCellData, borderWidth: e.target.value })
                  }} value={defaultCellData.borderWidth} disabled={isCellDefault} placeholder="Width" />
                  <label>Border Color</label>
                  <ColorPicker onChange={(e, c) => {
                    setDefaultCellData({ ...defaultCellData, borderColor: c })
                  }} value={defaultCellData.borderColor} disabled={isCellDefault} />
                  <label>Background Color</label>
                  <ColorPicker onChange={(e, c) => {
                    setDefaultCellData({ ...defaultCellData, backgroundColor: c })
                  }} value={defaultCellData.backgroundColor} disabled={isCellDefault} />
                  <label>Cell Span</label>
                  <Input onInput={(e) => {
                    setDefaultCellData({ ...defaultCellData, cellSpan: e.target.value })
                  }} value={defaultCellData.cellSpan} disabled={isCellDefault} placeholder="Cell Span" />
                </Flex>
              </Flex>
            </>
          }
          {currentProperty === "row" &&
            <>
              <Flex vertical gap={5} style={{ margin: 10 }}>
                <Flex vertical={false} gap={5} style={{ margin: 10, alignItems: "center", height: "min-content" }}>
                  <Switch checked={isRowDefault} onChange={(v) => {
                    v && (
                      setActiveElement(id => {
                        let elem = document.getElementById(id).closest('tr')
                        if (elem) {
                          elem.style.height = ""
                          elem.rowSpan = 1
                          setDefaultRowData({ height: "", rowSpan: 1 })
                        }
                        return id
                      }
                      )
                    ); setIsRowDefault(v)
                  }} size='small' />
                  <p>Default</p>

                </Flex>
                <Flex vertical gap={5} style={{ alignItems: "start" }}>

                  <label>Height</label>
                  <Input onInput={(e) => {
                    setDefaultRowData({ ...defaultRowData, height: e.target.value })
                  }} value={defaultRowData.height} disabled={isRowDefault} placeholder="Height" />
                  <label>Row Span</label>
                  <Input onInput={(e) => {
                    setDefaultRowData({ ...defaultRowData, rowSpan: e.target.value })
                  }} value={defaultRowData.rowSpan} disabled={isRowDefault} placeholder="Row Span" />

                </Flex>
              </Flex>
            </>
          }
        </Flex>
      </Modal>
      <Modal open={isNewTableOpened} onOk={onNewTableOk} onCancel={() => { setIsNewTableOpened(false) }} onClose={() => { setIsNewTableOpened(false) }}>
        <h1>New Table</h1>
        <label>Rows</label>
        <Input value={newTableData.rows} onInput={(e) => { setNewTableData({ ...newTableData, rows: e.target.value }) }} placeholder="Rows" />
        <label>Columns</label>
        <Input value={newTableData.cols} onInput={(e) => { setNewTableData({ ...newTableData, cols: e.target.value }) }} placeholder="Columns" />
      </Modal>
    </div>
  )
}

export default Editor