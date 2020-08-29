import React, { useState } from 'react'


const BroadcastContext = React.createContext<any | null>(null);
const SetBroadcastContext = React.createContext<any | null>(null);


function BroadcastProvider({children} : any) {
  const [broadcast, setBroadcast] = useState<any | null>(null);
  return (
    <BroadcastContext.Provider value={broadcast}>
      <SetBroadcastContext.Provider value={setBroadcast}>
        {children}
      </SetBroadcastContext.Provider>
    </BroadcastContext.Provider>
  )
}

function useBroadcast() {
  const context = React.useContext(BroadcastContext)
  if (context === undefined) {
    throw new Error('broadcast must be used within a BroadcastProvider')
  }
  return context
}

function useSetBroadcast() {
  const context = React.useContext(SetBroadcastContext)
  if (context === undefined) {
    throw new Error('setBroadcast must be used within a BroadcastProvider')
  }
  return context
}

export {BroadcastProvider, useBroadcast, useSetBroadcast}