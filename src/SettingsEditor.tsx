import React from 'react'
import { Settings, settingsSchema } from './Keyboard'
import {
  Button,
  Checkbox,
  createTheme,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
} from '@mui/material'

const lightTheme = createTheme({})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function SettingsEditor({
  settings,
  changeSetting,
}: {
  settings: Settings
  changeSetting: (key: string, value: string) => void
}) {
  const form = React.useRef<HTMLFormElement>(null)
  return (
    <ThemeProvider
      theme={settings['theme'] === 'dark' ? darkTheme : lightTheme}
    >
      <form action="/api/svg" ref={form}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          {Object.entries(settingsSchema).map(
            ([key, { options, default: defaultValue }]) => {
              const id = `settings-${key}`
              return (
                <FormControl key={key}>
                  <InputLabel id={id}>{key}</InputLabel>
                  <Select
                    name={key}
                    label={key}
                    labelId={id}
                    value={(settings as any)[key]}
                    onChange={(e) => changeSetting(key, e.target.value)}
                  >
                    {Object.entries(options).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            },
          )}
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button variant="contained" onClick={() => form.current!.submit()}>
            Generate SVG
          </Button>

          <FormControlLabel
            control={<Checkbox name="bg" value="1" defaultChecked />}
            label="With background"
          />
        </Stack>
      </form>
    </ThemeProvider>
  )
}
