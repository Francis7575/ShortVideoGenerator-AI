'use client'
import { MouseEvent, useState } from "react"
import SelectTopic from "./_components/SelectTopic"
import SelectStyle from "./_components/SelectStyle"
import SelectDuration from "./_components/SelectDuration"
import { Button } from "@/components/ui/button"

type formDataProps = {
  topic?: string
  imageStyle?: string
  duration?: string
}

const CreateNew = () => {
  const [formData, setFormData] = useState<formDataProps>({})

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
    getVideoScript()
  }

  const getVideoScript = async () => {
    const prompt =  'Write a script to generate ' + formData.duration + ' video on topic : ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContextText as field, No Plain text'
    console.log(prompt);
    
    // try {
    //   const response = await fetch('api/get-video-script', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       // prompt: 
    //     })
    //   })
    // } catch (e) {

    // }
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
    </div>
  )
}

export default CreateNew