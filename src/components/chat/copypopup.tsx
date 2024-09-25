'use client'

import React, { useState, useCallback } from 'react'
import { CopyIcon } from 'lucide-react'
import { toast } from "sonner"

interface SelectableTextProps {
  children: React.ReactNode
}

const SelectableText: React.FC<SelectableTextProps> = ({ children }) => {
  const [showCopyButton, setShowCopyButton] = useState(false)
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 })

  const handleSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      setShowCopyButton(true)
      setCopyPosition({
        x: event.clientX,
        y: event.clientY
      })
    } else {
      setShowCopyButton(false)
    }
  }, [])

  const handleCopy = useCallback(() => {
    const selection = window.getSelection()
    if (selection) {
      navigator.clipboard.writeText(selection.toString())
      setShowCopyButton(false)
      toast.success("Tekst kopieret til udklipsholder!", {
        duration: 500,
      })
    }
  }, [])

  return (
    <div onMouseUp={(e) => handleSelection(e as unknown as MouseEvent)}>
      {children}
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="fixed bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50"
          style={{ top: `${copyPosition.y}px`, left: `${copyPosition.x}px` }}
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default SelectableText