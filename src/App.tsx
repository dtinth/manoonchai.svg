import './App.css'
import React, { useState } from 'react'
import Keyboard, { Settings, settingsSchema } from './Keyboard'
import { SettingsEditor } from './SettingsEditor'

export default function App() {
  const [settings, changeSetting] = useSettings()
  return (
    <div className="App">
      <Keyboard settings={settings} />
      <SettingsEditor settings={settings} changeSetting={changeSetting} />
    </div>
  )
}

function useSettings(): [Settings, (key: string, value: string) => void] {
  const [settings, setSettings] = useState<Settings>(
    () =>
      Object.fromEntries(
        Object.entries(settingsSchema).map(
          ([key, { options, default: defaultValue }]) => {
            const localStorageKey = getLocalStorageKey(key)
            const valueFromLocalStorage = localStorage.getItem(localStorageKey)
            const value =
              valueFromLocalStorage && (options as any)[valueFromLocalStorage]
                ? valueFromLocalStorage
                : defaultValue
            return [key, value]
          },
        ),
      ) as any,
  )

  const changeSetting = (key: string, value: string) => {
    const localStorageKey = getLocalStorageKey(key)
    localStorage.setItem(localStorageKey, value)
    setSettings((oldSettings) => {
      return {
        ...oldSettings,
        [key]: value,
      }
    })
  }

  return [settings, changeSetting]

  function getLocalStorageKey(key: string) {
    return `dtinth.layoutvisualizer.${key}`
  }
}
