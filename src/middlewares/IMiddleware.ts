import { NextFunction, Request, Response } from 'express'

type IMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>

export default IMiddleware