export const arrayToEnum = <T extends string, const U extends readonly [T, ...T[]]>(items: U): { [k in U[number]]: k } =>
  items.reduce(
    (prev, item) => {
      prev[item] = item
      return prev
    },
    {} as { [k in U[number]]: k }
  )
