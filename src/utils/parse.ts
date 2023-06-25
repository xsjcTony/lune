import { getErrorMap, makeIssue, LuneError } from '../error'
import { defaultErrorMap } from '../locale'
import { arrayToEnum } from '.'
import type { LuneErrorMap, LuneIssue, LuneIssueData } from '../error'


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
  errorMap: LuneErrorMap
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


export const addIssueToContext = (ctx: ParseContext, issueData: LuneIssueData): void => {
  ctx.common.issues.push(makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      getErrorMap(),
      defaultErrorMap
    ]
      .filter(Boolean)
  }))
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


export const isAborted = (result: SyncParseReturnType<any>): result is Invalid =>
  result.status === 'aborted'

export const isDirty = <T>(result: SyncParseReturnType<T>): result is Dirty<T> =>
  result.status === 'dirty'

export const isValid = <T>(result: SyncParseReturnType<T>): result is Ok<T> =>
  result.status === 'valid'

export const isAsync = <T>(result: ParseReturnType<T>): result is AsyncParseReturnType<T> =>
  result instanceof Promise
  || (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    typeof result !== null
    && (typeof result === 'object' || typeof result === 'function')
    && 'then' in result
    && typeof result.then === 'function'
  )


export class ParseStatus {
  public value: 'aborted' | 'dirty' | 'valid' = 'valid'

  public dirty(): void {
    this.value === 'valid' && (this.value = 'dirty')
  }

  public abort(): void {
    this.value !== 'aborted' && (this.value = 'aborted')
  }
}


export interface SafeParseSuccess<Output> {
  success: true
  data: Output
}

export interface SafeParseError<Input> {
  success: false
  error: LuneError<Input>
}

export type SafeParseReturnType<Input, Output> =
  | SafeParseSuccess<Output>
  | SafeParseError<Input>


export const handleResult = <Input, Output>(
  ctx: ParseContext,
  result: SyncParseReturnType<Output>
): SafeParseReturnType<Input, Output> => {
  if (isValid(result)) {
    return { success: true, data: result.value }
  }

  if (!ctx.common.issues.length) {
    throw new Error('Validation failed but no issues detected.')
  }

  return {
    success: false,
    // TODO: why? performance? https://github.com/colinhacks/zod/commit/67b981e7
    error: new LuneError<Input>(ctx.common.issues)
  }
}


// export const mergeArray = (status: ParseStatus, results: SyncParseReturnType[]): SyncParseReturnType => {
//   const valueArr: Exclude<SyncParseReturnType, Invalid>[] = [];
//
//   for (const result of results) {
//     if (result.status === 'aborted')
//       return INVALID
//
//     if (result.status === 'dirty')
//       status.dirty()
//
//     valueArr.push(result.value)
//   }
//
//   return { status: status.value, value: valueArr }
// }
