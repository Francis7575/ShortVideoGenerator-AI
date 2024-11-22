'use client'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useUserDetailContext } from "@/app/_context/UserDetailContext";
import { Menu } from 'lucide-react'
import { useState } from "react";
import { MenuOptions } from './SideNav'
import Link from "next/link";

const Header = () => {
  const { userDetail } = useUserDetailContext()
  const [isMenuOpened, setisMenuOpened] = useState<boolean>(false)
  const path = usePathname()
  const router = useRouter()

  const handleNav = () => {
    router.push('/dashboard')
  }

  const HandleToggleMenu = () => {
    setisMenuOpened(!isMenuOpened)
  }

  return (
    <div className={`py-3 px-5 flex items-center justify-between shadow-md absolute top-0 w-full  
          ${isMenuOpened ? 'z-50' : ''}`}>
      <div className={`md:hidden fixed pt-[2rem] px-4 left-0 h-full bottom-0 bg-white z-[999] transition-transform duration-300 max-w-[60%] w-full ease-in-out md:transform-none
          ${isMenuOpened ? 'translate-x-0' : '-translate-x-full'}`}>
        {MenuOptions.map((item) => (
          <Link key={item.id} href={item.path}
            className={`flex items-center gap-3 p-3 hover:bg-primary cursor-pointer hover:text-white
              rounded-md ${path === item.path && 'bg-primary text-white'}`}>
            <span>
              {typeof item.icon === 'string' ? (
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
              ) : (
                <item.icon className="w-6 h-6" />
              )}
            </span>
            <h2>{item.name}</h2>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <button onClick={HandleToggleMenu} className="md:hidden">
          <Menu />
        </button>
        <Image src={'/logo.png'} width={30} height={30} alt="" className="w-auto h-auto" />
        <h2 className="font-bold text-xl hidden md:block">AI Short Vid</h2>
      </div>
      <div className="flex gap-3 items-center">
        <Image src={'/star.png'} height={20} width={20} alt="" />
        <h2>{userDetail?.credits}</h2>
        <Button onClick={handleNav}>Dashboard</Button>
        <UserButton />
      </div>
      {isMenuOpened && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={HandleToggleMenu}></div>
      )}
    </div>
  )
}

export default Header