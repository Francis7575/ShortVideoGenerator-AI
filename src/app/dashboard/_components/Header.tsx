'use client'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserDetailContext } from "@/app/_context/UserDetailContext";

const Header = () => {
  const router = useRouter()
  const { userDetail } = useUserDetailContext()

  const handleNav = () => {
    router.push('/dashboard')
  }

  return (
    <div className="py-3 px-5 flex items-center justify-between shadow-md fixed top-0 w-full z-50 bg-white">
      <div className="flex gap-3 items-center">
        <Image src={'/logo.png'} width={30} height={30} alt="" className="w-auto h-auto" />
        <h2 className="font-bold text-xl hidden md:block">AI Short Vid</h2>
      </div>
      <div className="flex gap-3 items-center">
        <Image src={'/star.png'} height={20} width={20} alt="" />
        <h2>{userDetail?.credits}</h2>
        <Button onClick={handleNav}>Dashboard</Button>
        <UserButton />
      </div>
    </div>
  )
}

export default Header