'use client'
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const SideNav = () => {
  const path = usePathname()
  console.log(path);

  const MenuOptions = [
    { id: 1, name: 'Dashboard', path: '/dashboard', icon: PanelsTopLeft },
    { id: 2, name: 'Create New', path: '/dashboard/create-new', icon: FileVideo },
    { id: 3, name: 'Upgrade', path: '/upgrade', icon: ShieldPlus },
    { id: 4, name: 'Account', path: '/account', icon: CircleUser }
  ]


  return (
    <div className="w-64 h-screen shadow-md p-5">
      <div className='grid gap-4'>
        {MenuOptions.map(item => (
          <Link key={item.id} href={item.path}
            className={`flex items-center gap-3 p-3 hover:bg-primary cursor-pointer hover:text-white
            rounded-md ${path === item.path && 'bg-primary text-white'}`}>
            <span><item.icon /></span>
            <h2>{item.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideNav