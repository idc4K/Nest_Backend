import { isString } from 'lodash'
import { isDebug } from 'src/constants'

export function normalizeString (str, lowercase = true) {
  if (isString(str)) {
    const value = str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    return lowercase ? value.toLowerCase() : value
  }
  return ''
}

/**
 * It tries to parse a string into a JSON object, and if it fails, it returns undefined
 * @param value - Nullable<string>
 * @returns The result of the tryParse function.
 */
export function tryParse<T = any> (value: Nullable<string>) {
  let result
  if (value && isString(value) && value !== ' ') {
    try {
      result = JSON.parse(value) as T
    }
    catch (e) {
      if (isDebug()) {
        console.error(e, 'tryParse')
      }
    }
  }
  return result
}

export interface DateConfig {
  options: Intl.DateTimeFormatOptions
  locale: Intl.LocalesArgument
  hasTime: boolean
  separator: string
}

export function convertDate (createdAt: Date, config: DateConfig) {
  const orderDate = new Date(createdAt)
  const day = orderDate.toLocaleString(config.locale, { day: config.options.day })
  const month = orderDate.toLocaleString(config.locale, { month: config.options.month })
  const year = orderDate.toLocaleString(config.locale, { year: config.options.year })
  const time = orderDate.toLocaleString(config.locale, { hour: config.options.hour, minute: config.options.minute, second: config.options.second, hour12: config.options.hour12 })

  let formattedDate
  if (config.hasTime) {
    formattedDate = `${day}${config.separator}${month}${config.separator}${year}${config.separator}${time}`
    return formattedDate
  }
  else {
    formattedDate = `${day}${config.separator}${month}${config.separator}${year}`
    return formattedDate
  }
}
