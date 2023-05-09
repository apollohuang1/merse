import { useState } from "react"


export const useNotifications = () => {

  const [showNotifications, setShowNotifications] = useState<boolean>(false)

  return {
    showNotifications,
    setShowNotifications
  }

}