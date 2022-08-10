async function ombiFetch(path, method = 'GET', body = {}) {
  // console.log('ombiFetch', path, method, body, process.env.OMBI_BASE_URL)
  const response = await fetch(`${process.env.OMBI_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'ApiKey': process.env.OMBI_API_KEY
    },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
  })
  const data = await response.json()

  return data
}

// Get the oldest available movie requests in order of when they
// were marked as available.
export function getOldestAvailableOmbiMovieRequests(count = 100) {
  return ombiFetch(`/api/v2/Requests/movie/available/${count}/0/markedAsAvailable/asc`)
}

// Delete a movie request.
export function deleteOmbiMovieRequest(requestId) {
  return ombiFetch(`/api/v1/Request/movie/${requestId}`, 'DELETE')
}

// Mark a movie as unavailable.
export function markOmbiMovieUnavailable(movieId) {
  return ombiFetch('/api/v1/Request/movie/unavailable', 'POST', {
    id: movieId,
    is4K: false
  })
}

export function markOmbiEpisodeUnavailable(episodeId) {
  return ombiFetch('/api/v1/Request/episode/unavailable', 'POST', {
    id: episodeId,
    is4K: false
  })
}

// Resync Ombi DB with media server so any deleted
// requests can be re-requested.
export function resyncOmbiMedia() {
  return ombiFetch('/api/v1/Job/clearmediaserverdata', 'POST')
}
// Get the oldest tv episodes in order of when they were marked as available.
export function getOldestRequestedTVShows(count = 100) {
  return ombiFetch(`/api/v2/Requests/tv/processing/${count}/0/requestedDate/asc`)
}

export default ombiFetch