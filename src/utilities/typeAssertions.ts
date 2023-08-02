export const isNotNull = <T>(something: T): something is NonNullable<T> => !!something
