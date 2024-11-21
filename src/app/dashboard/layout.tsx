'use client'
import { ReactNode, useState } from "react"
import Header from "./_components/Header"
import SideNav from "./_components/SideNav"
import { useVideoDataContext } from "../_context/VideoDataContext"

type Props = {
  children: ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  const { videoData, setVideoData } = useVideoDataContext()

  return (
    <div>
      <div className="hidden md:block h-screen bg-white fixed mt-[65px]">
        <SideNav />
      </div>
      <div>
        <Header />
        <div className="md:ml-[261px] p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout