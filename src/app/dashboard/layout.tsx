import { ReactNode } from "react"
import Header from "./_components/Header"

type Props = {
  children: ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div>
      <div>
        <Header />
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout