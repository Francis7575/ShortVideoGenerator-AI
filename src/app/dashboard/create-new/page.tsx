'use client'
import { MouseEvent, useEffect, useState } from "react"
import SelectTopic from "./_components/SelectTopic"
import SelectStyle from "./_components/SelectStyle"
import SelectDuration from "./_components/SelectDuration"
import { Button } from "@/components/ui/button"
import CustomLoading from "./_components/CustomLoading"
import { v4 as uuidv4 } from 'uuid';
import { useVideoDataContext } from "@/app/_context/VideoDataContext"

type formDataProps = {
  topic?: string
  imageStyle?: string
  duration?: string
}

type VideoScriptItem = {
  contextText: string;
  imagePrompt?: string;
};

const CreateNew = () => {
  const [formData, setFormData] = useState<formDataProps>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [videoScript, setVideoScript] = useState<VideoScriptItem[] | undefined>()
  const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>()
  const [captions, setCaptions] = useState<string | undefined>()
  const [imageList, setImageList] = useState<string[]>([])
  const { videoData, setVideoData } = useVideoDataContext()

  const handleInputChange = (fieldName: string, fieldValue: string) => {
    console.log(fieldName, fieldValue);

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const createClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Button clicked, starting getVideoScript...");
    GetVideoScript()
    // GenerateAudioFile(scriptData)
    // GenerateAudioCaption(fileUrl)
    // GenerateImage()
  }

  const GetVideoScript = async () => {
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic : ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContextText as field, No Plain text'
    try {
      setLoading(true)
      const response = await fetch('/api/get-video-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json()
      setVideoData(prev => ({
        ...prev,
        'videoScript': data.result
      }))
      setVideoScript(data.result)
      await GenerateAudioFile(data.result)
    } catch (e) {
      console.error('Failed to fetch video script:', e);
    } finally {
      setLoading(false)
    }
  }

  // Generate audio file and save to firebase storage
  const GenerateAudioFile = async (videoScriptData: VideoScriptItem[] | undefined) => {
    let script = '';
    const id = uuidv4();
    videoScriptData?.forEach((item: VideoScriptItem) => {
      script = script + item.contextText + ' '
    })
    // console.log(script);
    setLoading(true)
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ text: script, id: id })
      })
      const data = await response.json()
      setVideoData(prev => ({
        ...prev,
        'audioFileUrl': data.result
      }))
      setAudioFileUrl(data.result)
      data.result && await GenerateAudioCaption(data.result, videoScriptData)
    } catch (e) {
      console.error('Error generate audio file:', e)
    }
  }

  // Used to generate caption from audio file
  const GenerateAudioCaption = async (fileUrl: string, videoScriptData: VideoScriptItem[] | undefined) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioFile: fileUrl })
      })
      const data = await response.json()
      setVideoData(prev => ({
        ...prev,
        'captions': data.result
      }))
      setCaptions(data.result)
      data.result && await GenerateImage(videoScriptData);

    } catch (e) {
      console.error('Error generate audio caption:', e)
    } finally {
      setLoading(false)
    }
  }

  // Used to Generate AI Images
  const GenerateImage = async (videoScriptData: VideoScriptItem[] | undefined) => {
    setLoading(true)
    try {
      const imageFiles: string[] = [];
      let index = 0;

      for (const item of videoScriptData || []) {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompts: item.imagePrompt }),
        });
        const data = await response.json();
        imageFiles.push(data.result);
      }
      setVideoData(prev => ({
        ...prev,
        'imageList': imageFiles
      }))
      setImageList(imageFiles);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log(videoData);
  }, [videoData])

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>
      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={handleInputChange} />
        <SelectStyle onUserSelect={handleInputChange} />
        <SelectDuration onUserSelect={handleInputChange} />

        <Button onClick={createClickHandler}
          className="mt-10 w-full">
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  )
}

export default CreateNew