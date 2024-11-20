'use client'
import { RemotionVideoProps } from "@/types/types"
import { useEffect } from "react"
import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig } from "remotion"


const RemotionVideo = ({ script, imageList, audioFileUrl, captions, setDurationInFrame }: RemotionVideoProps) => {

  const { fps } = useVideoConfig()
  const frame = useCurrentFrame();

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

  const getCurrentCaptions = () => {
    const currentTime = frame / 30 * 1000 //Convert frame number to milliSeconds (30fps)
    const currentCaption = captions?.find((w) => currentTime >= w.start && currentTime <= w.end)
    return currentCaption ? currentCaption?.text : '';
  }

  return (
    <AbsoluteFill className='bg-black'>
      {imageList?.map((item, idx) => {
        const startFrame = (idx * durationFrames) / imageList?.length;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationFrames}>
            <AbsoluteFill>
              <Img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <AbsoluteFill style={{
                color: 'white',
                justifyContent: 'center',
                top: undefined,
                bottom: 50,
                height: 150,
                textAlign: 'center',
                width: '100%'
              }}>
                <h2 className="text-2xl">
                  {getCurrentCaptions()}
                </h2>
              </AbsoluteFill>
            </AbsoluteFill>

          </Sequence>
        )
      })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>

  )
}

export default RemotionVideo