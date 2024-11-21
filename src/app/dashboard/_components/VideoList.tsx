import { videoDataSchema } from "@/types/types"
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { useState } from "react";
import PlayerDialog from "./PlayerDialog";

type VideoListProps = {
  videoList: videoDataSchema[];
};

const VideoList = ({ videoList }: VideoListProps) => {
  const [openDialog, setOpenDialog] = useState<number | boolean>(false);
  const [videoId, setVideoId] = useState<number>(0)

  const handleClick = (videoId: number) => {
    setOpenDialog(Date.now());  
    setVideoId(videoId);  
  };

  return (
    <div className="mt-10 flex flex-wrap justify-evenly gap-10">
      {videoList.map((video, idx) => (
        <div key={idx} className="cursor-pointer hover:scale-105 transition-all"
          onClick={() => handleClick(video?.id)}>
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={210}
            compositionHeight={300}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            style={{
              borderRadius: 15
            }}
            inputProps={{
              ...video,
              setDurationInFrame: () => { }
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openDialog} videoId={videoId} />
    </div>
  )
}

export default VideoList