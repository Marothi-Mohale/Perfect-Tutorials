export type ApiFieldError = {
  field?: string;
  messages: string[];
};

export type ApiErrorResponse = {
  success: false;
  code: string;
  message: string;
  errors: ApiFieldError[];
};
