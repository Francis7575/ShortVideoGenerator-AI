'use client'
import { ReactNode, useCallback, useEffect } from "react"
import Header from "./_components/Header"
import SideNav from "./_components/SideNav"
import { useUserDetailContext } from "../_context/UserDetailContext"
import { useUser } from "@clerk/nextjs"
import { Users } from "@/config/schema"
import { eq } from "drizzle-orm"
import { db } from "@/config/db"
import { userDataSchema } from "@/types/types"

type Props = {
  children: ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  const { setUserDetail } = useUserDetailContext()
  const { user } = useUser()

  const GetUserDetail = useCallback(async () => {
    try {
      let result: userDataSchema[] = []
      if (user?.primaryEmailAddress?.emailAddress) {
        result = await db.select().from(Users)
          .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress))
      }
      if (result.length > 0) {
        setUserDetail(result[0])
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }, [user, setUserDetail])

  useEffect(() => {
    if (user) {
      GetUserDetail()
    }
  }, [user, GetUserDetail])

  return (
    <div>
      <div className="hidden md:block h-screen bg-white fixed mt-[65px]">
        <SideNav />
      </div>
      <div>
        <Header />
        <div className="md:ml-[261px] pt-[5.2rem] pb-6 md:pb-10 px-6 md:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout