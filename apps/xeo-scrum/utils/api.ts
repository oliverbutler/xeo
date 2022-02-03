import { ObjectSchema, Schema, ValidationError } from 'joi';
import { NextApiRequest } from 'next';
import pino from 'pino';

/**
 * Generic API Request type for all API requests.
 */
export type APIRequest<TRequest extends object, TResponse extends object> = {
  type: 'post';
  request: TRequest;
  response: TResponse;
  joiBodySchema: ObjectSchema<TRequest>;
  error: {
    message: string;
  };
};

type ParseAPIRequestResponse<T extends object> =
  | {
      body: undefined;
      error: ValidationError;
    }
  | {
      body: T;
      error: undefined;
    };

export const parseAPIRequest = <T extends object>(
  req: NextApiRequest,
  bodySchema: Schema<T>
): ParseAPIRequestResponse<T> => {
  const validatedBody = bodySchema.validate(req.body);

  if (validatedBody.error) {
    return {
      body: undefined,
      error: validatedBody.error,
    };
  }

  return {
    body: validatedBody.value,
    error: undefined,
  };
};

export const logger = pino();
