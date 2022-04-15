import { NextFunction, Response, Request } from "express";
import { IResponseErrorInternal, IResponseSuccessJson, IResponse } from "../typings/express.typings";


/** returns Internal Error and reports the error to slack bot, besides logging to standard console.error */
export function ResponseErrorInternal(
    error?: any,
    message = 'Internal Server Error'
  ): IResponseErrorInternal {
    const { stack } = error;
    //console.warn('Internal server error:', error);
    return {
      apply: (res: Response) =>
        res.status(500).json({ message, error, stack }),
      kind: 'ResponseErrorInternal',
      status: 500,
      value: error,
    };
  }

  export function ResponseSuccessJson<T>(o: T, status = 200): IResponseSuccessJson<T> {
    return {
      apply: res => res.status(status).json(o),
      kind: 'ResponseSuccessJson',
      status,
      value: o,
    };
  }

/**
 * Converts errors in Responses, according to their status code
 * to their status codes
 * @param err
 * @param req
 */
 export const expressErrorsWrapper = (err: any, req: Request) => ResponseErrorInternal(err);

 /**
 * Convenience method that transforms a function (handler),
 * which takes an Request as input and returns an IResponse,
 * into an express controller.
 */
export function toExpressHandler<T, P>(
    handler: (req: Request) => Promise<IResponse<T>>,
    object?: P
  ): (req: Request, res: Response) => void {
    return (req, res) =>
      handler
        .call(object, req)
        .catch(err => expressErrorsWrapper(err, req))
        .then(response => {
          response.apply(res);
        });
  }
  

  export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(500).send();
    // res.render("error", { error });
  };