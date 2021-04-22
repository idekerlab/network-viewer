import ErrorMessage from './ErrorMessage'
import NDExError from './NDExError'
import ResponseCode from './ResponseCode'

// Response code is associated with main and sub message
const MESSAGE_MAP = new Map<ResponseCode, [string, string]>()

MESSAGE_MAP.set(
  ResponseCode.BadRequest,
  ["The server could not handle your request",
  "The NDEx server could not handle your request. Please try different query or try Classic Mode."]
)
MESSAGE_MAP.set(
  ResponseCode.Unauthorized,
  ["You don't have permission to access this data",'Please sing in to your account and check the permission of this entry']
)
MESSAGE_MAP.set(
  ResponseCode.InternalServerError,
  ['Unknown server-side error.','Please try again later or report this issue to us.'],
)
MESSAGE_MAP.set(ResponseCode.NotFound, ['The entry does not exist in the server', 'Please double-check the Network ID in the URL'])

const convertError = (error: NDExError): ErrorMessage => {
  const { details } = error
  const unknownError: ErrorMessage = {
    message: `Unknown error: ${error.name}`,
    originalMessage: error.message
  }

  const response = details['response']
  if (response === undefined) {
    return unknownError
  }
  const { status, statusText } = response as Response
  const data = response['data']
  const message: [string, string] = MESSAGE_MAP.get(status)

  if (message !== undefined) {
    const errorMessage: ErrorMessage = {
      message: message[0],
      optionalMessage: message[1],
      originalMessage: `${statusText}: ${data.message}`,
      code: status
    }

    return errorMessage
  }

  return unknownError
}

export { convertError }
