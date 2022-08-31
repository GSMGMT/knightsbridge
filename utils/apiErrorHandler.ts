import { ResponseModel } from '@contracts/Response';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export const apiErrorHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  err: unknown
) => {
  console.error({ err });

  if (err instanceof ValidationError) {
    const validationError = err as ValidationError;

    return res
      .status(req.method === 'POST' ? 422 : 400)
      .json(ResponseModel.create(null, { message: validationError.message }));
  }

  return res
    .status(500)
    .json(ResponseModel.create(null, { message: 'Something went wrong' }));
};
