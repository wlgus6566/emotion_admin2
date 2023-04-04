import { useRouter } from "next/router"
import Link from "next/link"
import { faTv, faBookOpen, faBook } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { memo } from "react"
import { cls } from "@/utils/utils"

const AppSidebar = memo(() => {
  const router = useRouter()
  return (
    <div
      style={{ transition: "all 0.35s" }}
      className="fixed w-72 h-full shadow-sm font-family-karla bg-primary z-20"
    >
      <div className="flex justify-center my-14">
        <picture>
          <Image
            src="/logo.svg"
            alt="emotion"
            width={180}
            height={100}
            style={{ width: "auto", height: "auto" }}
          />
        </picture>
      </div>
      <div className="flex flex-col">
        <Link href="/magazine">
          <div
            className={cls(
              "text-lg pl-10 py-6 rounded text-center cursor-pointer flex items-center transition-colors",
              router.pathname.includes("/magazine")
                ? "bg-red-700 text-white font-bold"
                : "text-white hover:bg-red-600"
            )}
          >
            <div className="mr-3">{<FontAwesomeIcon icon={faBookOpen} />}</div>
            <div>
              <p>Magazine</p>
            </div>
          </div>
        </Link>
        <Link href="/works">
          <div
            className={cls(
              "text-lg pl-10 py-6 rounded text-center cursor-pointer flex items-center transition-colors",
              router.pathname.includes("/works")
                ? "bg-red-700 text-white font-bold"
                : "text-white hover:bg-red-600"
            )}
          >
            <div className="mr-3">{<FontAwesomeIcon icon={faTv} />}</div>
            <div>
              <p>Works</p>
            </div>
          </div>
        </Link>
        <Link href="/introduction">
          <div
            className={`text-md pl-10 py-6 rounded text-center cursor-pointer flex items-center transition-colors ${
              router.pathname.includes("/introduction")
                ? "bg-red-700 text-white font-bold"
                : "text-white hover:bg-red-600"
            }`}
          >
            <div className="mr-3 text-lg">
              {<FontAwesomeIcon icon={faBook} />}
            </div>
            <div>
              <p>회사소개서 수정</p>
            </div>
          </div>
        </Link>

        <div className="absolute left-0 bottom-6 w-full">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/nav_logo.png"
              alt="company logo"
              width={50}
              height={50}
              style={{ width: "auto", height: "auto" }}
            />
            <p className="mt-6 text-white font-bold">MAKE · GREATNESS</p>
            <p className="mt-2 text-neutral-300 text-sm">
              위대함을 만들어 갑니다.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

AppSidebar.displayName = "AppSidebar"
export default AppSidebar
