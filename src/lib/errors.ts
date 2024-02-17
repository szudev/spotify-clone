export type ApiStatusCodes =
  | 200
  | 201
  | 204
  | 304
  | 400
  | 401
  | 403
  | 404
  | 429
  | 500
  | 502
  | 503

type ApiStatusDescriptions = {
  [key in ApiStatusCodes]: string
}

export const apiStatusDescriptions: ApiStatusDescriptions = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable'
}

export function spotifyWebApiErrorHandler(error: unknown): ApiStatusCodes {
  if (
    error &&
    error instanceof Error &&
    typeof error === 'object' &&
    'statusCode' in error
  ) {
    return error.statusCode as ApiStatusCodes
  }

  return 500
}

type CustomApiErrorObject = {
  statusCode: ApiStatusCodes
  headers: {
    'cache-control': string
    'retry-after'?: string
    'access-control-allow-origin': string
    'access-control-allow-headers': string
    'access-control-allow-methods': string
    'access-control-allow-credentials': string
    'access-control-max-age': string
    'content-encoding': string
    'strict-transport-security': string
    'x-content-type-options': string
    date: string
    server: string
    via: string
    'alt-svc': string
    connection: string
    'transfer-encoding': string
    // You can add more headers if needed
  }
}

export function isCustomApiErrorObject(
  error: any
): error is CustomApiErrorObject {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'headers' in error
  )
}

export type CustomErrorMessageObject = {
  statusCode: ApiStatusCodes
  retryAfter?: number
}

export class CustomErrorExceptionType extends Error {
  constructor(message: CustomErrorMessageObject) {
    super(JSON.stringify(message))
  }
}
