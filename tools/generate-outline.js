const opentype = require('opentype.js')
const font = opentype.loadSync(process.argv[2])
const characters = require('../src/manoonchai.json')
  .keyCharacters.flat(2)
  .flatMap((c) => (c && Array.from(c)) || [])
const characterList = Array.from(new Set(characters))
  .sort()
  .filter((r) => r.trim())

process.stdout.write('{ "fontData": {')
for (const [i, char] of characterList.entries()) {
  if (i > 0) process.stdout.write(', ')
  const path = font.getPath(char, 0, 0, 960)
  const bbox = path.getBoundingBox()
  const bounds = [
    [Math.floor(bbox.x1), Math.floor(bbox.y1)],
    [Math.ceil(bbox.x2), Math.ceil(bbox.y2)],
  ]
  const d = path.toPathData(0)
  const info = { d, bounds }
  process.stdout.write(`${JSON.stringify(char)}: ${JSON.stringify(info)}\n`)
}
process.stdout.write('} }\n')
