import { ObjectSchema, Schema, ValidationError } from 'joi';
import { NextApiRequest } from 'next';
import axios, { AxiosError } from 'axios';
import pino from 'pino';

export type GenericAPIRequest<T> = {
  error: {
    message: string;
  };
  response: T;
};

export type APIRequest<TRequest extends object, TResponse extends object> = {
  type: 'POST';
  request: TRequest;
  joiBodySchema: ObjectSchema<TRequest>;
} & GenericAPIRequest<TResponse>;

export type APIDeleteRequest<TResponse extends object> = {
  type: 'DELETE';
} & GenericAPIRequest<TResponse>;

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

export const logger = pino({
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
});

type AxiosReturn<T extends GenericAPIRequest<object>> =
  | {
      data: T['response'];
      error: null;
      genericError: null;
    }
  | {
      data: null;
      error: T['error'];
      genericError: string;
    }
  | {
      data: null;
      error: null;
      genericError: string;
    };

const extractErrorFromAxiosResponse = <T extends object>(
  response: AxiosError<T>
):
  | { error: null; genericError: string }
  | { error: T; genericError: string } => {
  const genericError = 'Something went wrong, please try again!';

  if (response.response?.data) {
    return {
      error: response.response.data,
      genericError,
    };
  } else {
    return {
      error: null,
      genericError,
    };
  }
};

export const apiPut = async <T extends APIRequest<object, object>>(
  url: string,
  request: T['request']
): Promise<AxiosReturn<T>> => {
  return await axios
    .put(url, request)
    .then((response) => {
      return {
        data: response.data,
        error: null,
        genericError: null,
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        ...extractErrorFromAxiosResponse(error),
      };
    });
};

export const apiDelete = async <T extends APIDeleteRequest<object>>(
  url: string
): Promise<AxiosReturn<T>> => {
  return await axios
    .delete(url)
    .then((response) => {
      return {
        data: response.data,
        error: null,
        genericError: null,
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        ...extractErrorFromAxiosResponse(error),
      };
    });
};
