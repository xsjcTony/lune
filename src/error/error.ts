import { arrayToEnum } from '../utils'
import type { LuneTypeAny, TypeOf } from '../types'
import type { LuneParsedType } from '../utils'
import type { ParsePath } from '../utils/parse'
import type { OmitStrings, Primitive } from '../utils/types'


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
//      ,$@F              **                LuneError              @@@@j        //
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


export const LuneIssueCode = arrayToEnum([
  'invalid_type',
  'invalid_literal',
  'custom',
  'invalid_union',
  'invalid_union_discriminator',
  'invalid_enum_value',
  'unrecognized_keys',
  'invalid_arguments',
  'invalid_return_type',
  'invalid_date',
  'invalid_string',
  'too_small',
  'too_big',
  'invalid_intersection_types',
  'not_multiple_of',
  'not_finite'
])

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LuneIssueCode = keyof typeof LuneIssueCode


export interface LuneIssueBase {
  path: ParsePath
  message?: string
}


export interface LuneInvalidTypeIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_type
  expected: LuneParsedType
  received: LuneParsedType
}

export interface LuneInvalidLiteralIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_literal
  expected: unknown
  received: unknown
}

export interface LuneUnrecognizedKeysIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.unrecognized_keys
  keys: string[]
}

export interface LuneInvalidUnionIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_union
  unionErrors: LuneError[]
}

export interface LuneInvalidUnionDiscriminatorIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_union_discriminator
  options: Primitive[]
}

export interface LuneInvalidEnumValueIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_enum_value
  received: string | number
  options: (string | number)[]
}

export interface LuneInvalidArgumentsIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_arguments
  argumentsError: LuneError
}

export interface LuneInvalidReturnTypeIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_return_type
  returnTypeError: LuneError
}

export interface LuneInvalidDateIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_date
}


// TODO: is there more?
export type StringValidation =
  | 'email'
  | 'url'
  | 'emoji'
  | 'uuid'
  | 'regex'
  | 'cuid'
  | 'cuid2'
  | 'ulid'
  | 'datetime'
  | 'ip'
  | { includes: string; position?: number }
  | { startsWith: string }
  | { endsWith: string }

export interface LuneInvalidStringIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_string
  validation: StringValidation
}


type TooSmallOrBigType =
  | 'array'
  | 'string'
  | 'number'
  | 'set'
  | 'date'
  | 'bigint'

export interface LuneTooSmallIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.too_small
  minimum: bigint | number
  inclusive: boolean
  exact?: boolean
  type: TooSmallOrBigType
}

export interface LuneTooBigIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.too_big
  maximum: bigint | number
  inclusive: boolean
  exact?: boolean
  type: TooSmallOrBigType
}

export interface LuneInvalidIntersectionTypesIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.invalid_intersection_types
}

export interface LuneNotMultipleOfIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.not_multiple_of
  multipleOf: bigint | number
}

export interface LuneNotFiniteIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.not_finite
}

export interface LuneCustomIssue extends LuneIssueBase {
  code: typeof LuneIssueCode.custom
  params?: Record<string, any>
}


export type LuneIssueBaseData =
  | LuneInvalidTypeIssue
  | LuneInvalidLiteralIssue
  | LuneUnrecognizedKeysIssue
  | LuneInvalidUnionIssue
  | LuneInvalidUnionDiscriminatorIssue
  | LuneInvalidEnumValueIssue
  | LuneInvalidArgumentsIssue
  | LuneInvalidReturnTypeIssue
  | LuneInvalidDateIssue
  | LuneInvalidStringIssue
  | LuneTooSmallIssue
  | LuneTooBigIssue
  | LuneInvalidIntersectionTypesIssue
  | LuneNotMultipleOfIssue
  | LuneNotFiniteIssue
  | LuneCustomIssue


export type LuneIssue = LuneIssueBaseData & {
  fatal?: boolean
  message: string
}


// formatted error
// TODO: track this: https://github.com/colinhacks/zod/issues/2510
// here it's a little bit different than the original zod implementation because I think `T extends [any, ...any[]]` is redundant here
type RecursiveLuneFormattedError<T> = T extends any[] | object
  ? { [K in keyof T]?: LuneFormattedError<T[K]> }
  : unknown

export type LuneFormattedError<T, U = string> = RecursiveLuneFormattedError<NonNullable<T>> & {
  _errors: U[]
}

export type InferFormattedError<T extends LuneTypeAny, U = string> = LuneFormattedError<TypeOf<T>, U>


// flattened error
export interface LuneFlattenedError<T, U = string> {
  formErrors: U[]
  fieldErrors: Partial<Record<keyof T, U[]>>
}

export type InferFlattenedError<T extends LuneTypeAny, U = string> = LuneFlattenedError<TypeOf<T>, U>


export class LuneError<T = any> extends Error {
  public issues: LuneIssue[] = []


  public constructor(issues: LuneIssue[]) {
    super()

    this.issues = issues
    this.name = 'LuneError'
  }


  public override toString(): string {
    return this.message
  }


  public override get message(): string {
    return JSON.stringify(
      this.issues,
      (_, value) => typeof value === 'bigint' ? value.toString() : value,
      2
    )
  }


  public addIssue(this: LuneError<T>, issue: LuneIssue): void {
    this.issues.push(issue)
  }

  public addIssues(this: LuneError<T>, issues: LuneIssue[]): void {
    this.issues.push(...issues)
  }


  public format(): LuneFormattedError<T>
  public format<U>(mapper: (issue: LuneIssue) => U): LuneFormattedError<T, U>
  public format<U>(
    mapper: (issue: LuneIssue) => U | string = (issue: LuneIssue) => issue.message
  ): LuneFormattedError<T, U | string> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const fieldErrors = { _errors: [] } as LuneFormattedError<T, U | string>

    const processError = (error: LuneError): void => {
      for (const issue of error.issues) {
        switch (issue.code) {
          case LuneIssueCode.invalid_union:
            issue.unionErrors.forEach(processError)
            break
          case LuneIssueCode.invalid_arguments:
            processError(issue.argumentsError)
            break
          case LuneIssueCode.invalid_return_type:
            processError(issue.returnTypeError)
            break
          default:
            if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue))
              break
            }

            issue.path.reduce((prev, curr, index) => {
              // TODO: implement
            }, fieldErrors)
        }
      }
    }

    processError(this)

    return fieldErrors
  }


  public flatten(): LuneFlattenedError<T>
  public flatten<U>(mapper: (issue: LuneIssue) => U): LuneFlattenedError<T, U>
  public flatten<U>(
    mapper: (issue: LuneIssue) => U | string = (issue: LuneIssue) => issue.message
  ): LuneFlattenedError<T, U | string> {
    const formErrors: LuneFlattenedError<T, U | string>['formErrors'] = []
    const fieldErrors: LuneFlattenedError<T, U | string>['fieldErrors'] = {}

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(mapper(issue))
      } else {
        const path = issue.path[0] as keyof T
        fieldErrors[path] = fieldErrors[path] ?? []
        fieldErrors[path]?.push(mapper(issue))
      }
    }

    return { formErrors, fieldErrors }
  }
}


type OmitPath<T extends object> = OmitStrings<T, 'path'>


export interface LuneIssueData extends OmitPath<LuneIssueBaseData> {
  path?: ParsePath
  fatal?: boolean
}


export interface LuneErrorMapCtx {
  defaultError: string
  data: any
}

export type LuneErrorMap = (issue: LuneIssueBaseData, ctx: LuneErrorMapCtx) => { message: string }
