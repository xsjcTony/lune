import { defaultErrorMap } from '../locale'
import type { LuneErrorMap } from './error'


let errorMap: LuneErrorMap = defaultErrorMap


export const setErrorMap = (map: LuneErrorMap) => void (errorMap = map)

export const getErrorMap = (): LuneErrorMap => errorMap
