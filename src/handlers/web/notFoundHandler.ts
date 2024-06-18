import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  console.log(`invalid url: ${req.url}`)

  res
    .status(404)
    .render('not-found.html')
}
