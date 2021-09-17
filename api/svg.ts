import { VercelRequest, VercelResponse } from '@vercel/node'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderSvg } from './_render'

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    console.log('wtf')
    const result = renderToStaticMarkup(renderSvg())
    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    res.send(result)
  } catch (error) {
    res.send('Error')
    console.error(error)
  }
}
