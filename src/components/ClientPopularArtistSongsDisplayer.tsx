'use client'

import { useState } from 'react'
import { Button } from './Button'
import ClientTopArtistTrackItem from './ClientTopArtistTrackItem'

interface Props {
  artistId: string
  tracks: SpotifyApi.TrackObjectFull[]
  uris: string[]
}

export default function ClientPopularArtistSongsDisplayer({
  tracks,
  uris,
  artistId
}: Props) {
  const [showMore, setShowMore] = useState<boolean>(false)
  const displayedTracks = showMore
    ? tracks
    : tracks.length > 5
    ? tracks.slice(0, 5)
    : tracks
  return (
    <>
      <section className='grid grid-cols-1 w-full grid-rows-[1fr] rounded-md gap-2 items-end'>
        {displayedTracks.map((track, i) => (
          <ClientTopArtistTrackItem
            key={track.id}
            track={track}
            i={i}
            artistId={artistId}
            tracks={tracks}
            uris={uris}
          />
        ))}
      </section>
      {tracks.length > 5 ? (
        <Button
          onClick={() => setShowMore((prev) => !prev)}
          className='text-zinc-400 px-2 font-normal text-sm hover:text-white'
        >
          {showMore ? 'Show less' : 'Show more'}
        </Button>
      ) : null}
    </>
  )
}
