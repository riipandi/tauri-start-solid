import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple CSS class values using the `clsx` and `tailwind-merge` libraries.
 *
 * @param args - An array of CSS class values to be combined.
 * @returns The combined CSS class value.
 */
export function clx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

/**
 * Custom encoder to handle special cases and remove quotes for primitive values
 * while keeping JSON format for objects
 * @param value - Value to be encoded
 */
export function storeEncode(value: any): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/**
 * Custom decoder to parse values correctly
 * @param value - Value to be decoded
 */
export function storeDecode(value: string): any {
  if (value === 'null') return null
  if (value === '') return null
  if (value === 'undefined') return undefined

  // Try parsing as number
  const num = Number(value)
  if (!Number.isNaN(num)) return num

  // Try parsing as JSON for objects
  try {
    return JSON.parse(value)
  } catch {
    // If not JSON, return as is
    return value
  }
}

/**
 * Gets initials from a full name
 * Example: "John Doe" -> "JD", "Alice" -> "A", "Bob Smith Jones" -> "BS"
 *
 * @param name - Full name to get initials from
 * @param maxInitials - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials from the name
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name) return ''
  return name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .filter((char) => char && /[A-Za-z]/.test(char))
    .slice(0, maxInitials)
    .join('')
    .toUpperCase()
}
