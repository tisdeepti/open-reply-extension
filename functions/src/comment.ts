// Packages:
import returnable from 'utils/returnable'
import logError from 'utils/logError'
import { auth, database, firestore } from './config'
import isAuthenticated from './utils/isAuthenticated'
import thoroughUserDetailsCheck from 'utils/thoroughUserDetailsCheck'
import getURLHash from 'utils/getURLHash'
import { isEmpty, omitBy } from 'lodash'
import { indexWebsite } from './website'

// Typescript:
import { type CallableContext } from 'firebase-functions/v1/https'
import type { Returnable } from 'types/index'
import type { FirestoreDatabaseWebsite } from 'types/firestore.database'
import type { Comment, CommentID } from 'types/comments-and-replies'
import type { FlatComment } from 'types/user'
import type { URLHash } from 'types/websites'
import { ServerValue } from 'firebase-admin/database'

// Constants:
import { FIRESTORE_DATABASE_PATHS, REALTIME_DATABASE_PATHS } from 'constants/database/paths'

// Exports:
/**
 * Add a comment.
 */
export const addComment = async (data: {
  comment: Comment
  website: FirestoreDatabaseWebsite
}, context: CallableContext): Promise<Returnable<null, string>> => {
  try {
    const UID = context.auth?.uid
    if (!isAuthenticated(context) || !UID) return returnable.fail('Please login to continue!')
    
    const user = await auth.getUser(UID)
    const name = user.displayName
    const username = (await database.ref(REALTIME_DATABASE_PATHS.USERS.username(UID)).get()).val() as string | undefined
    const thoroughUserCheckResult = thoroughUserDetailsCheck(user, name, username)
    if (!thoroughUserCheckResult.status) return returnable.fail(thoroughUserCheckResult.payload)

    if (await getURLHash(data.comment.URL) !== data.comment.URLHash) throw new Error('Generated Hash for URL did not equal passed URLHash!')

    // Store the comment details in Firestore Database.
    await firestore
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.INDEX).doc(data.comment.URLHash)
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.COMMENTS.INDEX).doc(data.comment.id)
      .create(omitBy<Comment>(data.comment, isEmpty) as Partial<Comment>)

    // Check if the website is indexed by checking the impression count on Realtime Database.
    const isWebsiteIndexed = (await database.ref(REALTIME_DATABASE_PATHS.WEBSITES.impressions(data.comment.URLHash)).get()).exists()

    // If the website is not indexed, index it.
    if (!isWebsiteIndexed) {
      const indexWebsiteResult = await indexWebsite(
        {
          URLHash: data.comment.URLHash,
          website: data.website
        },
        context,
        true
      )

      if (!indexWebsiteResult.status) throw new Error(indexWebsiteResult.payload)
    }

    // Increment the website's comment count.
    await database
      .ref(REALTIME_DATABASE_PATHS.WEBSITES.commentCount(data.comment.URLHash))
      .update(ServerValue.increment(1))

    // Save the flat comment to the user's document.
    await firestore
      .collection(FIRESTORE_DATABASE_PATHS.USERS.INDEX).doc(data.comment.author)
      .collection(FIRESTORE_DATABASE_PATHS.USERS.COMMENTS.INDEX).doc(data.comment.id)
      .create({
        id: data.comment.id,
        URLHash: data.comment.URLHash,
        URL: data.comment.URL,
        domain: data.comment.domain,
        createdAt: data.comment.createdAt,
      } as FlatComment)

    return returnable.success(null)
  } catch (error) {
    logError({ data, error, functionName: 'addComment' })
    return returnable.fail("We're currently facing some problems, please try again later!")
  }
}

/**
 * Delete a comment.
 */
export const deleteComment = async (
  data: {
    URL: string
    URLHash: URLHash
    commentID: CommentID
  },
  context: CallableContext,
): Promise<Returnable<null, string>> => {
  try {
    const UID = context.auth?.uid
    if (!isAuthenticated(context) || !UID) return returnable.fail('Please login to continue!')
    
    const user = await auth.getUser(UID)
    const name = user.displayName
    const username = (await database.ref(REALTIME_DATABASE_PATHS.USERS.username(UID)).get()).val() as string | undefined
    const thoroughUserCheckResult = thoroughUserDetailsCheck(user, name, username)
    if (!thoroughUserCheckResult.status) return returnable.fail(thoroughUserCheckResult.payload)

    if (await getURLHash(data.URL) !== data.URLHash) throw new Error('Generated Hash for URL did not equal passed URLHash!')

    // Verify if the deletor is the comment author
    const commentSnapshot = await firestore
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.INDEX).doc(data.URLHash)
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.COMMENTS.INDEX).doc(data.commentID)
      .get()

    if (!commentSnapshot.exists) throw new Error('Comment does not exist!')
    
    const comment = commentSnapshot.data() as Comment
    if (comment.author !== UID) throw new Error('User is not authorized to delete this comment!')

    // Delete the comment details from Firestore Database.
    await firestore
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.INDEX).doc(data.URLHash)
      .collection(FIRESTORE_DATABASE_PATHS.WEBSITES.COMMENTS.INDEX).doc(data.commentID)
      .delete()

    // Decrement the website's comment count.
    await database
      .ref(REALTIME_DATABASE_PATHS.WEBSITES.commentCount(data.URLHash))
      .update(ServerValue.increment(-1))

    // Delete the flat comment from the user's document.
    await firestore
      .collection(FIRESTORE_DATABASE_PATHS.USERS.INDEX).doc(comment.author)
      .collection(FIRESTORE_DATABASE_PATHS.USERS.COMMENTS.INDEX).doc(data.commentID)
      .delete()

    return returnable.success(null)
  } catch (error) {
    logError({ data, error, functionName: 'deleteComment' })
    return returnable.fail("We're currently facing some problems, please try again later!")
  }
}
