'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { SelectProps } from "@/types/types"

const SelectTopic = ({ onUserSelect }: SelectProps) => {
  const options = ['Custom Prompt', 'Random AI', 'Scary Story', 'Historical Facts', 'Bed Time Story', 'Motivational', 'Fun Facts']
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined)

  return (
    <div>
      <h2 className='font-bold text-2xl text-primary'>Content</h2>
      <p className='text-gray-500'>
        What is the topic of your video?
      </p>
      <Select onValueChange={(value) => {
        setSelectedOption(value)
        value != 'Custom Prompt' && onUserSelect('topic', value)
      }}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item, idx) => (
            <SelectItem key={idx} value={item}>{item}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOption === 'Custom Prompt' && (
        <Textarea onChange={(e) => onUserSelect('topic', e.target.value)}
          className="mt-3" placeholder="Write prompt on which you want to generate video" />
      )}
    </div>
  )
}

export default SelectTopic