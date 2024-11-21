'use client'
import { db } from "@/config/db"
import { Users } from "@/config/schema"
import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { ReactNode, useEffect } from "react"
import { VideoDataProvider } from "./_context/VideoDataContext"
import { UserDataProvider } from "./_context/UserDetailContext"
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

type ProviderProps = {
  children: ReactNode
}
const Provider = ({ children }: ProviderProps) => {
  const { user } = useUser()

  useEffect(() => {
    const checkIfNewUser = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const result = await db
          .select()
          .from(Users)
          .where(eq(Users.email, user.primaryEmailAddress.emailAddress))

        if (!result) {
          await db.insert(Users).values({
            name: user?.fullName || '',
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl
          })
        }
      }
    }
    checkIfNewUser()
  }, [user])

  return (
    <UserDataProvider>
      <VideoDataProvider>
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
          <div>{children}</div>
        </PayPalScriptProvider>
      </VideoDataProvider>
    </UserDataProvider>
  )
}

export default Provider