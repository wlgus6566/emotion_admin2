import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Loading from "@/components/global/loading"
import { useApiGet, useApiPut } from "@/hook/useAxios"

export default function WorksList() {
  const [worksSeq, setWorksSeq] = useState("")
  const [sortingOrder, setSortingOrder] = useState("")
  const setWorksNum = (val) => {
    const onlyNumber = val.replace(/[^0-9]/g, "")
    setWorksSeq(onlyNumber)
  }
  const setSortNum = (val) => {
    const onlyNumber = val.replace(/[^0-9]/g, "")
    setSortingOrder(onlyNumber)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await useApiPut(`/api/works/updateSortingOrder`, [
        {
          worksSeq,
          sortingOrder,
        },
      ])
      if (response.data.code === "SUC001") {
        console.log(response.data.data)
        await alert("성공적으로 수정되었습니다.")
        await setSortNum("")
        await setWorksNum("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const { data, error } = useApiGet(`/api/works/updateSortingOrder`)
  useEffect(() => {
    if (error) {
      console.log("Failed to load SortingOrder")
    }
  }, [error])
  return (
    <div className="pb-10">
      <PageTitle title="Works 정렬 순서 수정" />
      <div className="relative shadow-md sm:rounded-lg bg-white min-h-[610px] p-4">
        {!data && <Loading />}
        {error && <div>에러 발생: {error.message}</div>}
        {data && (
          <div className="grid gap-6 mb-6 grid-cols-[3fr,1fr] relative">
            <table className="text-sm text-left text-gray-500 dark:text-gray-400 border">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="p-4 w-2/12 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    sortingOrder
                  </th>
                  <th
                    scope="col"
                    className="p-4 w-6/12 pr-20 text-center text-xs font-medium text-gray-500 uppercase"
                  >
                    serviceName
                  </th>

                  <th
                    scope="col"
                    className="p-4 w-2/12 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    worksSeq
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((data) => (
                  <tr
                    key={data.worksSeq}
                    className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-800"
                  >
                    <th className="p-4 text-sm text-base">
                      {data.sortingOrder}
                    </th>
                    <td className="p-4 text-sm text-base text-center pr-20">
                      {data.serviceName}
                    </td>
                    <td
                      scope="row"
                      className="p-4 text-sm text-base text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.worksSeq}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sticky top-[100px] border p-4 h-72 bg-gray-100 rounded-2xl">
              <form
                onSubmit={handleSubmit}
                className="grid gap-3 mb-6 grid-cols-[3fr-1fr-3fr]"
              >
                <FormInput
                  value={worksSeq}
                  onChange={(val) => setWorksNum(val)}
                  name="worksSeq"
                  placeholder="worksSeq"
                  label="worksSeq"
                />
                <span className="text-center">
                  {<FontAwesomeIcon icon={faArrowDown} />}
                </span>
                <FormInput
                  value={sortingOrder}
                  onChange={(val) => setSortNum(val)}
                  name="sortingOrder"
                  placeholder="sortingOrder"
                  label="sortingOrder"
                />
                <button className="absolute right-4 bottom-4 text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  순서 수정하기
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

WorksList.layout = DefaultsLayout
