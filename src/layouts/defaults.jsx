import AppSidebar from "@/components/app-sidebar"
import AppHeader from "@/components/app-header"
import { useState } from "react"
import { cls } from "@/utils/utils"

export default function DefaultsLayout({ children }) {
  const [toggle, setToggle] = useState(true)
  return (
    <>
      <div
        style={{ transition: "all 0.35s" }}
        className="fixed top-0 left-0 right-0 z-20"
      >
        <AppHeader toggle={toggle} setToggle={setToggle} />
      </div>
      {toggle && <AppSidebar />}
      <div
        style={{ transition: "all 0.35s" }}
        className={cls(
          "p-16 pt-40 flex-1 h-screen",
          !toggle ? "ml-0" : "ml-72"
        )}
      >
        {children}
      </div>
    </>
  )
}
