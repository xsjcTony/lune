import { LuneIssueCode } from '../error'
import { getParsedType, LuneParsedType } from '../utils'
import type { LuneErrorMap } from '../error'
import type { ParseInput, ParseParams, ParseReturnType } from '../utils/parse'


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
  errorMap?: unknown // TODO: implement
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
  errorMap?: unknown // TODO: implement
  invalid_type_error?: string
  required_error?: string
  description?: string
}

export type ProcessedCreateParams = LuneTypeDefinition

export const processCreateParams = (params: RawCreateParams | undefined): ProcessedCreateParams => {
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


export abstract class LuneType<Output = any, Definition extends LuneTypeDefinition = LuneTypeDefinition, Input = Output> {
  // `_output` and `_input` are defined for TS usage only
  public readonly _output!: Output
  public readonly _input!: Input

  readonly #definition: Definition


  protected constructor(definition: Definition) {
    this.#definition = definition
    // TODO: implement .bind(this) (Want to see what will happen without binding)
  }


  public get description(): string | undefined {
    return this.#definition.description
  }

  protected abstract _parse(input: ParseInput): ParseReturnType<Output>

  protected _getType(input: ParseInput): string {
    return getParsedType(input.data)
  }

  // TODO: _getOrReturnCtx()

  // TODO: _processInputParams()

  // TODO: _parseSync()

  // TODO: _parseAsync()

  public parse(data: unknown, params?: Partial<ParseParams>): Output {
    // TODO: implement
  }

  // TODO: safeParse()

  public async parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output> {
    // TODO: implement
  }

  // TODO: safeParseAsync()

  // public spa = this.safeParseAsync

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
