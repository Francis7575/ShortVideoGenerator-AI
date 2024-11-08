'use client'
import { ReactNode } from "react"
import Header from "./_components/Header"
import SideNav from "./_components/SideNav"

type Props = {
  children: ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div>
      <div className="hidden md:block h-screen bg-white fixed mt-[65px]">
        <SideNav />
      </div>
      <div>
        <Header />
        <div className="md:ml-[261px] p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout