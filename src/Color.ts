import chroma from 'chroma-js'

export function lch2hex(l: number, c: number, h: number, a: number = 1) {
  return chroma.lch(l, c, h).alpha(a).hex()
}

Object.assign(window, { chroma })
