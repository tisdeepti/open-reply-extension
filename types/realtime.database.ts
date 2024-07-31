// Imports:
import type { UID } from './user'

// Exports:
/**
 * The `RealtimeDatabaseUser` interface defines the partial details of a user.
 * 
 * A user's profile picture can be accessed using `<STORAGE_BUCKET>/users/{UID}.png`
 */
export interface RealtimeDatabaseUser {
  username?: string
  fullName?: string
}

export interface RealtimeDatabaseSchema {
  users: Record<UID, RealtimeDatabaseUser>
  usernames: Record<string, UID>
}