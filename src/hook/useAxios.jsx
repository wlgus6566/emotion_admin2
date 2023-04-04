import axios from "axios"
import Cookies from "js-cookie"
import useSWR from "swr"
import Router from "next/router"

const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Authorization: `${Cookies.get("accessToken")}`,
  },
})

const fetcher = (url) => apiClient.get(url).then((res) => res.data)
export const useApiGet = (url) => {
  const { data, error } = useSWR(url, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
  }
}

export const useApiPost = (url, data, config) => {
  return apiClient.post(url, data, {
    ...apiClient.defaults,
    ...config,
  })
}

export const useApiPut = (url, data, config) => {
  return apiClient.put(url, data, {
    ...apiClient.defaults,
    ...config,
  })
}

export const useApiDelete = (url, config) => {
  return apiClient.delete(url, {
    ...apiClient.defaults,
    ...config,
  })
}

export const useApiLogout = () => {
  return apiClient.get("/api/logout")
}

// 에러처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      error.response.data.code === "ERR401_001"
    ) {
      try {
        const response = await apiClient.post(
          "/api/update-access-token",
          null,
          { withCredentials: true }
        )
        const res = await response.data.data
        const accessToken = await res.accessToken
        const email = await res.email
        if (accessToken) {
          await Cookies.set("accessToken", accessToken, {
            secure: process.env.NODE_NAME === "prod",
          })
          await Cookies.set("email", email)
        }
        apiClient.defaults.headers.Authorization = accessToken
        originalRequest.headers.Authorization = accessToken
        return apiClient(originalRequest)
      } catch (err) {
        console.log("Error updating access token:", err)
        throw error
      }
    } else if (
      error.response.data.code === "ERR401_002" || // 토큰 위변조
      error.response.data.code === "ERR401_003" || // 토큰 필수 값
      error.response.data.code === "ERR401_999" // 토큰 오류 서버 확인 필요
    ) {
      console.log(error.response.data.code)
      alert(`로그인을 진행해주세요. err:${error.response.data.code}`)
      if (Cookies.get("accessToken") && Cookies.get("email")) {
        Cookies.remove("accessToken")
        Cookies.remove("email")
      }
      Router.replace("/login", undefined, { shallow: true })
    } else {
      throw error
    }
  }
)
