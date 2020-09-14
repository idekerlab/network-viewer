import HttpResponse from '../api/HttpResponse'

type ServerError<T> = {
  message: string
  response: HttpResponse<T>
}

export default ServerError
