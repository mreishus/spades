import React, { useState } from 'react'

const MousePositionContext = React.createContext<any | null>(null)
const SetMousePositionContext = React.createContext<any | null>(null)


function MousePositionProvider({children} : any) {
  const [mousePosition, setMousePosition] = useState<any | null>(null);
  return (
    <MousePositionContext.Provider value={mousePosition}>
      <SetMousePositionContext.Provider value={setMousePosition}>
        {children}
      </SetMousePositionContext.Provider>
    </MousePositionContext.Provider>
  )
}

function useMousePosition() {
  const context = React.useContext(MousePositionContext)
  if (context === undefined) {
    throw new Error('mousePosition must be used within a MousePositionProvider')
  }
  return context
}

function useSetMousePosition() {
  const context = React.useContext(SetMousePositionContext)
  if (context === undefined) {
    throw new Error('setMousePosition must be used within a MousePositionProvider')
  }
  return context
}

export {MousePositionProvider, useMousePosition, useSetMousePosition}