export const AuthType = {
  BASIC: 'basic',
  KEYCLOAK: 'keycloak',
} as const

export type AuthType = (typeof AuthType)[keyof typeof AuthType]
