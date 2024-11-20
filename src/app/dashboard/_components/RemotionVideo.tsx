'use client'
import { RemotionVideoProps } from "@/types/types"
import { useEffect } from "react"
import { AbsoluteFill, Img, Sequence, useVideoConfig } from "remotion"


const RemotionVideo = ({ script, imageList, audioFileUrl, captions, setDurationInFrame }: RemotionVideoProps) => {

  const { fps } = useVideoConfig()

  useEffect(() => {
    if (captions && captions.length > 0) {
      const lastCaption = captions[captions.length - 1]
      const frameValue = (lastCaption.end / 1000) * fps
      setDurationInFrame(frameValue) // Update the duration in the parent component
    }
  }, [captions, fps, setDurationInFrame]) // Only run when captions or fps change

  const durationFrames = (captions && captions.length > 0) 
    ? (captions[captions.length - 1].end / 1000) * fps
    : 0;
  
  return (
    <AbsoluteFill className='bg-black'>
      {imageList?.map((item, idx) => {
        const startFrame = (idx * durationFrames) / imageList?.length;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationFrames}>
            <Img
              src={item}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Sequence>
        )
      })}

    </AbsoluteFill>

  )
}

export default RemotionVideo