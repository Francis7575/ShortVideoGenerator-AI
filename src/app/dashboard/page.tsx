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
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      GetVideoList();
    }
  }, [user]);

  const GetVideoList = async () => {
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
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Button onClick={() => router.replace('/dashboard/create-new')}>
          + Create New
        </Button>
      </div>

      {videoList?.length === 0 ? (
        <EmptyState />
      ) : (
        <VideoList videoList={videoList} />
      )}
    </div>
  )
}

export default Dashboard