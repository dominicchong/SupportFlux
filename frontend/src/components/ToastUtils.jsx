import toast from "react-hot-toast";

// Warning toast
export const toastWarning = (message) => {
  return (
    toast(message, {
      icon: "⚠️",
      style: {  
        background: "#ffffff",
        color: "#b45309",             // amber text for warning
        border: "1px solid #fde68a",  // light yellow/orange border
      },
      iconTheme: {
        primary: "#f59e0b",           // amber
        secondary: "#ffffff",
      },
    })
  )
}

// Info toast
export const toastInfo = (message) => {
  return (
    toast(message, {
      icon: "ℹ️",
      style: {
        background: "#ffffff",
        color: "#2563eb",             // blue text for info
        border: "1px solid #bfdbfe",  // light blue border
      },
      iconTheme: {
        primary: "#3b82f6",           // blue
        secondary: "#ffffff",
      },
    })
  )
}
