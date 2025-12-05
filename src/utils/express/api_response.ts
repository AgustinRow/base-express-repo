export interface QueryResponse<T> {
  data: T;
  error?: Error;
}

export interface MutationResponse<T> extends QueryResponse<T> {
  success: boolean;
  code: string;
  message: string;
}

export type APIResponse<T> = MutationResponse<T> | QueryResponse<T>;
