// Pure error type with an HTTP status code attached — kept free of any
// framework imports so it can be used from route handlers, models, and lib
// modules alike.
export class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
