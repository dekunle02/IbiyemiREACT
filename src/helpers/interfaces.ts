export enum HelperStatus {
  Success,
  Failure,
}

export interface HelperResult<T> {
  status: HelperStatus;
  data: T;
  message?: string;
}
