'use client'
import { db } from "@/config/db"
import { Users } from "@/config/schema"
import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { ReactNode, useEffect } from "react"
import { VideoDataProvider } from "@/app/_context/VideoDataContext"

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
        console.log(result)

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
    <VideoDataProvider>
      <div>{children}</div>
    </VideoDataProvider>
  )
}

export default Provider