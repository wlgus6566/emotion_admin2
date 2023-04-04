"use client"
import React, { useEffect } from "react"
import Router from "next/router"
import Cookies from "js-cookie"

export default function Home() {
  useEffect(() => {
    if (Cookies.get("accessToken")) {
      Router.replace("/magazine", undefined, { shallow: true })
    } else {
      Router.replace("/login", undefined, { shallow: true })
    }
  })
}
