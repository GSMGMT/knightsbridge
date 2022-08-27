type ResponseStatus = {
  totalCount?: number;
  message?: string;
};

export class ResponseModel {
  static create<T>(data: T, status: ResponseStatus) {
    return {
      data,
      status,
    };
  }
}
