import { createContext, ReactNode, useContext, useState } from "react";
import { userDataSchema } from '@/types/types'

type userDetailContextType = {
  userDetail: userDataSchema | null 
  setUserDetail: React.Dispatch<React.SetStateAction<userDataSchema | null>>;
}

const userDetailContext = createContext<userDetailContextType | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userDetail, setUserDetail] = useState<userDataSchema | null>(null);

  const value = {
    userDetail,
    setUserDetail
  };
  return <userDetailContext.Provider value={value}>{children}</userDetailContext.Provider>;
};

export const useUserDetailContext = () => {
  const context = useContext(userDetailContext);
  if (!context) {
    throw new Error("useVideoDataContext must be used within a VideoDataProvider");
  }
  return context;
};