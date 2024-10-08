// Packages:
import { auth, functions } from '../..'
import returnable from 'utils/returnable'
import logError from 'utils/logError'
import thoroughAuthCheck from '@/entrypoints/content/utils/thoroughAuthCheck'
import { httpsCallable } from 'firebase/functions'

// Typescript:
import type { Returnable } from 'types/index'
import type { URLHash } from 'types/websites'
import type { Comment, CommentID } from 'types/comments-and-replies'
import type { FirestoreDatabaseWebsite } from 'types/firestore.database'
import { FieldValue } from 'firebase-admin/firestore'

// Exports:
/**
 * Add a comment.
 */
export const addComment = async ({
  URL,
  URLHash,
  domain,
  body,
  website: {
    title,
    description,
    keywords,
    image,
    favicon,
  },
}: {
  URL: string
  URLHash: URLHash
  domain: string
  body: string
  website: {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
    favicon?: string
  }
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const comment = {
      URLHash,
      domain,
      URL,
      author: auth.currentUser.uid,
      body,
      replyCount: 0,
    } as Comment

    const website = {
      indexor: auth.currentUser.uid,
      URL,
      title,
      description,
      keywords,
      image,
      favicon,
      indexedOn: FieldValue.serverTimestamp(),
    } as FirestoreDatabaseWebsite

    const addComment = httpsCallable(functions, 'addComment')

    const response = (await addComment({ comment, website })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'addComment',
      data: {
        URL,
        URLHash,
        domain,
        body,
        website: {
          title,
          description,
          keywords,
          image,
          favicon,
        },
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Delete a comment.
 */
export const deleteComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const deleteComment = httpsCallable(functions, 'deleteComment')

    const response = (await deleteComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'deleteComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Edit a comment.
 */
export const editComment = async ({
  URL,
  URLHash,
  commentID,
  body,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
  body: string
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const editComment = httpsCallable(functions, 'editComment')

    const response = (await editComment({ URL, URLHash, commentID, body })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'editComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Reply a comment.
 */
export const reportComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const reportComment = httpsCallable(functions, 'reportComment')

    const response = (await reportComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'reportComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Handles both upvoting and rolling back an upvote to a comment.
 */
export const upvoteComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const upvoteComment = httpsCallable(functions, 'upvoteComment')

    const response = (await upvoteComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'upvoteComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Handles both downvoting and rolling back an downvote to a comment.
 */
export const downvoteComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const downvoteComment = httpsCallable(functions, 'downvoteComment')

    const response = (await downvoteComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'downvoteComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Triggered when the user is not interested in the comment itself (and its topics).
 */
export const notInterestedInComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const notInterestedInComment = httpsCallable(functions, 'notInterestedInComment')

    const response = (await notInterestedInComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'notInterestedInComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}

/**
 * Bookmark a comment.
 */
export const bookmarkComment = async ({
  URL,
  URLHash,
  commentID,
}: {
  URL: string
  URLHash: URLHash
  commentID: CommentID
}): Promise<Returnable<null, Error>> => {
  try {
    const authCheckResult = await thoroughAuthCheck(auth.currentUser)
    if (!authCheckResult.status || !auth.currentUser) throw authCheckResult.payload

    const bookmarkComment = httpsCallable(functions, 'bookmarkComment')

    const response = (await bookmarkComment({ URL, URLHash, commentID })).data as Returnable<null, string>
    if (!response.status) throw new Error(response.payload)

    return returnable.success(null)
  } catch (error) {
    logError({
      functionName: 'bookmarkComment',
      data: {
        URL,
        URLHash,
        commentID,
      },
      error,
    })

    return returnable.fail(error as unknown as Error)
  }
}
