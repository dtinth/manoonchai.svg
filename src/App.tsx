import './App.css'
import React from 'react'
import Keyboard, { Settings, settingsSchema } from './Keyboard'

export default function App() {
  const settings = useSettings()
  return (
    <div className="App">
      <Keyboard settings={settings} />
    </div>
  )
}

function useSettings(): Settings {
  return Object.fromEntries(
    Object.entries(settingsSchema).map(([key, { default: defaultValue }]) => {
      return [key, defaultValue]
    }),
  ) as any
}
