import { faBars, faUser, faSignOut } from "@fortawesome/free-solid-svg-icons"
import Cookies from "js-cookie"
import Router from "next/router"
import { memo, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useApiLogout } from "@/hook/useAxios"
import { cache } from "swr/_internal"

const AppHeader = memo(({ toggle, setToggle }) => {
  const [email, setEmail] = useState("")
  useEffect(() => setEmail(`${Cookies.get("email")}`), [])

  const handleLogout = async () => {
    try {
      if (!confirm("로그아웃 하시겠습니까?")) {
        return
      }
      const response = await useApiLogout()
      if (response.data.code === "SUC001") {
        if (Cookies.get("accessToken") && Cookies.get("email")) {
          Cookies.remove("accessToken")
          Cookies.remove("email")
          cache.clear()
        }
        alert("로그아웃 되셨습니다.")
        Router.replace("/login", undefined, { shallow: true })
      }
    } catch (error) {
      console.log("Error during logout:", error)
    }
  }

  return (
    <header className="flex justify-between items-center w-full bg-white p-5 z-10 pl-80 py-4 px-20">
      <button onClick={() => setToggle(!toggle)}>
        <FontAwesomeIcon className="text-3xl" icon={faBars} />
      </button>
      <div className="w-100 relative flex items-center justify-end">
        <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none">
          <FontAwesomeIcon icon={faUser} />
        </span>
        <span>{email} 님</span>
        <button onClick={handleLogout}>
          <span className="flex align ml-4 font-bold">
            LogOut
            <FontAwesomeIcon className="text-l ml-2 mt-1" icon={faSignOut} />
          </span>
        </button>
      </div>
    </header>
  )
})
AppHeader.displayName = "AppHeader"
export default AppHeader
