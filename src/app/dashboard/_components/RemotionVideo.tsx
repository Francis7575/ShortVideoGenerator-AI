import { RemotionVideoProps } from "@/types/types"
import { AbsoluteFill, Img, Sequence, useVideoConfig } from "remotion"


const RemotionVideo = ({ script, imageList, audioFileUrl, captions, setDurationInFrame }: RemotionVideoProps) => {

  const { fps } = useVideoConfig()

  const getDurationFrames = (): number => {
    if (captions && captions.length > 0) {
      const lastCaption = captions[captions.length - 1]
      const frameValue = (lastCaption.end / 1000) * fps; // Calculate and return duration in frames
      setDurationInFrame(frameValue); // Pass lastCaption to the setter prop
      return frameValue
    }
    return 0; // Return 0 if no captions are available
  };

  const durationFrames = getDurationFrames() / (imageList?.length || 1);

  return (
    <AbsoluteFill className='bg-black'>
      {imageList?.map((item, idx) => (
        <Sequence key={idx} from={idx * durationFrames} durationInFrames={durationFrames}>
          <Img
            src={item}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Sequence>
      ))}

    </AbsoluteFill>

  )
}

export default RemotionVideo