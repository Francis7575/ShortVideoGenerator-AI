import { createContext, ReactNode, useContext, useState } from "react";

type VideoDataContextType = {
  videoData: string[];
  setVideoData: React.Dispatch<React.SetStateAction<string[]>>;
}

const VideoDataContext = createContext<VideoDataContextType | undefined>(undefined);

export const VideoDataProvider  = ({ children }: { children: ReactNode }) => {
  const [videoData, setVideoData] = useState<string[]>([]);

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