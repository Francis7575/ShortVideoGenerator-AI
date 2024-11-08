'use client'
import { useState } from "react"
import SelectTopic from "./_components/SelectTopic"
import SelectStyle from "./_components/SelectStyle"
import SelectDuration from "./_components/SelectDuration"
import { Button } from "@/components/ui/button"

const CreateNew = () => {
  const [formData, setFormData] = useState([])

  const handleInputChange = (fieldName: string, fieldValue: string) => {
    console.log(fieldName, fieldValue);

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>
      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={handleInputChange}/>
        <SelectStyle onUserSelect={handleInputChange} />
        <SelectDuration onUserSelect={handleInputChange} />

        <Button className="mt-10 w-full">Create Short Video</Button>
      </div>
    </div>
  )
}

export default CreateNew