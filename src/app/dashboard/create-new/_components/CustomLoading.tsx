import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

type CustomLoadingProps = {
  loading: boolean
}

const CustomLoading = ({loading}: CustomLoadingProps) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogTitle className="flex flex-col items-center my-10">
          <Image src={'/loading.gif'} width={100} height={100} alt=""/>
          <AlertDialogDescription>Generating your video... Do not Refresh</AlertDialogDescription>
        </AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default CustomLoading