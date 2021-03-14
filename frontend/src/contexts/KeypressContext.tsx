import React, { useState } from 'react'

interface KeypressType {
  [name: string]: boolean,
}

const KeypressContext = React.createContext<KeypressType>({})
const SetKeyPressContext = React.createContext<any | null>(null)


function KeypressProvider({children} : any) {
  const [keypress, setKeypress] = useState<KeypressType>({"Shift": false});
  return (
    <KeypressContext.Provider value={keypress}>
      <SetKeyPressContext.Provider value={setKeypress}>
        {children}
      </SetKeyPressContext.Provider>
    </KeypressContext.Provider>
  )
}

function useKeypress() {
  const context = React.useContext(KeypressContext)
  if (context === undefined) {
    throw new Error('keypress must be used within a keypressProvider')
  }
  return context
}

function useSetKeypress() {
  const context = React.useContext(SetKeyPressContext)
  if (context === undefined) {
    throw new Error('setKeypress must be used within a keypressProvider')
  }
  return context
}

export {KeypressProvider, useKeypress, useSetKeypress}