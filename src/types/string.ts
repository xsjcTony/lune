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

export type LuneStringCheck =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }
  | { kind: 'length'; value: number; message?: string }
  | { kind: 'email'; message?: string }
  | { kind: 'url'; message?: string }
  | { kind: 'emoji'; message?: string }
  | { kind: 'uuid'; message?: string }
  | { kind: 'cuid'; message?: string }
  | { kind: 'includes'; value: string; position?: number; message?: string }
  | { kind: 'cuid2'; message?: string }
  | { kind: 'ulid'; message?: string }
  | { kind: 'startsWith'; value: string; message?: string }
  | { kind: 'endsWith'; value: string; message?: string }
  | { kind: 'regex'; regex: RegExp; message?: string }
  | { kind: 'trim'; message?: string }
  | { kind: 'toLowerCase'; message?: string }
  | { kind: 'toUpperCase'; message?: string }
  | { kind: 'datetime'; offset: boolean; precision: number | null; message?: string }
  | { kind: 'ip'; version?: IpVersion; message?: string }


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


const stringCreate = LuneString.create


export { stringCreate as string }
