'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import EmptyState from "./_components/EmptyState"
import Link from "next/link"

const Dashboard = () => {
  const [videoList, setVideoList] = useState([])
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Link href={"/dashboard/create-new"}>
        <Button>+ Create New</Button>
      </Link>
      </div>
      
      {videoList?.length === 0 ? (
        <EmptyState />
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Dashboard