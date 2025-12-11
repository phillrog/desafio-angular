export interface Response<T> {
    success: boolean;
    data: T;
    errors: string[] | null;
  }