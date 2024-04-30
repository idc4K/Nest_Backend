import { HttpStatusCode } from 'axios'
import type { GraphQLFormattedError } from 'graphql'
import { GraphQLError } from 'graphql'
import { ServiceError } from './errors/ServiceError'

export function handleGraphQLError (error: Error) {
  if (error instanceof ServiceError) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: error.code
      }
    })
  }
  throw error
}

export function formatCodeGraphQlError (error: GraphQLFormattedError) {
  const codeMessage = error.extensions.code
  if (codeMessage === 'UNAUTHENTICATED') {
    handleGraphQLError(new ServiceError(HttpStatusCode.Unauthorized, codeMessage))
  }
  else if (codeMessage === 'FORBIDDEN') {
    handleGraphQLError(new ServiceError(HttpStatusCode.Forbidden, codeMessage))
  }
  else {
    handleGraphQLError(new ServiceError(HttpStatusCode.InternalServerError, error.message))
    // throw error
  }
}
