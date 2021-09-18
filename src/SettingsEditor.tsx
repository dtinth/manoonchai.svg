import React from 'react'
import { Settings, settingsSchema } from './Keyboard'

export function SettingsEditor({
  settings,
  changeSetting,
}: {
  settings: Settings
  changeSetting: (key: string, value: string) => void
}) {
  return (
    <form action="/api/svg">
      <p>
        {Object.entries(settingsSchema).map(
          ([key, { options, default: defaultValue }]) => {
            const id = `settings-${key}`
            return (
              <span key={key}>
                <label htmlFor={id}>{key}</label>
                <select
                  id={id}
                  name={key}
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
      <p>
        <button type="submit">Generate SVG</button>

        <input
          type="checkbox"
          name="bg"
          value="1"
          id="with-bg"
          defaultChecked
        />
        <label htmlFor="with-bg">with background</label>
      </p>
    </form>
  )
}
