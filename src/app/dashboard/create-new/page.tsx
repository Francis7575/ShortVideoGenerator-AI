'use client'
import { MouseEvent, useState } from "react"
import SelectTopic from "./_components/SelectTopic"
import SelectStyle from "./_components/SelectStyle"
import SelectDuration from "./_components/SelectDuration"
import { Button } from "@/components/ui/button"
import CustomLoading from "./_components/CustomLoading"
import { v4 as uuidv4 } from 'uuid';

type formDataProps = {
  topic?: string
  imageStyle?: string
  duration?: string
}

type VideoScriptItem = {
  contextText: string;
  imagePrompt?: string;
};

const scriptData = 'Early humans lived in caves for shelter and warmth, and used fire for cooking and light. The ancient Egyptians were known for their incredible pyramids, built as tombs for pharaohs. The Roman Empire was a vast empire known for its powerful armies, impressive infrastructure, and thrilling entertainment like gladiator contests and chariot races. Medieval knights were warriors who wore heavy armor and fought on horseback, often during tournaments or battles. Explorers sailed the seas, discovering new lands and expanding knowledge of the world. Galileo Galilei was a famous astronomer who challenged the prevailing belief that the Earth was the center of the universe. Technology has evolved rapidly throughout history, from the printing press to the internet.'

const CreateNew = () => {
  const [formData, setFormData] = useState<formDataProps>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [videoScript, setVideoScript] = useState<VideoScriptItem[] | string>()
  const [audioFileUrl, setAudioFileUrl] = useState()

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
    GenerateAudioFile(scriptData)
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
      console.log(data.result);
      setVideoScript(data.result)
      GenerateAudioFile(data.result)
    } catch (e) {
      console.error('Failed to fetch video script:', e);
    } finally {
      setLoading(false)
    }
  }

  const GenerateAudioFile = async (videoScriptData: VideoScriptItem[] | string) => {
    // let script = '';
    const id = uuidv4();
    // videoScriptData.forEach((item) => {
    //   script = script + item.contextText + ' '
    // })
    // console.log(script);
    setLoading(true)
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ text: videoScriptData, id: id })
      })
      const data = await response.json()
      setAudioFileUrl(data.result)
    } catch (e) {
      console.error('Error generate audio file:', e)
    } finally {
      setLoading(false)
    }
  }

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