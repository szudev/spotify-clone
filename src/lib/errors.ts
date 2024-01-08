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
