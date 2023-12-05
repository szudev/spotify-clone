import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPlaylistTotalDuration(duration: number): string {
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

export function formatSongDuration(duration: number): string {
  // Ensure the input is a positive number
  if (typeof duration !== 'number' || duration < 0) {
    throw new Error('Invalid input. Duration must be a non-negative number.')
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(duration / 3600000)
  const minutes = Math.floor((duration % 3600000) / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)

  // Format the duration based on the calculated values
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  } else {
    return `0:${String(seconds).padStart(2, '0')}`
  }
}

export function formatSongAddedAt(added_at: string) {
  const currentDate = new Date()
  const addedDate = new Date(added_at)

  const differenceInDays = Math.floor(
    (currentDate.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (differenceInDays < 1) {
    // Less than a day
    const differenceInHours = Math.floor(
      (currentDate.getTime() - addedDate.getTime()) / (1000 * 60 * 60)
    )
    if (differenceInHours < 1) {
      // Less than an hour
      const differenceInMinutes = Math.floor(
        (currentDate.getTime() - addedDate.getTime()) / (1000 * 60)
      )
      return `${differenceInMinutes} ${
        differenceInMinutes === 1 ? 'minute' : 'minutes'
      } ago`
    } else {
      // Less than a day, but more than an hour
      return `${differenceInHours} ${
        differenceInHours === 1 ? 'hour' : 'hours'
      } ago`
    }
  } else if (differenceInDays < 7) {
    // Less than a week
    return `${differenceInDays} ${differenceInDays === 1 ? 'day' : 'days'} ago`
  } else if (differenceInDays < 30) {
    // Less than a month
    const differenceInWeeks = Math.floor(differenceInDays / 7)
    return `${differenceInWeeks} ${
      differenceInWeeks === 1 ? 'week' : 'weeks'
    } ago`
  } else {
    // A month or more
    return format(addedDate, 'MMM dd, yyyy')
  }
}
