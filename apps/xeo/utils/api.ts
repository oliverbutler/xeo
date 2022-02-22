import { ObjectSchema, Schema, ValidationError } from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import pino from 'pino';
import useSWR from 'swr';
import { fetcher } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';

export type GenericAPIRequest<T> = {
  error: {
    message: string;
  };
  response: T;
};

export type APIRequest<TRequest extends object, TResponse extends object> = {
  type: 'POST' | 'PUT';
  request: TRequest;
  joiBodySchema: ObjectSchema<TRequest>;
} & GenericAPIRequest<TResponse>;

export type APIDeleteRequest<TResponse extends object> = {
  type: 'DELETE';
} & GenericAPIRequest<TResponse>;

export type APIGetRequest<TResponse extends object> = {
  type: 'GET';
} & GenericAPIRequest<TResponse>;

export const apiResponse = <T extends GenericAPIRequest<object>>(
  res: NextApiResponse,
  data: T['response'],
  status?: number
) => {
  return res.status(status ?? 200).json(data);
};

export const apiError = <T extends GenericAPIRequest<object>>(
  res: NextApiResponse,
  error: T['error'],
  status?: number
) => {
  return res.status(status ?? 400).json(error);
};

type QueryResponse<T extends APIGetRequest<object>> =
  | {
      data: T['response'];
      error: null;
      isLoading: false;
    }
  | {
      data: null;
      error: null;
      isLoading: true;
    }
  | {
      data: null;
      error: T['error'];
      isLoading: false;
    };

export const useQuery = <T extends APIGetRequest<object>>(
  url: string
): QueryResponse<T> => {
  const { data, error } = useSWR(url, fetcher);

  if (!data && !error) {
    return {
      data: null,
      error: null,
      isLoading: true,
    };
  }

  if (error || !data) {
    return {
      data: null,
      error,
      isLoading: false,
    };
  }

  return {
    data,
    error: null,
    isLoading: false,
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

export const logger = pino({
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
});

type AxiosReturn<T extends GenericAPIRequest<object>> =
  | {
      data: T['response'];
      error: null;
    }
  | {
      data: null;
      error: { body: T['error'] | null; generic: string };
    };

const extractErrorFromAxiosResponse = <T extends object>(
  response: AxiosError<T>
): { body: T | null; generic: string } => {
  const generic = 'Something went wrong, please try again!';

  if (response.response?.data) {
    return {
      body: response.response.data,
      generic,
    };
  } else {
    return {
      body: null,
      generic,
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
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        error: extractErrorFromAxiosResponse(error),
      };
    });
};

export const apiPost = async <T extends APIRequest<object, object>>(
  url: string,
  request: T['request']
): Promise<AxiosReturn<T>> => {
  return await axios
    .post(url, request)
    .then((response) => {
      return {
        data: response.data,
        error: null,
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        error: extractErrorFromAxiosResponse(error),
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
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        error: extractErrorFromAxiosResponse(error),
      };
    });
};

export const apiGet = async <T extends APIGetRequest<object>>(
  url: string
): Promise<AxiosReturn<T>> => {
  return await axios
    .get(url)
    .then((response) => {
      return {
        data: response.data,
        error: null,
      };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        error: extractErrorFromAxiosResponse(error),
      };
    });
};
