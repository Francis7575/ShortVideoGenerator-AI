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

type captionsItem = {
  text: string
  start: number
  end: number
  confidence: number
  speaker?: null
}

export type videoParams = {
  audioFileUrl: string
  captions: captionsItem[]
  imageList: string[]
  videoScript: VideoScriptItem[]
}
