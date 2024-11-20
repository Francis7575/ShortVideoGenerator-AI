'use client'
import { RemotionVideoProps } from "@/types/types"
import { useEffect } from "react"
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion"


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
        const startTime = (idx * durationFrames) / imageList?.length;

        const scale =(idx: number)=> interpolate(
          frame,
          [startTime, startTime + durationFrames / 2, startTime + durationFrames], // Zoom in and then zoom out
          idx%2==0 ?[1, 1.3, 1]:[1.8,1,1.8], // Scale from 1 (original) to 1.3 (zoomed-in) and back to 1
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        return (
          <Sequence key={idx} from={startTime} durationInFrames={durationFrames}>
            <AbsoluteFill>
              <Img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform:`scale(${scale(idx)})`
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