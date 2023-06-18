export interface ParseParams {
  path: (string | number)[]
  errorMap: unknown // TODO: implement LuneErrorMap
  async: boolean
}
