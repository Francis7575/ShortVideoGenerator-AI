import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='grid items-center grid-cols-1 md:grid-cols-2'>
      <div>
        <Image src={'/login-image.png'} width={500} height={500} alt="" className='w-full'/>
      </div>
    <div className='flex justify-center items-center h-screen'>
      <SignIn />
    </div>
    </div>
  )
}