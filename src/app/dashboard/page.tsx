'use client'
import { useEffect, useState } from "react"
import EmptyState from "./_components/EmptyState"
import { db } from "@/config/db"
import { VideoData } from "@/config/schema"
import { eq } from "drizzle-orm"
import { useUser } from "@clerk/nextjs"
import { videoDataSchema } from "@/types/types"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import VideoList from "./_components/VideoList"

const Dashboard = () => {
  const [videoList, setVideoList] = useState<videoDataSchema[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      GetVideoList();
    }
  }, [user]);

  const GetVideoList = async () => {
    setIsLoading(true)
    try {
      const result = await db.select().from(VideoData)
        .where(user?.primaryEmailAddress?.emailAddress
          ? eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress)
          : undefined)

      console.log(result);
      // Transform data to match the `videoDataSchema` type
      const formattedResult: videoDataSchema[] = result.map((item) => ({
        id: item.id,
        script: Array.isArray(item.script) ? item.script : [],
        audioFileUrl: item.audioFileUrl || "",
        captions: Array.isArray(item.captions) ? item.captions : [],
        imageList: item.imageList || [],
        createdBy: item.createdBy || "",
      }));

      setVideoList(formattedResult);
    } catch (error) {
      console.error("Error fetching video list:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Button onClick={() => router.replace('/dashboard/create-new')}>
          + Create New
        </Button>
      </div>

      {isLoading &&
        <p className="flex justify-center font-medium items-center min-h-screen text-2xl">
          Loading...
        </p>
      }
      {!isLoading && videoList.length === 0 && <EmptyState />}
      {!isLoading && videoList.length > 0 && <VideoList videoList={videoList} />}
    </div>
  )
}

export default Dashboard