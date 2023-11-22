import { LoginProviders } from '@/components/LoginProviders'

export default async function Login() {
  return (
    <main className='md:from-zinc-900 flex items-center justify-center md:to-black md:bg-gradient-to-b flex-1 md:p-8 p-4 bg-black'>
      <section className='rounded-lg bg-black py-8 text-center items-center text-white md:w-3/5 flex flex-col w-full'>
        <h1 className='md:text-5xl text-2xl font-bold mb-8'>
          Log in to Spotify Clone
        </h1>
        <LoginProviders />
      </section>
    </main>
  )
}
