import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentYear() {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: userTimeZone
  })
  const currentYear = new Date(currentTime).getFullYear()

  return currentYear
}

export function hasMillisecondProperty(
  value: any
): value is { totalMilliseconds: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'totalMilliseconds' in value &&
    typeof value.totalMilliseconds === 'number'
  )
}

export function formatPlaylistTotalDuration(duration: number): string {
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
  /* if (typeof duration !== 'number' || duration < 0) {
    throw new Error('Invalid input. Duration must be a non-negative number.')
  } */

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

export function formatCurrentSongProgress(progress: number, duration: number) {
  if (duration <= 0) {
    return 0
  }

  const percentage = (progress / duration) * 100
  return Math.min(100, Math.max(0, percentage))
}

export function formatCurrentSongTime(time: number) {
  if (time < 0) {
    return '-:--'
  }

  const seconds = Math.floor(time / 1000) % 60
  const minutes = Math.floor(time / (1000 * 60)) % 60
  const hours = Math.floor(time / (1000 * 60 * 60))

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  const formattedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`
  const formattedHours = hours > 0 ? `${hours}:` : ''

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
}

export function getGreetingTime(): string {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: userTimeZone
  })
  const currentHour = new Date(currentTime).getHours()

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export function removeSpecialCharacters(inputString: string) {
  // Define a regular expression to match special characters
  var specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g

  // Use the replace method to remove special characters from the input string
  var stringWithoutSpecialChars = inputString.replace(specialCharacterRegex, '')

  return stringWithoutSpecialChars
}

export function formatAlbumReleaseDateToYear(releaseDate: string) {
  const date = new Date(releaseDate)
  return date.getFullYear()
}

export function formatArtistFollowersCount(followers: number) {
  return followers.toLocaleString()
}

export function formatTimeRemaining(remaining: number) {
  if (remaining <= 0) {
    return 'Reload now'
  }

  const seconds = Math.ceil(remaining % 60)
  const minutes = Math.floor((remaining / 60) % 60)
  const hours = Math.floor(remaining / 3600)

  let formattedTime = ''

  if (hours > 0) {
    formattedTime += `${hours}:${minutes.toString().padStart(2, '0')} hour${
      hours > 1 ? 's' : ''
    }`
  } else if (minutes > 0) {
    formattedTime += `${minutes}:${seconds.toString().padStart(2, '0')} minute${
      minutes > 1 ? 's' : ''
    }`
  } else {
    formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}`
  }

  return `Reload in ${formattedTime}`
}
