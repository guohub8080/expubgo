import { isNil } from "es-toolkit/predicate"

export default (given: unknown, defaultValue: unknown) => {
  if (isNil(given)) return defaultValue
  return given
}