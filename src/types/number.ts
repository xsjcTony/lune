import { LuneType, processCreateParams, LuneFirstPartyTypeKind } from './base'
import type { LuneTypeDefinition, RawCreateParams } from './base'
import { addIssueToContext, INVALID, LuneParsedType, ParseInput, ParseReturnType, ParseStatus } from '../utils'
import { LuneIssueCode } from '../error'


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
//      ,$@F              **               LuneNumber              @@@@j        //
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


export type LuneNumberCheck = { message?: string } & (
  | { kind: 'min'; value: number; inclusive: boolean }
  | { kind: 'max'; value: number; inclusive: boolean }
  | { kind: 'int' }
  | { kind: 'multipleOf'; value: number }
  | { kind: 'finite' }
)


export interface LuneNumberDefinition extends LuneTypeDefinition {
  checks: LuneNumberCheck[]
  typeName: typeof LuneFirstPartyTypeKind.LuneNumber
  coerce: boolean
}


export class LuneNumber extends LuneType<number, LuneNumberDefinition> {
  public static create(this: void, params?: RawCreateParams & { coerce?: boolean }): LuneNumber {
    return new LuneNumber({
      checks: [],
      typeName: LuneFirstPartyTypeKind.LuneNumber,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    })
  }


  protected _parse(input: ParseInput): ParseReturnType<number> {
    if (this._definition.coerce) {
      input.data = Number(input.data)
    }

    // invalid type
    if (this._getType(input) !== LuneParsedType.number) {
      const ctx = this._getCtx(input)

      addIssueToContext(ctx, {
        code: LuneIssueCode.invalid_type,
        expected: LuneParsedType.number,
        received: ctx.parsedType
      })

      return INVALID
    }


    const status = new ParseStatus()

    // TODO: implement other checks

    return { status: status.value, value: input.data }
  }
}


const createNumber = LuneNumber.create


export { createNumber as number }
