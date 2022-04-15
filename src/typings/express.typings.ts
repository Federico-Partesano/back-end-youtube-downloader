import { Response } from 'express';

export interface IResponse<T> {
  readonly kind: T;
  readonly status: number;
  readonly apply: (response: Response) => void;
}

export interface IResponseSuccessJson<T> extends IResponse<'ResponseSuccessJson'> {
  value: T;
}
export interface IResponseErrorInternal extends IResponse<'ResponseErrorInternal'> {
  value?: any;
}