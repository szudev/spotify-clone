import spotifyApi from '@/lib/spotify'

export type GetPlaylistReturnType = Awaited<
  ReturnType<typeof spotifyApi.getPlaylist>
>
