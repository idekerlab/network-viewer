import ResponseCode from './ResponseCode'

/**
 * Error message object to be displayed as a feedback to the user
 */
interface ErrorMessage {
  message: string  // Main message for end-users
  optionalMessage?: string // Can be any message (explains more details) 
  originalMessage: string  // Message returned from the server
  code?: ResponseCode  // Response code from the service
}

export default ErrorMessage
