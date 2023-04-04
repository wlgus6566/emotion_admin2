import AuthLayout from "@/layouts/auth"
import FormInput from "@/components/global/form-input"
import Button from "@/components/global/button"
import { useState } from "react"
import axios from "axios"
import Router from "next/router"
import Cookies from "js-cookie"
import Image from "next/image"

export default function Login() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/api/login`,
        { id: id, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (response.data.code === "SUC001") {
        const res = await response.data.data
        const accessToken = await res.accessToken
        const email = await res.email
        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            secure: process.env.NODE_NAME === "prod",
          })
          Cookies.set("email", email)

          Router.push("/magazine", undefined, { shallow: true })
        }
      }
    } catch (error) {
      if (error.response.data.code === "ERR_LOGIN_001") {
        alert("회원정보가 없거나 비밀번호가 일치하지 않습니다")
      }
    }
  }

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen min-w-full overflow-hidden">
      <div
        className="flex flex-col flex-column items-center justify-center w-2/12"
        style={{ minWidth: "400px" }}
      >
        <div
          className="w-full"
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, #ee2c3c 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <form
            onSubmit={handleLogin}
            className="bg-white w-full py-20 px-16"
            style={{ borderRadius: "56px" }}
          >
            <div className="text-center mb-5 flex justify-center">
              <Image
                src="/logo_red.svg"
                alt="emotion"
                width={180}
                height={100}
              />
            </div>
            <div className="mt-12">
              <FormInput
                name="id"
                type="text"
                value={id}
                onChange={(val) => setId(val)}
                placeholder="아이디를 입력하세요."
                label="ID"
                autoFocus={true}
              />
              <div className="mt-5">
                <FormInput
                  name="password"
                  type="password"
                  value={password}
                  onChange={(val) => setPassword(val)}
                  label="Password"
                />
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <Button type="submit" name="Log In" size="lg" color="primary" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

Login.layout = AuthLayout
