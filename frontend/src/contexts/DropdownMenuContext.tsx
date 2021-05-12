import React, { useState } from 'react'

const DropdownMenuContext = React.createContext<any | null>(null)
const SetDropdownMenuContext = React.createContext<any | null>(null)


function DropdownMenuProvider({children} : any) {
  const [dropdownMenu, setDropdownMenu] = useState<any | null>(null);
  return (
    <DropdownMenuContext.Provider value={dropdownMenu}>
      <SetDropdownMenuContext.Provider value={setDropdownMenu}>
        {children}
      </SetDropdownMenuContext.Provider>
    </DropdownMenuContext.Provider>
  )
}

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (context === undefined) {
    throw new Error('dropdownMenu must be used within a DropdownMenuProvider')
  }
  return context
}

function useSetDropdownMenu() {
  const context = React.useContext(SetDropdownMenuContext)
  if (context === undefined) {
    throw new Error('setDropdownMenu must be used within a DropdownMenuProvider')
  }
  return context
}

export {DropdownMenuProvider, useDropdownMenu, useSetDropdownMenu}