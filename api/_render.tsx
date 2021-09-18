import React from 'react'
import Keyboard from '../src/Keyboard'

export function renderSvg({ bg, ...settings }: any) {
  return <Keyboard settings={settings} bg={!!bg} />
}
