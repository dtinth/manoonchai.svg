import React from 'react'
import Keyboard from '../src/Keyboard'
import fs from 'fs'

const waree = fs.readFileSync(require.resolve('../src/fonts/waree.css'), 'utf8')

export function renderSvg(settings: any) {
  return <Keyboard settings={settings} extra={<style>{waree}</style>} />
}
