export const AuthType = {
  BASIC: 'basic',
  KEYCLOAK: 'keycloak',
  NONE: 'none',
} as const

export type AuthType = (typeof AuthType)[keyof typeof AuthType]
