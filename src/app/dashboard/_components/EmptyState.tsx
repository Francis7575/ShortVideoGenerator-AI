'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const EmptyState = () => {
  const router = useRouter()

  const handleNavigation = () => {
    router.push('/dashboard/create-new')
  }

  return (
    <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dashed">
      <h2>You don&apos;t have any short video created</h2>
      <Button onClick={handleNavigation}>
        Create New Short Video
      </Button>
    </div>
  )
}

export default EmptyState