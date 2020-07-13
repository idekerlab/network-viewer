interface HttpResponse<T> extends Response {
  parsedBody?: T
}

export default HttpResponse
