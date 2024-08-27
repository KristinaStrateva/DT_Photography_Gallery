import { RequestHandler, Request, Response, NextFunction } from 'express'

const withAsyncHandler = <P, ResBody, ReqBody, ReqQuery>(
  handler: (
    ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
  ) => Promise<void>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return async (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => {
    // try {
    //   await handler(req, res, next)
    // } catch (err) {
    //   next(err)
    // }

    handler(req, res, next).catch(err => next(err))
  }
}

export default withAsyncHandler
