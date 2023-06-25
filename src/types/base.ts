import { LuneIssueCode } from '../error'
import {
  getParsedType, handleResult,
  isAsync,
  LuneParsedType,
  ParseStatus
} from '../utils'
import type { LuneErrorMap } from '../error'
import type { ParseContext, ParseInput, ParseParams, ParseReturnType,
  AsyncParseReturnType,
  SyncParseReturnType
  , SafeParseReturnType
} from '../utils'


//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                                       l,                     //
//                               ,,ggggggggg,            $@                     //
//                         ;gg@@@@@B$$@@@@@BM           j$@r                    //
//                    ,gg@@@MP*"`,g@@@M*"              ,$@@g,                   //
//                 ,g@@@M"*    ,@@@M"             s&&@@@@@@@@@@@WL              //
//               ,@@@M*`       %ML`                   '"$$@F"`                  //
//             ,$@BF`       ,$g                         l$@F                    //
//           ,$@@F           *`                          $$                     //
//          g$@F           $@                            l`                     //
//         $@@L           ,,                                       @g           //
//        $@@L            &%`                                      $@@          //
//       g$@L             yg                                       $@@g         //
//      ,$@F              **                LuneType               @@@@j        //
//      $$@               ,gg                                     $@M$$@        //
//     |$@F                "",                                   g$@Fl$@L       //
//     |$@F                 #@L                                 g$@F }$@F       //
//     |$@F                  `,g                                &%'   $@F       //
//     |$@k                   **`                            .$@     j$@F       //
//     `$$@                      $&                        gg        $$@        //
//      l$@L                        &&L ,,          ,  y@L ^*       ,$@F        //
//       j$@                            %M |@@ |@@ l$M '"`          $@$         //
//        $$@                               ``  '`                 $@@L         //
//         $$@                                                    $@@L          //
//          j$@L                                                ,$@RL           //
//           *%@g,                                             g@@F             //
//            '%$@g,                                        ,g@@M"              //
//              '%$@g,                                    ,g@@M'      ,         //
//                 *%@@gg                              ,g@@MF`        $g        //
//                   '*%%@@gg,                    ,;g@@@R*"         ,,$@L,      //
//                       *"%%@@@@@gggg,,,,ggggg@@@@NR*"           "*&%$@MT"`    //
//                            ""*T&MMMMMMMMMM&T"*^`                   $$        //
//                                                                    l`        //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////


export interface LuneTypeDefinition {
  errorMap?: LuneErrorMap
  description?: string
}


// type utilities
export type LuneTypeAny = LuneType
export type TypeOf<T extends LuneTypeAny> = T['_output']
export type { TypeOf as Infer }
export type Input<T extends LuneTypeAny> = T['_input']
export type Output<T extends LuneTypeAny> = TypeOf<T>


// create params
export interface RawCreateParams {
  errorMap?: LuneErrorMap
  invalid_type_error?: string
  required_error?: string
  description?: string
}

export const processCreateParams = (params: RawCreateParams | undefined): LuneTypeDefinition => {
  if (!params) return {}

  const {
    errorMap,
    invalid_type_error,
    required_error,
    description
  } = params

  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error('You cannot use both "errorMap" and "invalid_type_error" or "required_error"')
  }

  if (errorMap) {
    return { errorMap, description }
  }

  const customErrorMap: LuneErrorMap = (issue, { defaultError }) => {
    let message = defaultError

    if (issue.code !== LuneIssueCode.invalid_type) {
      return { message }
    }

    if (issue.received === LuneParsedType.undefined) {
      message = required_error ?? message
    } else {
      message = invalid_type_error ?? message
    }

    return { message }
  }

  return { errorMap: customErrorMap, description }
}


export abstract class LuneType<
  Output = any,
  Definition extends LuneTypeDefinition = LuneTypeDefinition,
  Input = Output
> {
  // `_output` and `_input` are defined for TS usage only
  public readonly _output!: Output
  public readonly _input!: Input

  protected readonly _definition: Definition


  protected constructor(definition: Definition) {
    this._definition = definition

    this.parse = this.parse.bind(this)
    this.safeParse = this.safeParse.bind(this)
    this.parseAsync = this.parseAsync.bind(this)
    this.safeParseAsync = this.safeParseAsync.bind(this)
    this.spa = this.safeParseAsync.bind(this)
  }


  public get description(): string | undefined {
    return this._definition.description
  }

  protected abstract _parse(input: ParseInput): ParseReturnType<Output>

  protected _getType(this: void, input: ParseInput): LuneParsedType {
    return getParsedType(input.data)
  }

  protected _getCtx(input: ParseInput): ParseContext {
    return {
      common: input.parent.common,
      data: input.data,
      parsedType: this._getType(input.data),
      schemaErrorMap: this._definition.errorMap,
      path: input.path,
      parent: input.parent
    }
  }

  private _processInputParams(input: ParseInput): { status: ParseStatus; ctx: ParseContext } {
    return {
      status: new ParseStatus(),
      ctx: this._getCtx(input)
    }
  }

  private _parseSync(input: ParseInput): SyncParseReturnType<Output> {
    const result = this._parse(input)

    if (isAsync(result)) {
      throw new Error('Please use ".parseAsync()" or ".safeParseAsync()" instead.')
    }

    return result
  }

  private async _parseAsync(input: ParseInput): AsyncParseReturnType<Output> {
    return Promise.resolve(this._parse(input))
  }

  public parse(data: unknown, params?: Partial<ParseParams>): Output {
    const result = this.safeParse(data, params)

    if (result.success)
      return result.data

    throw result.error
  }

  public safeParse(data: unknown, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output> {
    const ctx: ParseContext = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path ?? [],
      schemaErrorMap: this._definition.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    }

    const result = this._parseSync({ data, path: ctx.path, parent: ctx })

    return handleResult(ctx, result)
  }

  public async parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output> {
    const result = await this.safeParseAsync(data, params)

    if (result.success)
      return result.data

    throw result.error
  }

  public async safeParseAsync(data: unknown, params?: Partial<ParseParams>): Promise<SafeParseReturnType<Input, Output>> {
    const ctx: ParseContext = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path ?? [],
      schemaErrorMap: this._definition.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    }

    const _result = this._parse({ data, path: ctx.path, parent: ctx })

    const result = isAsync(_result)
      ? await _result
      : _result

    return handleResult(ctx, result)
  }

  public spa = this.safeParseAsync.bind(this)

  // TODO: refine()

  // TODO: private refinement()

  // TODO: private _refinement()

  // TODO: superRefine()

  // TODO: optional()

  // TODO: nullable()

  // TODO: nullish()

  // TODO: array()

  // TODO: promise()

  // TODO: or()

  // TODO: and()

  // TODO: transform()

  // TODO: default()

  // TODO: brand()

  // TODO: catch()

  // TODO: describe()

  // TODO: pipe()

  public isOptional(): boolean {
    // TODO: implement
  }

  public isNullable(): boolean {
    // TODO: implement
  }
}


export const LuneFirstPartyTypeKind = {
  LuneString: 'LuneString',
  LuneNumber: 'LuneNumber',
  LuneNaN: 'LuneNaN',
  LuneBigInt: 'LuneBigInt',
  LuneBoolean: 'LuneBoolean',
  LuneDate: 'LuneDate',
  LuneSymbol: 'LuneSymbol',
  LuneUndefined: 'LuneUndefined',
  LuneNull: 'LuneNull',
  LuneAny: 'LuneAny',
  LuneUnknown: 'LuneUnknown',
  LuneNever: 'LuneNever',
  LuneVoid: 'LuneVoid',
  LuneArray: 'LuneArray',
  LuneObject: 'LuneObject',
  LuneUnion: 'LuneUnion',
  LuneDiscriminatedUnion: 'LuneDiscriminatedUnion',
  LuneIntersection: 'LuneIntersection',
  LuneTuple: 'LuneTuple',
  LuneRecord: 'LuneRecord',
  LuneMap: 'LuneMap',
  LuneSet: 'LuneSet',
  LuneFunction: 'LuneFunction',
  LuneLazy: 'LuneLazy',
  LuneLiteral: 'LuneLiteral',
  LuneEnum: 'LuneEnum',
  LuneEffects: 'LuneEffects',
  LuneNativeEnum: 'LuneNativeEnum',
  LuneOptional: 'LuneOptional',
  LuneNullable: 'LuneNullable',
  LuneDefault: 'LuneDefault',
  LuneCatch: 'LuneCatch',
  LunePromise: 'LunePromise',
  LuneBranded: 'LuneBranded',
  LunePipeline: 'LunePipeline'
} as const
