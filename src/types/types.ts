export type SelectProps = {
  onUserSelect: (fieldName: string, fieldValue: string) => void
}

export type formDataProps = {
  topic?: string
  imageStyle?: string
  duration?: string
}

export type VideoScriptItem = {
  contextText: string;
  imagePrompt?: string;
};

export type captionsItem = {
  text: string
  start: number
  end: number
  confidence: number
  speaker?: null
}

export type videoParams = {
  audioFileUrl?: string
  captions?: captionsItem[]
  imageList?: string[]
  script?: VideoScriptItem[]
}

export type RemotionVideoProps = {
  audioFileUrl?: string
  captions?: captionsItem[]
  imageList?: string[]
  script?: VideoScriptItem[]
  setDurationInFrame: (lastCaption: number) => void
}

export type videoDataSchema = {
  id: number
  script: VideoScriptItem[]
  audioFileUrl: string 
  captions: captionsItem[]
  imageList: string[]
  createdBy: string 
}