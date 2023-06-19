import { arrayToEnum } from '.'
import type { LuneErrorMap, LuneIssue } from '../error'


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

export const getParsedType = (data: any): LuneParsedType => {
  const type = typeof data

  switch (type) {
    case 'string':
      return LuneParsedType.string
    case 'number':
      return isNaN(data) ? LuneParsedType.nan : LuneParsedType.number
    case 'boolean':
      return LuneParsedType.boolean
    case 'bigint':
      return LuneParsedType.bigint
    case 'symbol':
      return LuneParsedType.symbol
    case 'undefined':
      return LuneParsedType.undefined
    case 'function':
      return LuneParsedType.function
    case 'object':
      if (data === null) {
        return LuneParsedType.null
      }

      if (Array.isArray(data)) {
        return LuneParsedType.array
      }

      if (typeof data.then === 'function') {
        return LuneParsedType.promise
      }

      if (typeof Map !== 'undefined' && data instanceof Map) {
        return LuneParsedType.map
      }

      if (typeof Set !== 'undefined' && data instanceof Set) {
        return LuneParsedType.set
      }

      if (typeof Date !== 'undefined' && data instanceof Date) {
        return LuneParsedType.date
      }

      return LuneParsedType.object

    default:
      return LuneParsedType.unknown
  }
}


export interface ParseParams {
  path: ParsePath
  errorMap: unknown // TODO: implement LuneErrorMap
  async: boolean
}


export type ParsePath = (string | number)[]

export interface ParseContext {
  readonly common: {
    readonly issues: LuneIssue[]
    readonly contextualErrorMap?: LuneErrorMap
    readonly async: boolean
  }
  readonly path: ParsePath
  readonly schemaErrorMap?: LuneErrorMap
  readonly parent: ParseContext | null
  readonly data: any
  readonly parsedType: LuneParsedType
}


export interface ParseInput {
  data: any
  path: ParsePath
  parent: ParseContext
}


// parse result
export interface Invalid {
  status: 'aborted'
}
export const INVALID: Invalid = Object.freeze({ status: 'aborted' })

export interface Dirty<T> {
  status: 'dirty'
  value: T
}
export const DIRTY = <T>(value: T): Dirty<T> => ({ status: 'dirty', value })

export interface Ok<T> {
  status: 'valid'
  value: T
}
export const OK = <T>(value: T): Ok<T> => ({ status: 'valid', value })


export type SyncParseReturnType<T = any> = Ok<T> | Dirty<T> | Invalid
export type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>
export type ParseReturnType<T> = SyncParseReturnType<T> | AsyncParseReturnType<T>
