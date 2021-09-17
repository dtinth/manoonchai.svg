import React from 'react'
import './fonts/waree.css'
import { lch2hex } from './Color'

export const settingsSchema = {
  theme: {
    default: 'dark',
    options: {
      light: 'Light theme',
      dark: 'Dark theme',
    },
  },
  keySplit: {
    default: 'none',
    options: {
      none: 'No split',
      index: 'Split at index finger',
      hand: 'Split between light and right hands',
    },
  },
  colorMode: {
    default: 'consonant',
    options: {
      none: 'No coloring',
      consonant: 'Color by consonant class',
      // finger: 'Color by finger',
    },
  },
} as const

export type Settings = {
  [K in keyof typeof settingsSchema]: keyof typeof settingsSchema[K]['options']
}

export default function Keyboard({ settings }: { settings: Settings }) {
  const keySplitter =
    keySplitterModes[settings.keySplit] ||
    keySplitterModes[settingsSchema.keySplit.default]
  const appearance = useAppearance(settings)
  const unitSizePts = 8
  const insetPts = 16
  let totalUnits = keyWidths[0].reduce((a, b) => a + b) + keySplitter.units
  const svgWidth = totalUnits * unitSizePts + 2 * insetPts
  const svgHeight = keyWidths.length * 4 * unitSizePts + 2 * insetPts
  const keyInsetPts = 2
  const background = appearance.getBackground()

  React.useEffect(() => {
    document.body.style.backgroundColor = background
  }, [background])

  return (
    <AppearanceContext.Provider value={appearance}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {keyWidths.map((widths, row) => {
          const y = insetPts + row * 4 * unitSizePts
          let currentUnits = 0
          return widths.map((widthUnits, column) => {
            currentUnits += keySplitter.marginLeft(row, column)
            widthUnits += keySplitter.grow(row, column)
            const x = insetPts + currentUnits * unitSizePts + keyInsetPts
            currentUnits += widthUnits
            const widthPts = widthUnits * unitSizePts - 2 * keyInsetPts
            const heightPts = 4 * unitSizePts - 2 * keyInsetPts
            const labels = keyCharacters[row]?.[column - 1] as
              | KeyLabelsSpec
              | undefined
            return (
              <React.Fragment key={`${row}-${column}`}>
                <rect
                  x={x}
                  y={y}
                  width={widthPts}
                  height={heightPts}
                  rx={4}
                  stroke={appearance.getKeyStroke(row, column, labels)}
                  strokeWidth={appearance.getKeyFill(row, column, labels)}
                  fill="none"
                />
                {!!labels && (
                  <KeyLabels
                    row={row}
                    column={column}
                    x={x}
                    y={y}
                    width={widthPts}
                    height={heightPts}
                    labels={labels as any}
                  />
                )}
              </React.Fragment>
            )
          })
        })}
        <style>{`
        .label {
          font-family: Waree;
        }
      `}</style>
      </svg>
    </AppearanceContext.Provider>
  )
}

function KeyLabels({
  row,
  column,
  x,
  y,
  width,
  height,
  labels,
}: {
  row: number
  column: number
  x: number
  y: number
  width: number
  height: number
  labels: KeyLabelsSpec
}) {
  const appearance = React.useContext(AppearanceContext)
  if (!appearance) {
    throw new Error('AppearanceContext is required')
  }

  const hasAlt = labels[2].trim() != ''
  return (
    <g transform={`translate(${x}, ${y})`}>
      <KeyLabel
        x={width * (hasAlt ? 0.5 : 0.7)}
        y={height * 0.7}
        text={labels[0]}
        large
        fill={appearance.getLabelFill(row, column, labels[0], 'main')}
      />
      <KeyLabel
        x={width * 0.3}
        y={height * 0.3}
        text={labels[1]}
        fill={appearance.getLabelFill(row, column, labels[1], 'shift')}
      />
      <g opacity={0.5}>
        <KeyLabel
          x={width * 0.7}
          y={height * 0.3}
          text={labels[2]}
          fill={appearance.getLabelFill(row, column, labels[2], 'alt')}
        />
      </g>
    </g>
  )
}

function KeyLabel({
  x,
  y,
  text,
  fill,
  large,
}: {
  x: number
  y: number
  text: string
  fill: string
  large?: boolean
}) {
  const offset =
    3 + (/[่้๊๋์๎]/.test(text) ? 4 : 0) + (/[ุู]/.test(text) ? -4 : 0)
  return (
    <text
      className="label"
      x={x}
      y={y + offset}
      textAnchor="middle"
      fontSize={large ? '9pt' : '7pt'}
      fill={fill}
    >
      {text}
    </text>
  )
}

type KeyLabelsSpec = [string, string, string]

export interface IAppearance {
  getBackground(): string
  getKeyStroke(
    row: number,
    col: number,
    labels: KeyLabelsSpec | undefined,
  ): string
  getKeyFill(
    row: number,
    col: number,
    labels: KeyLabelsSpec | undefined,
  ): string
  getLabelFill(
    row: number,
    col: number,
    char: string,
    type: 'main' | 'shift' | 'alt',
  ): string
}

export const AppearanceContext = React.createContext<IAppearance | null>(null)

function useAppearance(settings: Settings): IAppearance {
  const theme = themes[settings.theme]
  const colorizer = colorizers[settings.colorMode]

  return {
    getBackground: () => theme.background,
    getKeyStroke: (row, column, labels) =>
      colorizer.getKeyStroke(theme, row, column, labels),
    getKeyFill: (row, column, labels) =>
      colorizer.getKeyFill(theme, row, column, labels),
    getLabelFill: (row, column, char, type) =>
      colorizer.getLabelFill(theme, row, column, char, type),
  }
}

export interface IKeySplitter {
  units: number
  marginLeft(row: number, column: number): number
  grow(row: number, column: number): number
}

const keySplitterModes: Record<Settings['keySplit'], IKeySplitter> = {
  none: {
    units: 0,
    marginLeft: () => 0,
    grow: () => 0,
  },
  hand: {
    units: 1,
    marginLeft: (row: number, column: number) => {
      return row < 4 ? (column === 6 ? 1 : 0) : 0
    },
    grow: (row: number, column: number) => {
      return row === 4 && column === 3 ? 2 : 0
    },
  },
  index: {
    units: 2,
    marginLeft: (row: number, column: number) => {
      return row < 4 ? (column === 5 || column === 7 ? 1 : 0) : 0
    },
    grow: (row: number, column: number) => {
      return row === 4 && column === 3 ? 2 : 0
    },
  },
}

export interface ITheme {
  background: string
  keyStroke: string
  keyFill: string
  labelFill: string
  labelColorChroma: number
  labelColorLuminance: number
}

const themes: Record<Settings['theme'], ITheme> = {
  dark: {
    background: '#353433',
    keyStroke: '#656463',
    keyFill: 'none',
    labelFill: '#eee',
    labelColorChroma: 48,
    labelColorLuminance: 80,
  },
  light: {
    background: '#fff',
    keyStroke: '#0004',
    keyFill: '#0002',
    labelFill: '#000',
    labelColorChroma: 64,
    labelColorLuminance: 52,
  },
}

export interface IColorizer {
  getKeyStroke(
    theme: ITheme,
    row: number,
    column: number,
    labels: KeyLabelsSpec | undefined,
  ): string

  getKeyFill(
    theme: ITheme,
    row: number,
    column: number,
    labels: KeyLabelsSpec | undefined,
  ): string

  getLabelFill(
    theme: ITheme,
    row: number,
    column: number,
    char: string,
    type: 'main' | 'shift' | 'alt',
  ): string
}

const noneColorizer: IColorizer = {
  getKeyStroke: (theme) => theme.keyStroke,
  getKeyFill: (theme) => theme.keyFill,
  getLabelFill: (theme) => theme.labelFill,
}

const colorizers: Record<Settings['colorMode'], IColorizer> = {
  none: noneColorizer,
  consonant: {
    ...noneColorizer,
    getLabelFill: (theme, row, column, char, type) => {
      let hue = 0
      let chroma = theme.labelColorChroma
      let lightness = theme.labelColorLuminance
      if (char < 'ก' || char >= '๏') {
        return theme.labelFill
      } else if (char < 'จ') {
        hue = 0
      } else if (char < 'ฎ') {
        hue = 50
      } else if (char < 'ด') {
        hue = 100
      } else if (char < 'บ') {
        hue = 150
      } else if (char < 'ย') {
        hue = 200
      } else if (char < 'ฯ') {
        hue = 250
      } else if (char < '็') {
        hue = 300
      } else {
        hue = 330
      }
      return lch2hex(lightness, chroma, hue)
    },
  },
}

const keyWidths = [
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8],
  [6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6],
  [7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9],
  [9, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 11],
  [6, 4, 6, 24, 6, 4, 4, 6],
]

const keyCharacters = [
  [
    ['1', '!', '๑'],
    ['2', '@', '๒'],
    ['3', '#', '๓'],
    ['4', '$', '๔'],
    ['5', '%', '๕'],
    ['6', '^', '๖'],
    ['7', '&', '๗'],
    ['8', '*', '๘'],
    ['9', '(', '๙'],
    ['0', ')', '๐'],
    ['-', '_', '÷'],
    ['=', '+', '×'],
  ],
  [
    ['ใ', 'ฒ', ' '],
    ['ต', 'ฏ', ' '],
    ['ห', 'ซ', ' '],
    ['ล', 'ญ', ' '],
    ['ส', 'ฟ', ' '],
    ['ป', 'ฉ', ' '],
    ['ั', 'ึ', 'ฺ'],
    ['ก', 'ธ', ' '],
    ['ิ', 'ฐ', ' '],
    ['บ', 'ฎ', ' '],
    ['็', 'ฆ', '[{'],
    ['ฬ', 'ฑ', ']}'],
    ['ฯ', 'ฌ', '\\|'],
  ],
  [
    ['ง', 'ษ', '◌'],
    ['เ', 'ถ', '๏'],
    ['ร', 'แ', '๛'],
    ['น', 'ช', '฿'],
    ['ม', 'พ', ' '],
    ['อ', 'ผ', 'ํ'],
    ['า', 'ำ', 'ๅ'],
    ['่', 'ข', 'ฃ'],
    ['้', 'โ', ' '],
    ['ว', 'ภ', ';:'],
    ['ื', '"', '\'"'],
  ],
  [
    ['ุ', 'ฤ', 'ฦ'],
    ['ไ', 'ฝ', ' '],
    ['ท', 'ๆ', '๚'],
    ['ย', 'ณ', ' '],
    ['จ', '๊', ' '],
    ['ค', '๋', 'ฅ'],
    ['ี', '์', '๎'],
    ['ด', 'ศ', ','],
    ['ะ', 'ฮ', '.'],
    ['ู', '?', '/?'],
  ],
]
