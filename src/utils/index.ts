// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const arrayToEnum = <T extends string, const U extends readonly T[]>(items: U): { [k in U[number]]: k } => Object.fromEntries(
  items.map(item => [item, item])
) as unknown as { [k in U[number]]: k }


export * from './parse'
export * from './types'
