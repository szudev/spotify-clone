import { SearchResults } from '@/services/search'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
}

export default async function CustomSearchedResult({
  queryParam,
  spotifyApi
}: Props) {
  const { body, statusCode } = await SearchResults({
    queryParam,
    spotifyApi
  })
  if (statusCode !== 200) return notFound()

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-white'>CustomSearchedResult</p>
    </div>
  )
}
