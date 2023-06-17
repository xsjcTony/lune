export interface ParseParams {
  path: (number | string)[]
  errorMap: unknown // TODO: implement LuneErrorMap
  async: boolean
}
