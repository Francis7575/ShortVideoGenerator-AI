import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="py-3 px-5 flex items-center justify-between shadow-md">
      <div className="flex gap-3 items-center">
        <Image src={'/logo.png'} width={30} height={30} alt="" className="w-auto h-auto"/>
        <h2 className="font-bold text-xl">AI Short Vid</h2>
      </div>
      <div className="flex gap-3 items-center">
        <Button>Dashboard</Button>
        <UserButton />
      </div>
    </div>
  )
}

export default Header