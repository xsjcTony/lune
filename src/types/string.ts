import { LuneType, LuneFirstPartyTypeKind, processCreateParams } from './base'
import type { LuneTypeDefinition, RawCreateParams } from './base'


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
//      ,$@F              **               LuneString              @@@@j        //
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

export type IpVersion = 'v4' | 'v6'

export type LuneStringCheck = { message?: string } & (
  | { kind: 'min'; value: number }
  | { kind: 'max'; value: number }
  | { kind: 'length'; value: number }
  | { kind: 'email' }
  | { kind: 'url' }
  | { kind: 'emoji' }
  | { kind: 'uuid' }
  | { kind: 'cuid' }
  | { kind: 'includes'; value: string; position?: number }
  | { kind: 'cuid2' }
  | { kind: 'ulid' }
  | { kind: 'startsWith'; value: string }
  | { kind: 'endsWith'; value: string }
  | { kind: 'regex'; regex: RegExp }
  | { kind: 'trim' }
  | { kind: 'toLowerCase' }
  | { kind: 'toUpperCase' }
  | { kind: 'datetime'; offset: boolean; precision: number | null }
  | { kind: 'ip'; version?: IpVersion }
)


export interface LuneStringDefinition extends LuneTypeDefinition {
  checks: LuneStringCheck[]
  typeName: typeof LuneFirstPartyTypeKind.LuneString
  coerce: boolean
}


export class LuneString extends LuneType<string, LuneStringDefinition> {
  public static create(this: void, params?: RawCreateParams & { coerce?: true }): LuneString {
    return new LuneString({
      checks: [],
      typeName: LuneFirstPartyTypeKind.LuneString,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    })
  }
}


const createString = LuneString.create


export { createString as string }
