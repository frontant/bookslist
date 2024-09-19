export type MessageParams = Record<any, any>;

export interface IFetchError {
  message: string;
  messageParams?: MessageParams;
};

export class FetchError extends Error implements IFetchError {
  constructor(public message:string, public messageParams?: MessageParams) {
    super(message);
  }

  get():IFetchError {
    return {
      message: this.message,
      messageParams: this.messageParams,
    }
  }
}

export function convertToFetchError(error: unknown) {
  if(error instanceof FetchError) {
    return error.get();
  } else if(error instanceof Error) {
    return { message: error.message };
  } else if(error !== null && typeof error === 'object' && 'message' in error) {
    return error as IFetchError;
  } else {
    return { message: 'error.unknown' };
  }
};
