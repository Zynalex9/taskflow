"use client"

import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface CustomTooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

export function CustomTooltip({ content, children, side = "right", sideOffset = 5 }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  // Calculate position based on trigger element and desired side
  const updatePosition = () => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current?.getBoundingClientRect()
    const tooltipWidth = tooltipRect?.width || 150
    const tooltipHeight = tooltipRect?.height || 40

    let top = 0
    let left = 0

    switch (side) {
      case "top":
        top = triggerRect.top - tooltipHeight - sideOffset
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2
        break
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2
        left = triggerRect.right + sideOffset
        break
      case "bottom":
        top = triggerRect.bottom + sideOffset
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2
        break
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2
        left = triggerRect.left - tooltipWidth - sideOffset
        break
    }

    setPosition({ top, left })
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      // Update position on scroll and resize
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)

      return () => {
        window.removeEventListener("scroll", updatePosition, true)
        window.removeEventListener("resize", updatePosition)
      }
    }
  }, [isVisible])

  // Clone the child element to add event handlers
  const childElement = React.isValidElement(children)
    ? React.cloneElement(children, {
        // @ts-expect-error: ref is valid for DOM elements
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })
    : children

  return (
    <>
      {childElement}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="bg-black text-white px-2 py-1 rounded text-sm shadow-lg animate-in fade-in-50 duration-200"
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-black rotate-45"
              style={{
                ...(side === "left" && { right: "-4px", top: "calc(50% - 4px)" }),
                ...(side === "right" && { left: "-4px", top: "calc(50% - 4px)" }),
                ...(side === "top" && { bottom: "-4px", left: "calc(50% - 4px)" }),
                ...(side === "bottom" && { top: "-4px", left: "calc(50% - 4px)" }),
              }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
