// import { getOldestRequestedTVShows } from '../apis/ombi.js'
import sonarrFetch, { getSonarrEpisode, getAllSonarrSeries, getSonarrEpisodeHistory, getSonarrSeriesEpisodeFiles, deleteSonarrEpisode } from '../apis/sonarr.js'
import { deleteRUTorrent } from '../apis/rutorrent.js'


async function cleanTV(sizeToDeleteInBytes = 2147483648) {
    // const ombiTvRequests = await getOldestRequestedTVShows()
    // const { collection } = ombiTvRequests

    // Fetch all series from sonarr.
    const sonarrSeries = await getAllSonarrSeries()

    // For each series, get its series ID from sonarr.
    const sonarrSeriesIds = sonarrSeries.map(series => series.id)

    let availableEpisodes = []

    // Get the file system details about episodes downloaded.
    await Promise.all(sonarrSeriesIds.map(async (id) => {
        const episodeFiles = await getSonarrSeriesEpisodeFiles(id)
        if (episodeFiles.length) {
            availableEpisodes = availableEpisodes.concat(episodeFiles)
        }
    }))

    // Sort episodes by dateAdded attribute.
    availableEpisodes = availableEpisodes.sort((a, b) => a.dateAdded > b.dateAdded ? 1 : -1)

    const episodesToDelete = []
    let episodesToDeleteSize = 0

    availableEpisodes.forEach(episode => {
        if (episodesToDeleteSize < sizeToDeleteInBytes) {
            episodesToDelete.push(episode)
            episodesToDeleteSize += episode.size
        }
    })

    await Promise.all(episodesToDelete.map(async (episode) => {
        console.log('Deleting episode:', episode.path)
        // Return download hashes so we can delete from rutorrent.
        const { records } = await getSonarrEpisodeHistory(episode.id)

        // Make a unique list of hashes.
        // There should only be one hash per episode, but just in case there's more than one.
        const hashes = [...new Set(records.map(entry => entry.downloadId))]

        // Delete the ruTorrent torrents.
        // This also deletes the downloaded file(s) from the filesystem.

        if (hashes.length) {
            for (let hash of hashes) {
                console.log(hash)
                // await deleteRUTorrent(hash)
            }
        }

        // console.log(episode.id)
        // await deleteSonarrEpisode(episode.id)
        const sonarrEpisode = await getSonarrEpisode(episode.id)

        // Get the ombi episode using the tvDbId.

        // Delete the ombi episode.

        // Mark the ombi episode as unavailable.

        // TODO: Look series / episode up in Ombi so we can find its id.

        // await markOmbiEpisodeUnavailable(episode.id)
        // await deleteOmbiEpisodeRequest(episode.id)

        debugger
    }))
}

export default cleanTV
