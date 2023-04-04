import { memo } from "react"

const PageTitle = memo(({ title }) => {
  {
    return <p className="text-gray-700 text-3xl mb-8 font-bold">{title}</p>
  }
})
PageTitle.displayName = "PageTitle"
export default PageTitle
