import "@/styles/globals.css"
import Head from "next/head"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"

config.autoAddCss = false

export default function App({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="이모션글로벌 관리자 사이트입니다." />
        <title>emotion global admin</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
