// The network is editable only if the following values are set to "permissions"
export const EDITABLE = {
  ADMIN: 'ADMIN',
  WRITE: 'WRITE',
} as const

export type Editable = typeof EDITABLE[keyof typeof EDITABLE]