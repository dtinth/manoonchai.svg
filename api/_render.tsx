import Keyboard from '../src/Keyboard'
import fs from 'fs'

const waree = fs.readFileSync(require.resolve('../src/fonts/waree.css'))

export function renderSvg() {
  return <Keyboard settings={{}} extra={<style>{waree}</style>} />
}
