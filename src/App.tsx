import './App.css'
import React, { useState } from 'react'
import Keyboard, { Settings, settingsSchema } from './Keyboard'

export default function App() {
  const [settings, changeSetting] = useSettings()
  return (
    <div className="App">
      <Keyboard settings={settings} />
      <p>
        {Object.entries(settingsSchema).map(
          ([key, { options, default: defaultValue }]) => {
            const id = `settings-${key}`
            return (
              <span key={key}>
                <label htmlFor={id}>{key}</label>
                <select
                  id={id}
                  value={(settings as any)[key]}
                  onChange={(e) => changeSetting(key, e.target.value)}
                >
                  {Object.entries(options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </span>
            )
          },
        )}
      </p>
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
