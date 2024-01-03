import { getArtistTopTracks } from '@/services/artist'
import ClientCoverPlayer from './ClientCoverPlayer'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  artist: SpotifyApi.ArtistObjectFull
  spotifyApi: SpotifyWebApi
  customButtonStyles?: string
  customIconStyles?: string
  customOnPlayStyles?: string
}

export default async function StreamCustomSearchArtistPlayer({
  artist,
  spotifyApi,
  customButtonStyles,
  customIconStyles,
  customOnPlayStyles
}: Props) {
  const { body, statusCode } = await getArtistTopTracks({
    artistId: artist.id,
    spotifyApi
  })

  if (!body || statusCode !== 200) return null

  const tracks = body.tracks.filter((track) => track.uri)
  const uris = tracks.map((track) => track.uri)

  return (
    <ClientCoverPlayer
      artistId={artist.id}
      tracks={tracks}
      uris={uris}
      playerType='artist'
      onPlayStyle={
        customOnPlayStyles ? customOnPlayStyles : '-translate-y-5 opacity-100'
      }
      iconStyles={customIconStyles ? customIconStyles : 'h-1/2 w-1/2'}
      buttonStyles={
        customButtonStyles
          ? customButtonStyles
          : 'absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-5 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-5 rounded-full w-12 h-12 bg-green-500'
      }
    />
  )
}
