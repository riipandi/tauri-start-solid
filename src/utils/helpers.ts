import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const clx = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export { clx }
