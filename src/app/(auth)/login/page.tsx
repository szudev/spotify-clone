import { LoginProviders } from '@/components/LoginProviders'

export default async function Login() {
  return (
    <main className='md:from-zinc-900 md:to-black md:bg-gradient-to-b flex items-center justify-center flex-1 md:p-8 p-4 bg-black'>
      <section className='rounded-lg bg-black md:py-20 lg:py-28 py-0 text-center items-center text-white md:w-3/5 flex flex-col w-full'>
        <h1 className='sm:text-3xl md:text-4xl text-2xl font-bold mb-8'>
          Log in to Szudev Music
        </h1>
        <LoginProviders />
      </section>
    </main>
  )
}
