'use client'
import { useUserDetailContext } from "@/app/_context/UserDetailContext"
import { Button } from "@/components/ui/button"
import { db } from "@/config/db"
import { Users } from "@/config/schema"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"
import { useState } from "react"

type BuyCreditsProps = {
  credits?: number
  amount?: number
}

const BuyCreditsPage = () => {
  const [selectedOption, setSelectedOption] = useState<BuyCreditsProps | null>(null)
  const router = useRouter()

  const { userDetail, setUserDetail } = useUserDetailContext()

  const creditsOption = [
    { credits: 10, amount: 2.99 },
    { credits: 20, amount: 5.99 },
    { credits: 30, amount: 7.99 },
    { credits: 50, amount: 6.99 },
    { credits: 100, amount: 9.99 }
  ];

  const onPaymentSuccess = async () => {
    console.log("Payment Success");
    // Update user details db
    if (selectedOption) {
      const result = await db.update(Users).set({
        credits: (userDetail?.credits || 0) + (selectedOption?.credits || 0)
      }).returning({ id: Users.id })

      if (result) {
        setUserDetail(prev => ({
          ...prev,
          credits: (userDetail?.credits || 0) + (selectedOption?.credits || 0)
        }))
        router.push('/dashboard')
      }
    }
  }

  return (
    <div>
      <h2 className="font-bold text-2xl">Buy More Credits</h2>
      <p>Unlock endless possibilities - Buy more credits to create your ideal videos!✨</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 gap-6">
        {creditsOption.map((item, idx) => (
          <div key={idx} className={`flex flex-col gap-2 justify-center items-center border border-lightgray p-4 md:py-7 md:px-5 rounded-lg max-w-[230px]
            ${selectedOption?.credits == item.credits && 'border-primary'}`}>

            <h2 className="font-bold text-3xl">{item.credits}</h2>
            <h2 className="font-medium text-xl">Credits</h2>
            <Button className="w-full" onClick={() => setSelectedOption(item)}>
              Select
            </Button>
            <h2 className="font-medium text-primary">${item.amount}</h2>
          </div>
        ))}
      </div>
      <div className="mt-16 max-w-[400px] mx-auto">
        {selectedOption?.amount && (
          <PayPalButtons style={{ layout: "horizontal" }}
            onApprove={(data, actions) => {
              if (actions && actions.order) {
                return actions.order.capture().then(onPaymentSuccess).catch(console.error);
              } else {
                console.warn("Actions object is undefined");
                return Promise.resolve(); // Return a resolved promise to maintain the function's return type
              }
            }}
            onCancel={() => console.log("Payment Cancel")}
            createOrder={(data, actions) => {
              return actions?.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption?.amount?.toFixed(2) || '0.00',
                      currency_code: 'USD'
                    }
                  }
                ]
              })
            }}
            forceReRender={[selectedOption]} // cause re-render to update selectedOption when changing option properly
          />
        )}
      </div>
    </div>
  )
}

export default BuyCreditsPage