import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  console.log(`[Server] Invalid url: ${req.method} ${req.url}`)

  res
    .status(404)
    .render('not-found.html')
}
