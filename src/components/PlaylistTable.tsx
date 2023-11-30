import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  spotifyApi: SpotifyWebApi
  playlistId: string
}

export default async function PlaylistTable({ playlistId, spotifyApi }: Props) {
  return (
    <section className='flex flex-col pb-4 px-6 flex-1 pt-6'>TABLE</section>
  )
}
