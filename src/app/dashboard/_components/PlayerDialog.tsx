'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Player } from '@remotion/player';
import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db";
import { VideoData } from "@/config/schema";
import { eq } from "drizzle-orm";
import { captionsItem, videoDataSchema, VideoScriptItem } from "@/types/types";

type PlayerDialogProps = {
  playVideo: boolean
  videoId: number
}

const PlayerDialog = ({ playVideo, videoId }: PlayerDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState<videoDataSchema | null>(null);
  const [durationInFrame, setDurationInFrame] = useState<number>(100)

  useEffect(() => {
    if (playVideo && videoId) {
      setOpenDialog(true);
      GetVideoData();
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));

    if (result[0]) {
      const formattedData: videoDataSchema = {
        id: result[0].id,
        script: result[0].script as VideoScriptItem[],
        audioFileUrl: result[0].audioFileUrl,
        captions: result[0].captions as captionsItem[],
        imageList: result[0].imageList ?? [],
        createdBy: result[0].createdBy,
      };
      console.log(formattedData);
      setVideoData(formattedData);
    }
  };

  // Render dialog only on the client
  if (!openDialog || !videoData) return null;

  return (
    <Dialog open={openDialog}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader >
          <DialogTitle className="text-3xl font-bold my-5">Your video is ready</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Player
                component={RemotionVideo}
                durationInFrames={Number(durationInFrame.toFixed(0))}
                compositionWidth={300}
                compositionHeight={450}
                controls={true}
                fps={30}
                inputProps={{
                  ...videoData,
                  setDurationInFrame: (frameValue: number) => setDurationInFrame(frameValue)
                }}
              />
              <DialogFooter className='flex gap-10 mt-10'>
                <Button variant="ghost">
                  Close
                </Button>
                <Button>Export</Button>
              </DialogFooter>
            </div>

          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}

export default PlayerDialog