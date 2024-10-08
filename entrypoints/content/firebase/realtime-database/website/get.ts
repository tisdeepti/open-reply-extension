// Packages:
import { database } from '../..'
import { child, get, ref } from 'firebase/database'
import returnable from 'utils/returnable'
import logError from 'utils/logError'

// Typescript:
import type { Returnable } from 'types/index'
import type {
  URLHash,
  WebsiteFlagReason,
} from 'types/websites'
import type { RealtimeDatabaseWebsite } from 'types/realtime.database'

// Constants:
import { REALTIME_DATABASE_PATHS } from 'constants/database/paths'

// Exports:
/**
 * Fetches the website details, given a URLHash, from the Realtime Database.
 */
export const getRDBWebsite = async (URLHash: URLHash): Promise<Returnable<RealtimeDatabaseWebsite | null, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.website(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsite',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the website's impression count given a URLHash, from the Realtime Database.
 */
export const getRDBWebsiteImpressions = async (URLHash: URLHash): Promise<Returnable<number, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.impressions(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(0)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteImpressions',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the website's flag distribution given a URLHash, from the Realtime Database.
 */
export const getRDBWebsiteFlagDistribution = async (URLHash: URLHash): Promise<Returnable<Record<WebsiteFlagReason, number>, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.flagDistribution(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success({} as Record<WebsiteFlagReason, number>)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteFlagDistribution',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the website's flag distribution given a URLHash, from the Realtime Database.
 */
export const getRDBWebsiteFlagDistributionReasonCount = async (URLHash: URLHash, reason: WebsiteFlagReason): Promise<Returnable<number, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.flagDistributionReasonCount(URLHash, reason)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(0)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteFlagDistributionReasonCount',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the website's cumulative weight of all the flags, given a URLHash, from the Realtime Database.
 * 
 * The flag weights are based on the `HARMFUL_WEBSITE_REASON_WEIGHTS` object.
 */
export const getRDBWebsiteFlagsCumulativeWeight = async (URLHash: URLHash): Promise<Returnable<number, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.flagsCumulativeWeight(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(0)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteFlagsCumulativeWeight',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the number of times a website was uniquely flagged, given a URLHash, from the Realtime Database.
 */
export const getRDBWebsiteFlagCount = async (URLHash: URLHash): Promise<Returnable<number, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.flagCount(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(0)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteFlagCount',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Fetches the number comment count on a website, given a URLHash, from the Realtime Database.
 */
export const getRDBWebsiteCommentCount = async (URLHash: URLHash): Promise<Returnable<number, Error>> => {
  try {
    const snapshot = await get(child(ref(database), REALTIME_DATABASE_PATHS.WEBSITES.commentCount(URLHash)))
    if (snapshot.exists()) return returnable.success(snapshot.val())
    else return returnable.success(0)
  } catch (error) {
    logError({
      functionName: 'getRDBWebsiteCommentCount',
      data: URLHash,
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}
