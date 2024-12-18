'use client'
import { FileVideo, PanelsTopLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const MenuOptions = [
  { id: 1, name: 'Dashboard', path: '/dashboard', icon: PanelsTopLeft },
  { id: 2, name: 'Create New', path: '/dashboard/create-new', icon: FileVideo },
  { id: 3, name: 'Buy Credits', path: '/dashboard/buy-credits', icon: '/credits.png' },
]

const SideNav = () => {
  const path = usePathname()

  return (
    <div className="w-64 h-screen shadow-md p-5">
      <div className='grid gap-4'>
        {MenuOptions.map(item => (
          <Link key={item.id} href={item.path}
            className={`flex items-center gap-3 p-3 hover:bg-primary cursor-pointer hover:text-white
            rounded-md ${path === item.path && 'bg-primary text-white'}`}>
            <span>
              {typeof item.icon === 'string' ? (
                <Image src={item.icon} alt={item.name} width={20} height={20} className="w-6 h-6" /> 
              ) : (
                <item.icon className="w-6 h-6" /> 
              )}
            </span>
            <h2>{item.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideNav