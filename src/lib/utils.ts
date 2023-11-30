import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSongDuration(duration: number): string {
  // Ensure the input is a positive number
  if (typeof duration !== 'number' || duration < 0) {
    throw new Error('Invalid input. Duration must be a non-negative number.')
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(duration / 3600000)
  const minutes = Math.floor((duration % 3600000) / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)

  // Build the formatted string
  let result = ''
  if (hours > 0) {
    result += `${hours} hr `
  }
  if (minutes > 0 || hours === 0) {
    result += `${minutes} min `
  }
  if (seconds > 0 && hours === 0) {
    result += `${seconds} sec`
  }

  return result.trim()
}
