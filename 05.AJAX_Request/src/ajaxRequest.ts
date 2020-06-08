interface Options {
  method?: 'GET' | 'POST',
  data?: JSON,
  context?: object,
  failure?(request: XMLHttpRequest, status: number, resText: string): void,
  success?(data: JSON, status: number, request: XMLHttpRequest): void,
  complete?(request: XMLHttpRequest, status: number): void
}

const defaultOptions: Options = {
  method: 'GET',
  data: undefined,
  context: this,
  failure: () => { },
  success: () => { },
  complete: () => { },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ajaxReq = (url: string, options: Options) => {
  const request = new XMLHttpRequest();
  const reqOptions: Options = {
    ...defaultOptions,
    ...options,
  };
  request.onload = () => {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300) {
        reqOptions.success!.call(options.context,
          JSON.parse(request.responseText), request.status, request);
      } else {
        reqOptions.failure!.call(reqOptions.context, request, request.status, request.responseText);
      }
      reqOptions.complete!.call(reqOptions.context, request, request.status);
    }
  };
  request.open(reqOptions.method!, url);
  request.send(JSON.stringify(reqOptions.data));
};
