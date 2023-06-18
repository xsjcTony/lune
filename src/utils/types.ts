export type Primitive =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | null
  | undefined

export type OmitStrings<T, K extends string> = Pick<T, Exclude<keyof T, K>>
