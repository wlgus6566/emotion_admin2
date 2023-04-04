import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Loading from "@/components/global/loading"
import Button from "@/components/global/button"
import { useApiGet, useApiPut } from "@/hook/useAxios"

export default function MagazineList() {
  const [magazineSeq, setMagazineSeq] = useState("")
  const [sortingOrder, setSortingOrder] = useState("")
  const setMagNum = (val) => {
    const onlyNumber = val.replace(/[^0-9]/g, "")
    setMagazineSeq(onlyNumber)
  }
  const setSortNum = (val) => {
    const onlyNumber = val.replace(/[^0-9]/g, "")
    setSortingOrder(onlyNumber)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await useApiPut(
        `${process.env.BASE_URL}/api/magazine/updateSortingOrder`,
        [
          {
            magazineSeq,
            sortingOrder,
          },
        ]
      )
      if (response.data.code === "SUC001") {
        const res = await response.data.data
        await alert("성공적으로 수정되었습니다.")
        await setSortNum("")
        await setMagNum("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  /* use swr */
  const { data, error } = useApiGet(`/api/magazine/updateSortingOrder`)
  useEffect(() => {
    if (error) {
      console.log("Failed to load SortingOrder")
    }
  }, [error])
  return (
    <div className="pb-10">
      <PageTitle title="Magazine 정렬 순서 수정" />
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
                    className="p-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    magazineSeq
                  </th>
                  <th
                    scope="col"
                    className="p-4 w-4/6 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    pcTitle
                  </th>
                  <th
                    scope="col"
                    className="p-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    sortingOrder
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-800"
                  >
                    <th
                      scope="row"
                      className="p-4 text-sm text-base text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.magazineSeq}
                    </th>
                    <td className="p-4 text-sm text-base">{data.pcTitle}</td>
                    <td className="p-4 text-sm text-base">
                      {data.sortingOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sticky top-[100px] border p-4 h-72 bg-gray-100 rounded-2xl">
              <form
                onSubmit={handleSubmit}
                className="grid gap-3 pb-6 grid-cols-[3fr-1fr-3fr]"
              >
                <FormInput
                  value={magazineSeq}
                  onChange={(val) => setMagNum(val)}
                  name="magazineSeq"
                  placeholder="magazineSeq"
                  label="magazineSeq"
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
                <Button
                  type="submit"
                  name="순서 수정하기"
                  color="blue"
                  size="sm"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

MagazineList.layout = DefaultsLayout
