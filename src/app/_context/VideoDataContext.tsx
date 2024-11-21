import { createContext, ReactNode, useContext, useState } from "react";
import { videoParams } from '@/types/types'

type VideoDataContextType = {
  videoData: videoParams | null
  setVideoData: React.Dispatch<React.SetStateAction<videoParams | null>>;
}

const VideoDataContext = createContext<VideoDataContextType | undefined>(undefined);

export const VideoDataProvider = ({ children }: { children: ReactNode }) => {
  const [videoData, setVideoData] = useState<videoParams | null>(null);

  const value = {
    videoData,
    setVideoData
  };
  return <VideoDataContext.Provider value={value}>{children}</VideoDataContext.Provider>;
};

export const useVideoDataContext = () => {
  const context = useContext(VideoDataContext);
  if (!context) {
    throw new Error("useVideoDataContext must be used within a VideoDataProvider");
  }
  return context;
};