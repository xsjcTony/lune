// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const arrayToEnum = <T extends string, const U extends readonly T[]>(items: U): { [k in U[number]]: k } => Object.fromEntries(
  items.map(item => [item, item])
) as unknown as { [k in U[number]]: k }

export const LuneParsedType = arrayToEnum([
  'string',
  'nan',
  'number',
  'integer',
  'float',
  'boolean',
  'date',
  'bigint',
  'symbol',
  'function',
  'undefined',
  'null',
  'array',
  'object',
  'unknown',
  'promise',
  'void',
  'never',
  'map',
  'set'
])

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LuneParsedType = keyof typeof LuneParsedType
