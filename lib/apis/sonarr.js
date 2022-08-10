async function sonarrFetch(path, method = 'GET', query = {}) {
    const urlSearchParams = new URLSearchParams({ ...query, apikey: process.env.SONARR_API_KEY })

    const response = await fetch(`${process.env.SONARR_BASE_URL}${path}?${urlSearchParams}`, {
        method
    })

    if (method !== 'DELETE') {
        const data = await response.json()

        return data
    }
}

export async function getSonarrSeries(seriesId) {
    return sonarrFetch(`/api/v3/episode`, 'GET', { seriesId })
}

export async function getSonarrSeriesEpisodeFiles(seriesId) {
    return sonarrFetch(`/api/v3/episodeFile`, 'GET', { seriesId })
}

export function getAllSonarrSeries() {
    return sonarrFetch(`/api/v3/series`, 'GET')
}

export async function deleteSonarrEpisode(episodeId) {
    return sonarrFetch(`/api/v3/episode/${episodeId}`, 'DELETE')
}

export async function getSonarrEpisode(episodeId) {
    return sonarrFetch(`/api/v3/episode/${episodeId}`, 'GET')
}

// // Get movie details for a movie by TMDB ID.
// export function getSonarrMovie(tmdbId) {
//     return sonarrFetch(`/api/v3/movie`, 'GET', { tmdbId })
// }

// Get history for a movie by id.
export function getSonarrEpisodeHistory(episodeId) {
    return sonarrFetch(`/api/v3/history`, 'GET', { pageSize: 1000, episodeId })
}

// // Delete the movie from Sonarr and also the file(s)
// // that were downloaded.
// export function deleteSonarrMovie(movieId) {
//     return sonarrFetch(`/api/v3/movie/${movieId}`, 'DELETE', {
//         deleteFiles: true,
//         addImportExclusion: false
//     })
// }

export default sonarrFetch
