interface Options {
  method: string,
  data: {},
  context: any,
  failure(request: any, status: any, resText: any): any,
  success(data: any, status: any, request: any): any,
  complete(request: any, status: any): any
}

const initialState: Options = {
  method: 'GET',
  data: {},
  context: this,
  failure: () => {},
  success: () => {},
  complete: () => {},
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ajaxReq = (url: string, options: Options) => {
  const request = new XMLHttpRequest();
  const o: Options = {
    ...initialState,
    ...options,
  };
  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      o.success.call(o.context, JSON.parse(request.responseText), request.status, request);
    } else {
      o.failure.call(o.context, request, request.status, request.responseText);
    }
    o.complete.call(o.context, request, request.status);
  };
  request.open(o.method, url);
  request.send();
};
