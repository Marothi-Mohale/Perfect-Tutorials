export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
