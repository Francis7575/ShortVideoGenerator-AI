"use client";
import { ReactNode } from "react";
import { VideoDataProvider } from "./_context/VideoDataContext";
import {
  UserDataProvider,
} from "./_context/UserDetailContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

type ProviderProps = {
  children: ReactNode;
};

const Provider = ({ children }: ProviderProps) => {

  return (
    <UserDataProvider>
      <VideoDataProvider>
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}
        >
          <div>{children}</div>
        </PayPalScriptProvider>
      </VideoDataProvider>
    </UserDataProvider>
  );
};

export default Provider;
